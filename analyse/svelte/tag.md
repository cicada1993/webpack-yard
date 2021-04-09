# tag函数分析 主要处理 <tagName /tagName>
```
export default function tag(parser: Parser) {
	const start = parser.index++;

	let parent = parser.current();

    // 碰到的是 <!--  --> 注释标记
	if (parser.eat('!--')) {
		const data = parser.read_until(/-->/);
		parser.eat('-->', true, 'comment was left open, expected -->');

		parser.current().children.push({
			start,
			end: parser.index,
			type: 'Comment',
			data
		});

		return;
	}

    // 判断是否自闭合标签 <tag_name/>
	const is_closing_tag = parser.eat('/');

    // 读取标签名
	const name = read_tag_name(parser);

    // 命中系统标签
	if (meta_tags.has(name)) {
		const slug = meta_tags.get(name).toLowerCase();
		if (is_closing_tag) {
			if (
				(name === 'svelte:window' || name === 'svelte:body') &&
				parser.current().children.length
			) {
				parser.error({
					code: `invalid-${slug}-content`,
					message: `<${name}> cannot have children`
				}, parser.current().children[0].start);
			}
		} else {
			if (name in parser.meta_tags) {
				parser.error({
					code: `duplicate-${slug}`,
					message: `A component can only have one <${name}> tag`
				}, start);
			}

			if (parser.stack.length > 1) {
				parser.error({
					code: `invalid-${slug}-placement`,
					message: `<${name}> tags cannot be inside elements or blocks`
				}, start);
			}

			parser.meta_tags[name] = true;
		}
	}

	const type = meta_tags.has(name)
		? meta_tags.get(name)
		: (/[A-Z]/.test(name[0]) || name === 'svelte:self' || name === 'svelte:component') ? 'InlineComponent'
			: name === 'svelte:fragment' ? 'SlotTemplate'
				: name === 'title' && parent_is_head(parser.stack) ? 'Title'
					: name === 'slot' && !parser.customElement ? 'Slot' : 'Element';

    // 构造节点信息
	const element: TemplateNode = {
		start,
		end: null, // filled in later
		type,
		name,
		attributes: [],
		children: []
	};

	parser.allow_whitespace();

	if (is_closing_tag) {
		if (is_void(name)) {
			parser.error({
				code: 'invalid-void-content',
				message: `<${name}> is a void element and cannot have children, or a closing tag`
			}, start);
		}

		parser.eat('>', true);

		// close any elements that don't have their own closing tags, e.g. <div><p></div>
		while (parent.name !== name) {
			if (parent.type !== 'Element') {
				const message = parser.last_auto_closed_tag && parser.last_auto_closed_tag.tag === name
					? `</${name}> attempted to close <${name}> that was already automatically closed by <${parser.last_auto_closed_tag.reason}>`
					: `</${name}> attempted to close an element that was not open`;
				parser.error({
					code: 'invalid-closing-tag',
					message
				}, start);
			}

			parent.end = start;
			parser.stack.pop();

			parent = parser.current();
		}

		parent.end = parser.index;
		parser.stack.pop();

		if (parser.last_auto_closed_tag && parser.stack.length < parser.last_auto_closed_tag.depth) {
			parser.last_auto_closed_tag = null;
		}

		return;
	} else if (closing_tag_omitted(parent.name, name)) {
		parent.end = start;
		parser.stack.pop();
		parser.last_auto_closed_tag = {
			tag: parent.name,
			reason: name,
			depth: parser.stack.length
		};
	}

	const unique_names: Set<string> = new Set();

	let attribute;
	while ((attribute = read_attribute(parser, unique_names))) {
		element.attributes.push(attribute);
		parser.allow_whitespace();
	}

	if (name === 'svelte:component') {
		const index = element.attributes.findIndex(attr => attr.type === 'Attribute' && attr.name === 'this');
		if (!~index) {
			parser.error({
				code: 'missing-component-definition',
				message: "<svelte:component> must have a 'this' attribute"
			}, start);
		}

		const definition = element.attributes.splice(index, 1)[0];
		if (definition.value === true || definition.value.length !== 1 || definition.value[0].type === 'Text') {
			parser.error({
				code: 'invalid-component-definition',
				message: 'invalid component definition'
			}, definition.start);
		}

		element.expression = definition.value[0].expression;
	}

	// special cases – top-level <script> and <style>
	if (specials.has(name) && parser.stack.length === 1) {
		const special = specials.get(name);

		parser.eat('>', true);
		const content = special.read(parser, start, element.attributes);
		if (content) parser[special.property].push(content);
		return;
	}

	parser.current().children.push(element);

	const self_closing = parser.eat('/') || is_void(name);

	parser.eat('>', true);

	if (self_closing) {
		// don't push self-closing elements onto the stack
		element.end = parser.index;
	} else if (name === 'textarea') {
		// special case
		element.children = read_sequence(
			parser,
			() =>
				parser.template.slice(parser.index, parser.index + 11) === '</textarea>'
		);
		parser.read(/<\/textarea>/);
		element.end = parser.index;
	} else if (name === 'script' || name === 'style') {
		// special case
		const start = parser.index;
		const data = parser.read_until(new RegExp(`</${name}>`));
		const end = parser.index;
		element.children.push({ start, end, type: 'Text', data });
		parser.eat(`</${name}>`, true);
		element.end = parser.index;
	} else {
		parser.stack.push(element);
	}
}
```
# svelte/compile Component类分析
```
export default class Component {
    	constructor(
		ast: Ast,
		source: string,
		name: string,
		compile_options: CompileOptions,
		stats: Stats,
		warnings: Warning[]
	) {
		this.name = { type: 'Identifier', name };

		this.stats = stats;
		this.warnings = warnings;
		this.ast = ast;
		this.source = source;
		this.compile_options = compile_options;

		// the instance JS gets mutated, so we park
		// a copy here for later. TODO this feels gross
		this.original_ast = clone({
			html: ast.html,
			css: ast.css,
			instance: ast.instance,
			module: ast.module
		});

		this.file =
			compile_options.filename &&
			(typeof process !== 'undefined'
				? compile_options.filename
					.replace(process.cwd(), '')
					.replace(/^[/\\]/, '')
				: compile_options.filename);
		this.locate = getLocator(this.source, { offsetLine: 1 });

		// styles
		this.stylesheet = new Stylesheet({
			source,
			ast,
			filename: compile_options.filename,
			component_name: name,
			dev: compile_options.dev,
			get_css_hash: compile_options.cssHash
		});
		this.stylesheet.validate(this);

		this.component_options = process_component_options(
			this,
			this.ast.html.children
		);
		this.namespace =
			namespaces[this.component_options.namespace] ||
			this.component_options.namespace;

		if (compile_options.customElement) {
			if (
				this.component_options.tag === undefined &&
				compile_options.tag === undefined
			) {
				const svelteOptions = ast.html.children.find(
					child => child.name === 'svelte:options'
				) || { start: 0, end: 0 };
				this.warn(svelteOptions, {
					code: 'custom-element-no-tag',
					message: 'No custom element \'tag\' option was specified. To automatically register a custom element, specify a name with a hyphen in it, e.g. <svelte:options tag="my-thing"/>. To hide this warning, use <svelte:options tag={null}/>'
				});
			}
			this.tag = this.component_options.tag || compile_options.tag;
		} else {
			this.tag = this.name.name;
		}

		this.walk_module_js();
		this.walk_instance_js_pre_template();

		this.fragment = new Fragment(this, ast.html);
		this.name = this.get_unique_name(name);

		this.walk_instance_js_post_template();

		this.elements.forEach(element => this.stylesheet.apply(element));
		if (!compile_options.customElement) this.stylesheet.reify();
		this.stylesheet.warn_on_unused_selectors(this);
	}
}
```
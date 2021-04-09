# svelte/compiler compile方法分析
```
export default function compile(source: string, options: CompileOptions = {}) {
    // 编译参数
	options = Object.assign({ generate: 'dom', dev: false }, options);

    // 记录编译信息
	const stats = new Stats();
	const warnings = [];

    // 校验编译参数
	validate_options(options, warnings);

	stats.start('parse');
    // 生成语法树 类型如下
    <!-- export interface Ast {
        html: TemplateNode;
        css: Style;
        instance: Script;
        module: Script;
    } -->

	const ast = parse(source, options);
	stats.stop('parse');

	stats.start('create component');

    // 创建组件
	const component = new Component(
		ast,
		source,
		options.name || get_name_from_filename(options.filename) || 'Component',
		options,
		stats,
		warnings
	);
	stats.stop('create component');

    // 渲染组件
	const result = options.generate === false
		? null
		: options.generate === 'ssr'
			? render_ssr(component, options)
			: render_dom(component, options);

    // 返回编译后最终内容
	return component.generate(result);
}
```
所以compile分为几个步骤 parse生成AST 创建Component 渲染Component 生成最终的代码
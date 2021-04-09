# svelte-loader 分析
```
// loader外部定义的变量
const virtualModules = new Map();
let index = 0;

// 异步方式解析svelte文件
const options = { ...getOptions(this) };
const callback = this.async();

// 如果在loader配置中有cssPath配置 
// 那么从map中根据路径查找css 并返回
if (options.cssPath) {
    const css = virtualModules.get(options.cssPath);
    virtualModules.delete(options.cssPath);
    callback(null, css);
    return;
}

// 判断是否是服务端渲染 webpack的target选项或者在loader中配置
const isServer = this.target === 'node' || (options.compilerOptions && options.compilerOptions.generate == 'ssr');

// 判断是否发布模式 webpack的minimize选项或者环境配置
const isProduction = this.minimize || process.env.NODE_ENV === 'production';

// 编译配置
const compileOptions = {
    filename: this.resourcePath,
    css: !options.emitCss,
    ...options.compilerOptions,
    format: (options.compilerOptions && options.compilerOptions.format) || 'esm'
};

// 标准化preprocess
options.preprocess = options.preprocess || {};
options.preprocess.filename = compileOptions.filename;

// 调用 svelte/compiler的preprocess方法
preprocess(source, options.preprocess)

// 得到返回值
export interface Processed {
	code: string;
	map?: string | object; // we are opaque with the type here to avoid dependency on the remapping module for our public types.
	dependencies?: string[];
	toString?: () => string;
}

// 处理loader依赖
if (processed.dependencies && this.addDependency) {
	for (let dependency of processed.dependencies) {
		this.addDependency(dependency);
	}
}

// 调用svelte/compiler的compile方法 这里toString()返回的就是source
const compiled = compile(processed.toString(), compileOptions);
// 上面compile方法返回内容为
<!-- return {
	js,
	css,
	ast: this.original_ast,
	warnings: this.warnings,
	vars: this.vars
		.filter(v => !v.global && !v.internal)
		.map(v => ({
			name: v.name,
			export_name: v.export_name || null,
			injected: v.injected || false,
			module: v.module || false,
			mutated: v.mutated || false,
			reassigned: v.reassigned || false,
			referenced: v.referenced || false,
			writable: v.writable || false,
			referenced_from_script: v.referenced_from_script || false
		})),
	stats: this.stats.render()
}; -->
```
# svelte/compiler preprocess方法分析
```
// 接收源码、preprocessor对应从loader传入的对象
export default async function preprocess(
	source: string,
	preprocessor: PreprocessorGroup | PreprocessorGroup[],
	options?: { filename?: string }
): Promise<Processed> {
	// @ts-ignore todo: doublecheck

    // 文件名或者完整路径
	const filename = (options && options.filename) || preprocessor.filename; // legacy

    // 预处理器数组
	const preprocessors = preprocessor ? (Array.isArray(preprocessor) ? preprocessor : [preprocessor]) : [];

	const markup = preprocessors.map(p => p.markup).filter(Boolean);
	const script = preprocessors.map(p => p.script).filter(Boolean);
	const style = preprocessors.map(p => p.style).filter(Boolean);

    // 构造预处理结果
	const result = new PreprocessResult(source, filename);

	// TODO keep track: what preprocessor generated what sourcemap?
	// to make debugging easier = detect low-resolution sourcemaps in fn combine_mappings

	for (const process of markup) {
		result.update_source(await process_markup(filename, process, result));
	}

	for (const process of script) {
		result.update_source(await process_tag('script', process, result));
	}

	for (const preprocess of style) {
		result.update_source(await process_tag('style', preprocess, result));
	}

    // to_processed方法主要创建sourcemap
	return result.to_processed();
}
```


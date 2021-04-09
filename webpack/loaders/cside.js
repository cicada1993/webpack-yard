const cmd = require("node-cmd")
const path = require('path')
const fs = require('fs')
function get_name_from_filepath(filepath) {
    if (!filepath)
        return null;
    const parts = filepath.split(/[/\\]/).map(encodeURI);
    if (parts.length > 1) {
        const index_match = parts[parts.length - 1].match(/^index(\.\w+)/);
        if (index_match) {
            parts.pop();
            parts[parts.length - 1] += index_match[1];
        }
    }
    const base = parts.pop()
        .replace(/%/g, 'u')
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z_$0-9]+/g, '_')
        .replace(/^_/, '')
        .replace(/_$/, '')
        .replace(/^(\d)/, '_$1');
    if (!base) {
        throw new Error(`Could not derive component name from file ${filepath}`);
    }
    return base;
}

// cside文件只是作为c++项目和webpack之间的bridge
// 目前它里面的内容没有实际意义
// 后期可考虑存放c++项目相关配置信息 以供cside-loader扩展能力
module.exports = function (source) {
    const callback = this.async()
    // cside文件所在目录
    const sourceDir = path.resolve(this.resourcePath, "..")
    // 文件名
    const fileName = get_name_from_filepath(this.resourcePath)
    // 执行cmd命令构建c++项目步骤 
    // 进入cmake项目根目录 
    // 执行emsdk临时环境脚本 
    // 创建build目录 
    // 执行emcmake命令生成makefile 
    // 执行cmake构建命令
    const emsdk_env_bat = "D:\\emsdk\\emsdk_env.bat"
    cmd.run(
        `cd ${sourceDir} && ${emsdk_env_bat} && cd build && emcmake cmake .. && cmake --build .`,
        (err, data, stderr) => {
            const fromPath = path.resolve(sourceDir, `./build/${fileName}.wasm`)
            // const outputPath = this._compiler.options.output.path
            // const toPath = path.resolve(outputPath, `${fileName}.wasm`)
            console.log('wasm file', fromPath)
            // emit wasm file to webpack output dir
            fs.readFile(fromPath, (err, data) => {
                this.emitFile(`${fileName}.wasm`, data)
            })
            // replace import module 由原来的.cside模块变成c++编译得到的js模块
            let code = `import * as ${fileName} from './build/${fileName}.js'
             export default ${fileName}
            `
            callback(null, code)
        }
    )
}
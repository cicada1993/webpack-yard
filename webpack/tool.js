const os = require('os')
const fs = require('fs')
const path = require('path')
const { spawn } = require("child_process");
const { _brand, _success, _danger, _warning, _info } = require('./constants')

// 获取本机ip
function getHostIP() {
    const network = os.networkInterfaces()
    const keys = Object.keys(network)
    for (let key of keys) {
        if (key.indexOf('VMware') > -1 || key.indexOf('WSL') > -1) {
            // 跳过虚拟机和子系统
            continue
        }
        const netList = network[key]
        for (let netIndex in netList) {
            const net = netList[netIndex]
            if (net.family === 'IPv4' && net.address !== '127.0.0.1' && !net.internal) {
                return net.address
            }
        }
    }
    return '0.0.0.0'
}

// 递归清空文件夹
function cleanDir(dir, isRoot = true) {
    let files = [];
    if (fs.existsSync(dir)) {
        files = fs.readdirSync(dir);
        files.forEach((name, index) => {
            let filePath = path.join(dir, name)
            if (fs.statSync(filePath).isDirectory()) {
                cleanDir(filePath, false); //递归删除文件夹
            } else {
                fs.unlinkSync(filePath); //删除文件
            }
        });
        if (!isRoot) {
            fs.rmdirSync(dir);
        }
    }
}
// 获取能在cmd命令中运行的路径
function pathForCmd(filePath) {
    const nor_path = path.normalize(filePath)
    const slash_path = nor_path.replace(new RegExp(/\\/g), "\\")
    const slash_cmd = JSON.stringify(slash_path).replace(new RegExp(/\"/g), "")
    return slash_cmd
}

/**
 * node环境 执行shell命令 构建cmake项目 支持emscripten项目
 * @param {*} config 构建配置项 
 *  dir cmake项目根目录 
 *  favor项目输出格式 wasm 表示webassembly项目输出 为空 普通c++项目输出
 *  emsdk emscripten环境配置
 * @param {*} resolve 
 * @returns 
 */
function cmakeBuild({ dir, favor, emsdk = {} } = {}, resolve = () => { }) {
    // 先校验配置参数
    if (!dir) {
        const message = "cmake project root dir cannot be empty!"
        console.log(_danger(message))
        resolve({ success: false, error: Error(message) })
        return
    }
    if (favor == "wasm" && !emsdk[process.platform]) {
        const message = `emsdk for ${process.platform} cannot be empty when favor is wasm!`
        console.log(_danger(message))
        resolve({ success: false, error: Error(message) })
        return
    }
    console.log(_brand('build config'), { dir, favor, emsdk })
    const buildDir = path.resolve(dir, "./build")
    if (fs.existsSync(buildDir)) {
        console.log(_info('build dir exists,clean it!'))
        cleanDir(buildDir)
    } else {
        console.log(_info('build dir not exists,create it!'))
        fs.mkdirSync(buildDir, { recursive: true })
    }
    let emsdk_dir = path.normalize(emsdk[process.platform])
    let emsdk_env
    let env_shell
    if (process.platform == "win32") {
        emsdk_env = path.join(emsdk_dir, "emsdk_env.bat")
        // windows下 需要手动执行脚本获取临时环境
        env_shell = `${pathForCmd(emsdk_env)} &&`
    } else {
        emsdk_env = path.join(emsdk_dir, "emsdk_env.sh")
        // linux下 按emscripten官网 执行emsdk_env.sh即可获得全局环境
        env_shell = ''
    }
    if (favor == 'wasm') {
        buildCommand = `${env_shell} cd build && emcmake cmake .. && cmake --build .`
    } else {
        buildCommand = `cd build && cmake -G "MinGW Makefiles" .. && cmake --build .`
    }
    console.log(_brand('build command'), _info(buildCommand))
    const buildProcess = spawn(buildCommand, { shell: true, cwd: dir });
    buildProcess.stdout.on("data", (data) => {
        console.log(_info(data));
    });
    buildProcess.stderr.on('data', (data) => {
        console.log(_warning(data))
    });
    buildProcess.on("error", (error) => {
        console.log(_danger('build error'), error)
    })
    buildProcess.on('exit', (code) => {
        console.log(_success('build exit'), code)
        resolve()
    })
}
//chcp 65001
module.exports = {
    cmakeBuild,
    getHostIP
}

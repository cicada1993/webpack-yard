const path = require('path')
const fs = require('fs')
console.log('current platform', process.platform)
if (process.platform == "win32") {
    let emsdk_path = "‪D://emsdk"
    const env_path = path.normalize(path.join(emsdk_path, "emsdk_env.bat"))
    const env_path_cmd = env_path.replace(new RegExp(/\\/g), "\\")
    const env_cmd = JSON.stringify(env_path_cmd).replace(new RegExp(/\"/g), "")
    console.log(env_cmd)
} else {
    let emsdk_path = "/home/kotlinrust/Apps/emsdk"
    const env_path = path.normalize(path.join(emsdk_path, "emsdk_env.sh"))
    console.log(fs.existsSync(env_path))
}

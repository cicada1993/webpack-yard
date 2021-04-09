const cmd = require('node-cmd')
cmd.runSync("cd ./wasm && D:\\emsdk\\emsdk_env.bat && cd build && emcmake cmake .. && cmake --build .")
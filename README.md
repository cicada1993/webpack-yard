# webpack整合c++项目
本项目介绍了vscode下如何使用webpack整合cmake和emscripten开发webassembly项目

# 启动项目
- 执行命令`npm install`
- 本地开发 执行命令`npm run dev` 浏览器输入地址查看控制台
- 发布模式 执行命令`npm run build` 和 `npm run koa` 浏览器输入地址查看控制台

# 项目环境（准备工作）
- os windows10
- vscode 1.55.0
- node v12.18.4
- webpack v5.30.0
- emsdk  v2.0.16
- cmake v3.20.0

# 整合思路
- 假设c++项目位于wasm目录下
- 在wasm目录下创建.cside文件 标识一个c++项目
- .cside文件由cside-loader解析
- cside-loader主要功能
    - 进入.cside文件所在目录，执行cmd命令：使用emcmake、cmake命令构建cmake项目，输出.wasm及相应.js模块（es版本，emscripten官网有介绍如何配置）
    - 导出.wasm文件到webpack输出目录（.js模块中使用fetch加载.wasm，即index.html所在目录加载）
    - 生成代码，导出.js模块中的内容
- 业务代码中导入.cside模块，此时相当于导入了.js模块的内容，就可使用c++的功能了

# 具体实现
创建wasm目录用于编写基于CMake的c++项目

## vscode中导入emsdk头文件
打开设置-扩展-c++ 选项 C_Cpp.default.includePath 编辑setting.json 添加"D:\\emsdk\\upstream\\emscripten\\system\\**"，请替换为自己的路径

## 编写c++代码及CMakeLists.txt
详见`wasm/main.cpp`、`wasm/CMakeLists.txt`
- main.cpp 仅简单创建一个c++类输出信息
- CMakeLists.txt set_target_properties中的构建参数可参考emscripten官网

## 编写cside模块
详见`wasm/school.cside`

模块名与CMakeLists.txt中输出的模块名一致，如`school`，文件内容目前可以为空

## 编写cside-loader
用于解析.cside模块，详见`webpack/loaders/cside.js`

## webpack配置cside-loader
详见`webpack/config.js`
```
module: {
    rules: [
        {
            test: /\.cside$/, loader: path.resolve(__dirname, './loaders/cside.js')
        }
    ]
},
```
## 使用cside模块
详见`src/main.js`
```
import _load_school from '../wasm/school.cside'
_load_school().then(
    (_module_school) => {
        console.log(_module_school)
    }
)
```
_module_school就是wasm模块对应的js对象，可调用c++中的方法

# c++单独编译
如果只想编译c++代码，详见`wasm/build.js`

# 后期计划
1、目前cside-loader处理.cside文件时，每次都会重新编译c++代码，后期可做缓存优化

2、支持linux环境下构建



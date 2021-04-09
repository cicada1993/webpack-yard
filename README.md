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
- wasm目录下创建.cside模块 用于标识c++源码目录
- 在业务代码中导入.cside模块
- .cside模块 由cside-loader解析
- cside-loader主要职责
    - 执行emcmake构建输出.wasm及相应.js模块（es版本，emscripten官网有介绍）
    - 导出.wasm到webpack output根目录（因为.js模块中加载.wasm使用的fetch，是从index.html所在目录加载）
    - 返回代码中导出.js模块的内容

# 具体实现
创建wasm目录用于编写c++项目
## emsdk头文件引入
打开vscode设置-扩展-c++ 选项 C_Cpp.default.includePath 编辑setting.json 添加"D:\\emsdk\\upstream\\emscripten\\system\\**"，实际替换为自己的路径
## 编写c++代码及CMakeLists.txt
详见`wasm/main.cpp`、`wasm/CMakeLists.txt`
- main.cpp 只是简单创建一个c++类输出信息
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
_module_school就是wasm模块对应的js模块，便于调用c++中的方法

# c++单独编译
如果只想编译c++代码，详见`wasm/build.js`

# 后期计划
1、目前cside-loader处理.cside文件时，每次都会重新编译c++代码，后期可做缓存优化
2、支持linux环境下构建



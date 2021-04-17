# CMake项目 使用msvc编译
构建工具选择msvc build目录会自动生成基于cmake的vc项目 用msvc打开即可编译
# CMake项目 使用gcc编译
构建工具选择gcc 会自动执行cmake命令后 build目录得到Makefile文件及其他生成文件 再执行cmake --build .编译 
# CMake项目 使用emscripten编译
- 构建工具仍然选择gcc 最好禁用cmake tools插件的configure on open 避免cmake构建文件污染
- 根目录创建build文件夹
- cd build  进入build目录
- emcmake cmake ..  build目录会生成一堆构建文件
- cmake --build .   编译输出目标文件

如果CMakeLists.txt不添加任何emcmake识别的参数 那么 默认构建出胶水代码（支持多种环境）和wasm模块
## emscripten头文件引入
设置-扩展-c++ 选项 C_Cpp.default.includePath 编辑setting.json 添加"D:\\emsdk\\upstream\\emscripten\\system\\**"
# CMake项目指定编译器
windows电脑可能同时安装MSVC、MinGW-GCC编译器，推荐做法如下
- 只安装CMake扩展 不要安装CMake Tools
- 如果使用gcc编译 使用方式为 cmake -G "MinGW Makefiles" .. 然后执行cmake --build .
- 如果使用MSVC编译 cmake ..生成的是msvc项目 并不能直接编译 执行 cmake --build 然并卵

# 提示头文件找不到
CMakeLists.txt配置正确 能够正常编译，这个错误一般是c++插件提示的
安装c++插件，ctr+shift+p 编辑配置，添加如下参数
```
"includePath": [
    "${default}", //这个路径是因为设置了全局头文件
    "${workspaceFolder}/libtest/eigen" // 此路径为当前工程下的某个目录
],
```

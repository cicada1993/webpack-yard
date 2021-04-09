# CMake 学习路线
# CMake构建目标（target）
## executable 可执行文件
使用add_executable(`exe-name` `cpp-file-list`)命令
- exe-name 可执行文件名
- c-file-list c源文件列表
## library 库（静态库、动态库、module库、object库）
使用add_library(`lib-name` `LIB-TYPE` `cpp-file-list`)命令
- lib-name 库名
- LIB-TYPE 库类型 可缺省
- c-file-list c源文件列表
### library type 库文件类型
- 静态库 add_library(`lib-name` STATIC  `cpp-file-list`) STATIC可省略
- 动态库 add_library(`lib-name` SHARED  `cpp-file-list`) 
- module类型 add_library(`lib-name` MODULE  `cpp-file-list`) 
- object类型 add_library(`lib-name` OBJECT  `cpp-file-list`)

module类型库通常不会出现在target_link_libraries()中，它是一种使用运行时技术作为插件加载的类型

object类型库定义了编译给定源文件后产生的目标文件的非档案集合，可以使用 $< target _ objects: `lib-name` > 语法作为其他目标的源输入

打开开关BUILD_SHARED_LIBS 会默认构建动态库而·是静态库
## custom 自定义构建命令
使用add_custom_command()命令

# CMake构建规范和使用要求
这些命令需要放在add_executable或add_library之后
## target_include_directories 对应c++编译选项-I
使用target_include_directories(`target-name` `SCOPE-TYPE` `paths`)配置构建目标的头文件
- target-name 目标名称
- SCOPE-TYPE 作用范围 可选值INTERFACE|PUBLIC|PRIVATE
- paths 路径列表 支持相对路径和绝对路径 可以使用BUILD_INTERFACE 或 INSTALL_INTERFACE生成器表达式
## target_compile_definition 对应c++编译选项-D
使用target_compile_definition(`target-name` `SCOPE-TYPE` `assign-exp`)为构建目标添加宏定义
- target-name 目标名称
- SCOPE-TYPE 作用范围 可选值INTERFACE|PUBLIC|PRIVATE
- assign-exp 宏定义赋值表达式
## target_compile_options
使用target_compile_options(`target-name` `SCOPE-TYPE` `assign-exp`)为构建目标添加编译选项
- target-name 目标名称
- SCOPE-TYPE 作用范围 可选值INTERFACE|PUBLIC|PRIVATE
- assign-exp 编译选项赋值表达式
# CMake处理依赖
使用target_link_libraries(`target-name` `lib-name`)
- target-name 目标名称
- lib-name 依赖库名
# CMake 全局参数
## 开关类型参数
使用option(`flag-name` `help-tip` `value`)
- flag-name 开关变量
- help-tip 描述信息
- value 变量值 可选值ON|OFF 默认OFF

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
## emscripten头文件引入
设置-扩展-c++ 选项 C_Cpp.default.includePath 编辑setting.json 添加"D:\\emsdk\\upstream\\emscripten\\system\\**"
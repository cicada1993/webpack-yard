cmake_minimum_required(VERSION 3.8)

project(school VERSION 1.0)
message(STATUS "operation system is ${CMAKE_SYSTEM}")
# 设置变量root_dir 值为CMakeLists.txt文件所在目录路径
set(root_dir ${CMAKE_CURRENT_SOURCE_DIR})
if(WIN32)
    set(eigen_path "D:\\eigen-3.3.9")
else()
    set(eigen_path "/home/kotlinrust/Apps/eigen-3.3.9")
endif()

aux_source_directory("${root_dir}/libtest/emsdk" test_emsdk_cfile)
aux_source_directory("${root_dir}/libtest/eigen" test_eigen_cfile)
include_directories(
    ${root_dir} ${root_dir}/libtest/emsdk 
    ${root_dir}/libtest/eigen
    ${eigen_path}
)

message(STATUS "root_dir：${root_dir}")
message(STATUS "test_emsdk_cfile：${test_emsdk_cfile}")
message(STATUS "test_eigen_cfile：${test_eigen_cfile}")
add_executable(school main.cpp Guard.cpp ${test_eigen_cfile})
set_target_properties(school PROPERTIES LINK_FLAGS "-s WASM=1 -s ENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_NAME=School")
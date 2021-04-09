cmake_minimum_required(VERSION 3.8)

project(school VERSION 1.0)

add_executable(school main.cpp Guard.cpp)

target_include_directories(school PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
set_target_properties(school PROPERTIES LINK_FLAGS "-s WASM=1 -s ENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_NAME=School")
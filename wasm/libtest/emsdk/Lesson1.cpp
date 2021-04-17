#include "Lesson1.h"
#include <iostream>
#include <emscripten.h>
using namespace std;
Lesson1::Lesson1(/* args */)
{
}

Lesson1::~Lesson1()
{
}
//使用EM_JS宏 在c++中定义js方法 并在c++中调用
EM_JS(void, _alert_test, (), {
    alert("_em_js_test!");
});
// 带参方法 参数支持int32和double类型
EM_JS(void, _console_test, (int x, float y), {
    console.log('_em_js_param_number', {x, y});
});
// 带参方法 参数为c类型字符串 在js内部需要转换
EM_JS(void, _print_sentence, (const char *sentence), {
    console.log('_em_js_param_str', UTF8ToString(sentence));
});
// 带参方法 参数为指针类型
EM_JS(void, _receive_ptr, (int *arr), {
    // webassembly中寻址方式为HEAP8
    console.log('_em_js_param_ptr', HEAP8[arr], HEAP8[arr + 4]);
});
// 返回整型
EM_JS(int, _js_ret_c_int, (int x), {
    return x + 10;
});
// 返回字符串
EM_JS(char *, _js_ret_c_string, (), {
    let jstring = "this is from js...";
});
void Lesson1::test()
{
    cout << "this is in class Lesson1" << endl;
    _alert_test();
    //mark!!! 实际显示 _console_test {x: 100, y: 31.100000381469727}
    _console_test(100, 31.1);
    _print_sentence("i want to say...");
    int arr[] = {10, 20};
    _receive_ptr(arr);
    cout << "_em_js_ret_int" << _js_ret_c_int(20) << endl;
    //使用EM_ASM宏 在c++中定义内联js代码块
    // mark!!! 这里执行js代码 第二个浮点数 显示正常
    EM_ASM({console.log('_em_asm_number', $0, $1)}, 100, 31.1);
    // EM_ASM接收字符串参数
    EM_ASM({console.log('_em_asm_str', UTF8ToString($0))}, "this is from c++...");
    // EM_ASM接收指针类型参数
    EM_ASM({console.log('_em_asm_ptr', HEAP8[$0], HEAP8[$0 + 4])}, arr);
    // EM_ASM返回int类型值
    cout << "_em_asm_ret_int" << EM_ASM_INT({return $0 + 20}, 80) << endl;
    // // 定义了几种回调的函数指针类型 typedef  返回类型(*新类型)(参数表)
    // // typedef void (*em_callback_func)(void);
    // // typedef void (*em_arg_callback_func)(void *);
    // // typedef void (*em_str_callback_func)(const char *);
}
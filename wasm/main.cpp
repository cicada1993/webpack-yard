#include <iostream>
#include "Guard.h"
#include "Course1.h"
using namespace std;
// mark!!! js端实际输出的方法名__Z10guard_testv: ƒ ()
int main(int arg, char *argv[])
{
    cout << "hello,webassembly!" << endl;
    Guard g;
    g.setWords("good good study,day day up!");
    cout << g.getWords() << endl;
    g.test();
    Course1 c1;
    c1.test();
    return 0;
}
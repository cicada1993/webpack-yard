#include <iostream>
#include "Guard.h"
#include "emscripten.h"
using namespace std;
int main(int arg, char *argv[])
{
    cout << "hello,webassembly!" << endl;
    Guard g;
    g.setWords("good good study,day day up!");
    cout << g.getWords() << endl;
    return 0;
}
#include "Guard.h"
#include <iostream>
using namespace std;
Guard::Guard() {
}

Guard::~Guard() {

}

void Guard::setWords(string sentence) {
    words = sentence;
}

string Guard::getWords() {
    return words;
}
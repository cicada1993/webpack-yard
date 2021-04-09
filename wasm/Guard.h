#ifndef _Guard_H_
#define _Guard_H_
#include <iostream>
using namespace std;
class Guard
{
private:
    /* data */
    string words;
public:
    Guard(/* args */);
    ~Guard();
    void setWords(string sentence);
    string getWords();
};

#endif
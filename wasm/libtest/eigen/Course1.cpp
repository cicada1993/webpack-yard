#include "Course1.h"
#include <iostream>
#include <Eigen/Dense>
using namespace std;

Course1::Course1(/* args */)
{
}

Course1::~Course1()
{
}
void Course1::test()
{
    cout << "this is eigen Course1!" << endl;
    Eigen::Vector3d a(1.0, 2.0, 3.0); // 默认为列向量  或者a(0) = 1; a(1) = 2; a(2)= 3;
    cout << "a = \n"
              << a << endl;
}
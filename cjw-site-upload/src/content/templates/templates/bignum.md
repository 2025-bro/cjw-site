---
title: 高精度加减乘（vector 版）
description: 用 vector<int> 实现高精度加、减、乘，单次运算复杂度 O(n) 或 O(n^2)
category: 高精度
tags: [高精度, 大整数, vector, 模拟]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef vector<int> Big;          // 低位在前的十进制大整数

void trim(Big &a) { while (a.size() > 1 && a.back() == 0) a.pop_back(); }  // 去前导零
Big toBig(const string &s) { Big a; for (int i = s.size() - 1; i >= 0; i--) a.push_back(s[i] - '0'); return a; }
string str(const Big &a) { string s; for (int i = a.size() - 1; i >= 0; i--) s += char('0' + a[i]); return s; }

bool operator<(const Big &a, const Big &b) {   // 先补零再按字典序比较
    if (a.size() != b.size()) return a.size() < b.size();
    for (int i = a.size() - 1; i >= 0; i--) if (a[i] != b[i]) return a[i] < b[i];
    return false;
}

Big operator+(const Big &a, const Big &b) {
    Big c; int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int s = carry;
        if (i < a.size()) s += a[i];
        if (i < b.size()) s += b[i];
        c.push_back(s % 10); carry = s / 10;
    }
    return c;
}

Big operator-(const Big &a, const Big &b) {     // 保证 a >= b
    Big c; int borrow = 0;
    for (size_t i = 0; i < a.size(); i++) {
        int s = a[i] - borrow - (i < b.size() ? b[i] : 0);
        if (s < 0) s += 10, borrow = 1; else borrow = 0;
        c.push_back(s);
    }
    trim(c);
    return c;
}

Big mul(const Big &a, int k) {                  // 乘低精度
    Big c; long long carry = 0;
    for (size_t i = 0; i < a.size() || carry; i++) {
        long long s = carry;
        if (i < a.size()) s += (long long)a[i] * k;
        c.push_back(s % 10); carry = s / 10;
    }
    trim(c);
    return c;
}

Big mul(const Big &a, const Big &b) {           // 高精度乘高精度
    Big c(a.size() + b.size(), 0);
    for (size_t i = 0; i < a.size(); i++)
        for (size_t j = 0; j < b.size(); j++) c[i + j] += a[i] * b[j];
    for (size_t i = 0; i + 1 < c.size(); i++) { c[i + 1] += c[i] / 10; c[i] %= 10; }
    trim(c);
    return c;
}

int main() {
    Big a = toBig("999999999999999999"), b = toBig("123456789");
    cout << str(a + b) << "\n";
    cout << str(a - b) << "\n";
    cout << str(mul(a, 12)) << "\n";
    cout << str(mul(a, b)) << "\n";
    return 0;
}
```

## 说明

- 复杂度：加、减、乘低精度都是 O(n)；高精度乘高精度是 O(nm)，朴素写法 n 到 1e4 就会超时，此时需要 FFT/NTT。
- 存储约定：`vector<int>` **低位在下标 0**，这样进位方向与遍历方向一致，`c.push_back` 直接追加。输出时倒序。
- 减法必须保证 `a >= b`。模板给了 `<` 重载，主函数里先比较再决定是否输出负号；减法结束后一定要 `trim`，否则 `100000 - 99999` 会得到 `000001`。
- `operator<` 用了「位数不同先比位数、位数相同从高位比」的写法，注意不能只比 size 后就返回，也不能用 vector 的默认字典序比较（低位在前的字典序是错的）。
- 乘法的进位可以延后到双重循环结束再统一处理，省去循环内的取模，但中间值的上界是 `9*9*n`，n 较大时要开 long long。
- 易错点：`trim` 至少保留一位，否则 `0` 会变成空 vector；除法与取模模板里没给，需要用二分试商实现 O(n^2) 高精除。

## 典型应用

- 洛谷 P1601 A+B Problem（高精）（高精度加法）
- 洛谷 P2142 高精度减法（含负数判定与前导零处理）
- 洛谷 P1303 A*B Problem（高精度乘法）

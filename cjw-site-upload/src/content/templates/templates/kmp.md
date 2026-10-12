---
title: KMP 字符串匹配
description: 前缀函数（next 数组）与 O(n + m) 单模式串匹配
category: KMP
tags: [字符串匹配, 前缀函数, next 数组]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1e6 + 5;
char s[N], p[N];
int pi[N];

void kmp(char *s, int n) {                  // pi[i] = s[0..i] 的最长相等真前后缀
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
}

vector<int> find(char *t, int n, char *p, int m) {   // 所有匹配起点，可重叠
    vector<int> res;
    kmp(p, m);
    for (int i = 0, j = 0; i < n; i++) {
        while (j && t[i] != p[j]) j = pi[j - 1];
        if (t[i] == p[j]) j++;
        if (j == m) { res.push_back(i - m + 1); j = pi[j - 1]; }
    }
    return res;
}

int main() {
    strcpy(s, "abababc"), strcpy(p, "abab");
    kmp(s, 7);
    for (int i = 0; i < 7; i++) cout << pi[i] << " \n"[i == 6];
    vector<int> v = find(s, 7, p, 4);
    for (int i = 0; i < (int)v.size(); i++) cout << v[i] << " \n"[i + 1 == (int)v.size()];
    return 0;
}
```

## 说明

- 前缀函数 `pi[i]` 的直觉：失配时不要回到开头重来，而是利用「已经匹配的部分本身有相同前缀」这一信息跳回去。
- 匹配过程与求 `pi` 的写法几乎一样，可以看成「拿模式串去求文本串的前缀函数」。
- 复杂度是均摊 `O(n + m)`，`while` 循环总次数不超过 `n`。
- 求最小循环节：若 `n % (n - pi[n-1]) == 0`，最小循环节长度为 `n - pi[n-1]`。

## 典型应用

- 洛谷 P3375【模板】KMP（输出 `pi` 与匹配位置）；
- 洛谷 P4391 无限传输 / 循环节问题；
- 字符串周期、border 相关结论（如「字符串由某前缀重复构成」）。

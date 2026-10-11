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
// 前缀函数：pi[i] 表示 s[0..i] 的最长「相等真前后缀」长度
vector<int> prefixFunction(const string& s) {
    int n = (int)s.size();
    vector<int> pi(n, 0);
    for (int i = 1; i < n; ++i) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) ++j;
        pi[i] = j;
    }
    return pi;
}

// 在文本 t 中查找模式串 p 的所有出现位置（返回起始下标，0 起）
vector<int> kmpSearch(const string& t, const string& p) {
    vector<int> res;
    if (p.empty()) return res;
    vector<int> pi = prefixFunction(p);
    int j = 0;
    for (int i = 0; i < (int)t.size(); ++i) {
        while (j > 0 && t[i] != p[j]) j = pi[j - 1];
        if (t[i] == p[j]) ++j;
        if (j == (int)p.size()) {
            res.push_back(i - j + 1);
            j = pi[j - 1];          // 允许重叠匹配
        }
    }
    return res;
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

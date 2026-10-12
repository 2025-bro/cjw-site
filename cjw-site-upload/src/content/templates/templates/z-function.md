---
title: Z 函数（扩展 KMP）
description: 线性求 Z 数组，O(n + m) 完成单模式串的字符串匹配
category: Z 函数
tags: [字符串匹配, 扩展KMP, Z数组]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e6 + 5;
int z[N];

// z[i] = s 与 s[i..] 的最长公共前缀长度，规定 z[0] = n
void zfunc(const string& s) {
    int n = (int)s.size();
    z[0] = n;
    for (int i = 1, l = 0, r = 0; i < n; ++i) {
        z[i] = (i <= r) ? min(r - i + 1, z[i - l]) : 0;
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];
        if (i + z[i] - 1 > r) l = i, r = i + z[i] - 1;   // 右端点变大才更新盒子
    }
}

// src 中 tgt 的所有出现位置（拼接后一次求 Z）
vector<int> match(const string& src, const string& tgt) {
    vector<int> res;
    if (tgt.empty() || tgt.size() > src.size()) return res;
    string s = tgt + "#" + src;                          // '#' 不能出现在串中
    zfunc(s);
    int m = (int)tgt.size();
    for (int i = m + 1; i < (int)s.size(); ++i)
        if (z[i] >= m) res.push_back(i - m - 1);
    return res;
}

int main() {
    for (int x : match("abababa", "aba")) cout << x << ' ';
    cout << '\n';
    zfunc(string("aabxaab"));
    cout << z[3] << ' ' << z[4] << '\n';
    return 0;
}
```

## 说明

- `z[i]` 表示「`s` 与 `s[i..]` 的最长公共前缀」，规定 `z[0] = n`；维护最右匹配盒子 `[l, r]` 后每个位置均摊 `O(1)`，总复杂度 `O(n)`。
- 盒子内先取 `min(r - i + 1, z[i - l])` 作下界再暴力扩展；只有 `i + z[i] - 1 > r` 才更新盒子，写成 `>=` 会退化。
- 匹配时拼接 `tgt + "#" + src`（`'#'` 必须不在字符集中），`z[i] >= m` 即为一次出现，天然支持重叠匹配。
- 与 KMP 的取舍：单模式串匹配两者同阶，但 Z 函数直接给出「每个后缀与模式串的 LCP」，处理「每个位置向后能匹配多长」更顺手；多模式串应改用 AC 自动机。
- 字符集很大时把 `'#'` 换成 `'\0'` 或另开哨兵下标，避免与正文冲突。

## 典型应用

- 洛谷 P5410【模板】扩展 KMP（Z 函数）；
- 洛谷 P2375 [NOI2014] 动物园（Z 函数 / KMP 变形）；
- 求所有后缀与模式串的 LCP、字符串周期与 border 计数类问题。

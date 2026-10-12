---
title: 字符串哈希
description: O(1) 判断子串是否相等，支持多次区间查询
category: 字符串哈希
tags: [哈希, 子串比较, 自然溢出]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

const ull B = 131;                  // 底数取质数

struct Hash {                       // ull 自然溢出，等价于对 2^64 取模
    int n;
    vector<ull> h, pw;
    Hash(const string &s) : n(s.size()), h(n + 1), pw(n + 1, 1) {
        for (int i = 0; i < n; i++) {
            h[i + 1] = h[i] * B + (unsigned char)s[i];
            pw[i + 1] = pw[i] * B;
        }
    }
    ull get(int l, int r) { return h[r + 1] - h[l] * pw[r - l + 1]; }   // 子串 s[l..r]
};

int main() {
    string a = "abcabc", b = "abcabd";
    Hash ha(a), hb(b);
    cout << (ha.get(0, 2) == ha.get(3, 5)) << " ";    // 1：两段都是 abc
    cout << (ha.get(0, 2) == hb.get(3, 5)) << "\n";   // 0：abc vs abd
    return 0;
}
```

## 说明

- 预处理 `O(n)`，之后任意子串哈希都是 `O(1)`，常用于「大量子串比较」「最长公共前缀二分」「回文判断」。
- **碰撞风险**：单模数（尤其自然溢出）可能被刻意构造的数据卡掉。正式比赛建议用**双模数**（如 `10^9+7` 与 `10^9+9`）或随机底数。
- 二分 + 哈希可以求两个后缀的最长公共前缀（LCP）。
- 需要区分大小写、包含任意字符时，直接用字符的 ASCII 值即可（注意负数转 `unsigned char`）。

## 典型应用

- 洛谷 P3370【模板】字符串哈希；
- 判断字符串是否由重复子串构成、找最长重复子串；
- 与二分结合求最长公共前缀 / 最长回文。

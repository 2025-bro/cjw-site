---
title: 最小表示法
description: 双指针 O(n) 求循环同构串中字典序最小的那个表示
category: 最小表示法
tags: [字符串, 循环同构, 双指针]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
// 返回最小表示在 s 中的起始下标，s 的下标 0 起，长度 n
// 若忽略大小写或自定义序，只需替换两处比较
int minimalRotation(const string& s) {
    int n = (int)s.size();
    if (n <= 1) return 0;
    int i = 0, j = 1, k = 0;
    while (i < n && j < n && k < n) {
        char a = s[(i + k) % n], b = s[(j + k) % n];
        if (a == b) { ++k; continue; }
        if (a > b) i = i + k + 1;      // i 起始的串不可能是最小
        else       j = j + k + 1;
        if (i == j) ++j;               // 两个指针撞到一起要错开
        k = 0;
    }
    return min(i, j);
}

int main() {
    string s = "bca";
    int p = minimalRotation(s);
    cout << s.substr(p, s.size() - p) << s.substr(0, p) << '\n';
    s = "cba";
    p = minimalRotation(s);
    cout << s.substr(p, s.size() - p) << s.substr(0, p) << '\n';
    return 0;
}
```

## 说明

- 双指针：`i`、`j` 是两个候选起点，`k` 是已确认相等的长度；失配时直接把「较大的起点」跳过 `k + 1` 位——因为从它后面 `k` 个位置起头的串都不如另一个指针。
- 严格 `O(n)`：`i + j` 单调增加，`k` 的推进被消耗掉，总比较次数不超过 `2n`；暴力枚举 + 比较是 `O(n^2)`。
- 每次失配后 `k` 必须清零，且要处理 `i == j`（置 `j++`）避免死循环；这是最容易写错的两处。
- 求最大表示只需把 `if (a > b)` 与 `else` 两个分支互换。
- 与后缀数组 / 最小表示哈希比较：本题只求最小表示，双指针常数最小；若还要按字典序问所有循环串，用「原串拼一遍再建 SA」。
- 全同字符串（如 `"aaaa"`）会一路 `++k`，最后 `k == n` 退出，返回 `min(i, j) = 0`，结果正确。

## 典型应用

- 洛谷 P1368 最小表示法 /【模板】最小表示法；
- 洛谷 P1709 [USACO5.5] 隐藏口令 Hidden Password；
- 循环同构串判等、项链/环上字典序最小方案（如破环成链的贪心）。

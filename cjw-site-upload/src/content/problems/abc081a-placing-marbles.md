---
title: Placing Marbles
platform: AtCoder
problemId: ABC081A
problemUrl: https://atcoder.jp/contests/abc081/tasks/abc081_a
difficulty: 入门
tags: [字符串, 入门]
author: WJC
date: 2026-10-02
---

## 题意简述

输入一个长度为 3 的字符串，只由 `0` 和 `1` 组成。输出其中 `1` 的个数。

## 思路

遍历字符串统计 `1` 即可。AtCoder 的 ABC A 题通常就是考一个简单操作。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    string s;
    cin >> s;
    int ans = 0;
    for (char c : s) {
        if (c == '1') ans++;
    }
    cout << ans << endl;
    return 0;
}
```

## 小结

AtCoder 每周 ABC 比赛的 A 题是练手速和熟悉英文题面的好材料，适合三人组队互相督促打。

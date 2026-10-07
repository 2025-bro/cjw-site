---
title: Watermelon
platform: Codeforces
problemId: 4A
problemUrl: https://codeforces.com/problemset/problem/4/A
difficulty: 入门
tags: [数学, 思维]
author: QWQ
date: 2026-10-01
---

## 题意简述

一个西瓜重 `w`（1 ≤ w ≤ 100），问能否把它分成**两份重量都是偶数**的部分。

## 思路

- 总重量 `w` 必须大于 2：`w = 2` 只能分成 1 + 1，都是奇数。
- `w` 必须是偶数：两个偶数相加一定是偶数。
- 结论：`w > 2` 且 `w % 2 == 0` 时输出 YES，否则 NO。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int w;
    cin >> w;
    cout << (w > 2 && w % 2 == 0 ? "YES" : "NO") << endl;
    return 0;
}
```

## 小结

经典 CF 签到题。坑点在 `w = 2`：容易被「偶数就行」的思路带偏。做思维题先手玩几个小样例。

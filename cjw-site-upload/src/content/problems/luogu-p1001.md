---
title: A+B Problem
platform: 洛谷
problemId: P1001
problemUrl: https://www.luogu.com.cn/problem/P1001
difficulty: 入门
tags: [模拟, 入门]
author: CJW
date: 2026-10-01
---

## 题意简述

输入两个整数 `a` 和 `b`，输出它们的和。`|a|, |b| <= 10^9`。

## 思路

最基础的输入输出题，唯一要注意的是 `a + b` 可能超过 `int` 范围（`10^9 + 10^9 = 2×10^9`），用 `long long` 更稳妥。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
```

## 小结

- 洛谷入门第一题，考察基本语法。
- 数据范围大的题，读题时先估算结果上限再选类型。

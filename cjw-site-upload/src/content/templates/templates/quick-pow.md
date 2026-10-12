---
title: 快速幂与乘法逆元
description: 计算 a^b mod p（O(log b)），以及费马小定理求乘法逆元
category: 数论
tags: [数论, 快速幂, 逆元]
author: CJW
date: 2026-09-20
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int MOD = 1e9 + 7;

int qpow(int a, int b) {
    int r = 1; a %= MOD;
    for (; b; b >>= 1, a = a * a % MOD)
        if (b & 1) r = r * a % MOD;
    return r;
}
int inv(int a) { return qpow(a, MOD - 2); }   // MOD 为质数时

signed main() {
    cout << qpow(2, 10) << ' ' << inv(2) << '\n';   // 1024 500000004
    return 0;
}
```

## 说明

- 把指数拆成二进制：`a^13 = a^8 · a^4 · a^1`，只需 O(log b) 次乘法。
- 先 `a %= MOD` 再平方，`MOD < 2^31` 时用 `long long` 不会溢出。
- MOD 不是质数时逆元改用 exgcd。

## 典型应用

- 组合数取模、矩阵快速幂的乘法核心；
- 洛谷 P1226【模板】快速幂；
- 模意义下除法（乘逆元）替代，如概率期望题。

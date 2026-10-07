---
title: 快速幂与乘法逆元
description: 计算 a^b mod p（O(log b)），以及费马小定理求乘法逆元
category: 数学
tags: [数论, 快速幂, 逆元]
author: CJW
date: 2026-09-20
---

## 代码

```cpp
// 需要 <cstdint>，using ll = long long;
const ll MOD = 1e9 + 7;

// 快速幂：计算 a^b mod MOD，时间复杂度 O(log b)
ll qpow(ll a, ll b) {
    ll res = 1;
    a %= MOD;
    while (b > 0) {
        if (b & 1) res = res * a % MOD;   // b 的当前二进制位是 1
        a = a * a % MOD;                   // a -> a^2 -> a^4 -> ...
        b >>= 1;
    }
    return res;
}

// 乘法逆元：MOD 为质数时，a 的逆元 = a^(MOD-2)（费马小定理）
ll inv(ll a) {
    return qpow(a, MOD - 2);
}
```

## 说明

- 核心思想：把指数 `b` 拆成二进制，例如 `b = 13 = 1101₂`，则 `a^13 = a^8 · a^4 · a^1`，只需要 `O(log b)` 次乘法。
- 注意先 `a %= MOD` 防止 `a * a` 溢出（`ll` 乘 `ll` 在 `MOD < 2^31` 时安全）。
- 若 MOD 不是质数，逆元请改用扩展欧几里得（exgcd）。

## 使用示例

```cpp
ll ans = qpow(2, 10);      // 1024
ll half = inv(2);          // 500000004，即 1/2 mod 1e9+7
// 组合数取模等场景经常配合使用
```

---
title: 组合数、Lucas 定理与卡特兰数
description: 阶乘逆元预处理 O(1) 求 C(n,m)，Lucas 定理处理小模数大组合数，卡特兰数，预处理 O(n)
category: 组合数学
tags: [组合数学, 组合数, Lucas定理, 卡特兰数]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int mod = 1e9 + 7;
const int MAXN = 1000005;
int fac[MAXN], ifac[MAXN];

int qpow(int a, int b, int p = mod) {
    int r = 1 % p; a %= p;
    for (; b; b >>= 1, a = a * a % p) if (b & 1) r = r * a % p;
    return r;
}

void init(int n) {                  // O(n)：阶乘与阶乘逆元
    fac[0] = 1;
    for (int i = 1; i <= n; i++) fac[i] = fac[i - 1] * i % mod;
    ifac[n] = qpow(fac[n], mod - 2);              // mod 必须是质数
    for (int i = n; i >= 1; i--) ifac[i - 1] = ifac[i] * i % mod;
}

int C(int n, int m) {               // 需先 init(n)，n < mod
    if (m < 0 || m > n) return 0;
    return fac[n] * ifac[m] % mod * ifac[n - m] % mod;
}

// Lucas 定理：p 为质数，O(p log_p n)，用于 n,m 巨大而 p 较小
int lucas(int n, int m, int p) {
    if (m == 0) return 1 % p;
    int a = n % p, b = m % p, r = 1;
    if (b > a) return 0;
    for (int i = 1; i <= b; i++) r = r * (a - b + i) % p * qpow(i, p - 2, p) % p;
    return r * lucas(n / p, m / p, p) % p;
}

// 卡特兰数 Cat(n) = C(2n,n)/(n+1)，mod 为质数
int catalan(int n) { return C(2 * n, n) * qpow(n + 1, mod - 2) % mod; }

signed main() {
    init(20);
    cout << C(5, 2) << ' ' << C(10, 5) << ' ' << C(3, 5) << '\n';   // 10 252 0
    cout << catalan(5) << ' ' << catalan(10) << '\n';               // 42 16796
    cout << lucas(5, 2, 3) << ' ' << lucas(6, 2, 5) << '\n';        // 1 0
}
```

## 说明

- 复杂度：`init` 为 `O(n)`，之后单次 `C(n,m)` 为 `O(1)`；`lucas` 为 `O(p log_p n)`；`catalan` 为 `O(1)`。
- 前提：模数 `mod` 必须是质数且 `n < mod`，否则阶乘逆元不成立（改用 Lucas 或任意模数方法）。
- `C` 里 `m<0 || m>n` 直接返回 `0` 是防越界的关键，很多题目的 `m` 会等于 `n` 或比 `n` 大。
- `lucas` 内部按位拆成 `C(n%p, m%p) * lucas(n/p, m/p)`；`m%p > n%p` 时该位为 `0`，整个组合数为 `0`。
- 卡特兰数的常见形式：`Cat(n) = C(2n,n) - C(2n,n+1) = C(2n,n)/(n+1)`，用第二种写法除 `n+1` 时要保证 `n+1 < mod`。
- 若只需少量、`n` 很小的组合数，直接递推杨辉三角 `O(n^2)` 更省事；`n` 很大但模数非质数时要上 exLucas。

## 典型应用

- 洛谷 P3807【模板】卢卡斯定理/Lucas 定理
- 洛谷 P1044 栈（卡特兰数经典模型）
- 洛谷 P2822 [NOIP2016 提高组] 组合数问题

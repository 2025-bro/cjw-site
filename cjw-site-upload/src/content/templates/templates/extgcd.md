---
title: 扩展欧几里得与线性同余方程
description: 扩展欧几里得求 ax+by=gcd(a,b)，解同余方程 ax≡b (mod m) 与乘法逆元，O(log n)
category: 数论
tags: [数论, 扩展欧几里得, 同余方程, 逆元]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long

// 扩展欧几里得：求 ax+by=gcd(a,b) 的一组解，返回 gcd(a,b)
int exgcd(int a, int b, int &x, int &y) {
    if (!b) { x = 1, y = 0; return a; }
    int d = exgcd(b, a % b, y, x);
    y -= a / b * x;                 // 回溯时把系数换回来
    return d;
}

// 线性同余方程 ax ≡ b (mod m)，返回最小非负解；无解返回 -1
int modeq(int a, int b, int m) {
    int x, y, d = exgcd(a, m, x, y);
    if (b % d) return -1;           // d ∤ b 则无解
    int t = m / d;
    x = (x % t + t) % t;            // 先归约到 [0,t)，再乘 b/d 防溢出
    return x * ((b / d) % t) % t;
}

// 乘法逆元：gcd(a,m)=1 时返回 a^{-1} mod m
int inv(int a, int m) {
    int x, y; exgcd(a, m, x, y);
    return (x % m + m) % m;
}

signed main() {
    int x, y;
    cout << exgcd(12, 8, x, y) << ' ' << x << ' ' << y << '\n';   // 4 -1 2
    cout << modeq(3, 2, 5) << ' ' << modeq(2, 3, 4) << '\n';      // 4 -1
    cout << inv(3, 11) << ' ' << inv(2, 1000000007) << '\n';      // 4 500000004
}
```

## 说明

- 复杂度：`O(log min(a,b))`，只做辗转相除，`long long` 范围内不会溢出（`a/b*x` 前请确认 `|x|` 不大，否则用 `__int128`）。
- `exgcd` 求出的是 `ax+my=d` 的一组特解，通解为 `x + k*(m/d)`，所以最终解要对 `m/d` 取模而不是对 `m` 取模——这是最常见的错误。
- 无解的判定是 `b % d != 0`（`d = gcd(a,m)`），不是 `b % m != 0`。
- 模数 `m` 为质数时用费马小定理 `qpow(a, m-2)` 更快；`m` 非质数（或只需解一个方程）时只能用 exgcd。
- 注意 `exgcd` 传入负数、`a=0` 等情况：`a=0` 时方程退化为 `b*y=gcd`，代码仍成立但要保证 `m>0`。

## 典型应用

- 洛谷 P1082 同余方程（exgcd 求最小正整数解）
- 洛谷 P1516 青蛙的约会（列同余方程后 exgcd 求解）
- 洛谷 P3811【模板】乘法逆元（单个数用 exgcd，批量用线性递推）

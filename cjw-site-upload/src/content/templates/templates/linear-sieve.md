---
title: 线性筛与质因数分解
description: O(n) 筛出所有素数，附带质因数分解与 gcd/lcm
category: 数论
tags: [素数筛, 线性筛, 质因数分解, gcd]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 10000005;
vector<int> primes;
bool composite[MAXN];

// 线性筛：O(n)，每个合数只被它的最小质因子筛一次
void linearSieve(int n) {
    primes.clear();
    composite[0] = composite[1] = true;
    for (int i = 2; i <= n; ++i) {
        if (!composite[i]) primes.push_back(i);
        for (int p : primes) {
            if ((long long)i * p > n) break;
            composite[i * p] = true;
            if (i % p == 0) break;      // 关键：保证不重复筛
        }
    }
}

// 质因数分解：返回 {质因子, 指数}
vector<pair<int, int>> factorize(int x) {
    vector<pair<int, int>> res;
    for (int p : primes) {
        if ((long long)p * p > x) break;
        if (x % p) continue;
        int c = 0;
        while (x % p == 0) {
            x /= p;
            ++c;
        }
        res.push_back({p, c});
    }
    if (x > 1) res.push_back({x, 1});
    return res;
}

// 最大公约数 / 最小公倍数
long long gcd(long long a, long long b) { return b ? gcd(b, a % b) : a; }
long long lcm(long long a, long long b) { return a / gcd(a, b) * b; }   // 先除后乘防溢出

signed main() {
    linearSieve(30);
    cout << "30 以内的素数个数 = " << primes.size() << '\n';       // 10
    cout << "360 =";
    for (auto [p, c] : factorize(360)) cout << ' ' << p << '^' << c;
    cout << '\n';                                                  // 2^3 3^2 5^1
    cout << "gcd(12,18) = " << gcd(12, 18) << ", lcm = " << lcm(12, 18) << '\n';
    return 0;
}
```

## 说明

- 欧拉筛（线性筛）的核心是 `if (i % p == 0) break;`：保证每个合数只被最小质因子标记一次，所以是 `O(n)`。
- 顺便还能得到最小质因子数组（把 `composite` 换成 `minp`），质因数分解就能做到 `O(log x)`。
- 判断素数时注意 `1` 不是素数、`0` 也不是。
- `lcm` 一定要先除后乘，否则容易溢出。

## 典型应用

- 洛谷 P3383【模板】线性筛素数；
- 洛谷 P1075 质因数分解；
- 数论题里预处理素数表（如筛法求约数个数、欧拉函数）。

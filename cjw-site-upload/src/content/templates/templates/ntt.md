---
title: NTT 快速数论变换
description: 模 998244353 下的 NTT 多项式乘法，O(n log n)
category: 多项式
tags: [多项式, NTT, 卷积, 数论变换]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int mod = 998244353, G = 3;

int qpow(int a, int b) {
    int r = 1;
    for (; b; b >>= 1, a = (ll)a * a % mod) if (b & 1) r = (ll)r * a % mod;
    return r;
}

// inv=0 正变换，inv=1 逆变换；n 必须是 2 的幂
void ntt(vector<int> &a, int inv) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {          // 蝴蝶置换（位逆序）
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        int w = qpow(G, (mod - 1) / len);
        if (inv) w = qpow(w, mod - 2);            // 逆变换用 w^{-1}
        for (int i = 0; i < n; i += len) {
            int cur = 1;
            for (int k = 0; k < len / 2; k++) {
                int u = a[i + k], v = (ll)a[i + k + len / 2] * cur % mod;
                a[i + k] = u + v < mod ? u + v : u + v - mod;
                a[i + k + len / 2] = u - v >= 0 ? u - v : u - v + mod;
                cur = (ll)cur * w % mod;
            }
        }
    }
    if (inv) {
        int ni = qpow(n, mod - 2);
        for (int &v : a) v = (ll)v * ni % mod;
    }
}

vector<int> mul(vector<int> a, vector<int> b) {
    int need = a.size() + b.size() - 1, n = 1;
    while (n < need) n <<= 1;                     // 补到 2 的幂
    a.resize(n); b.resize(n);
    ntt(a, 0); ntt(b, 0);
    for (int i = 0; i < n; i++) a[i] = (ll)a[i] * b[i] % mod;
    ntt(a, 1);
    a.resize(need);
    return a;
}

int main() {
    vector<int> a = {1, 2}, b = {3, 4};           // (1+2x)(3+4x)
    for (int v : mul(a, b)) cout << v << ' ';     // 3 10 8
    cout << '\n';
    vector<int> c = {1, 2, 3, 4}, d = {1, 1};     // (1+2x+3x^2+4x^3)(1+x)
    for (int v : mul(c, d)) cout << v << ' ';     // 1 3 5 7 4
    cout << '\n';
}
```

## 说明

- 复杂度：`O(n log n)`（`n` 为补齐后的长度），空间 `O(n)`；系数需全部小于模数，卷积结果的真实值也不能超过 `mod`（否则要拆位或 CRT 合并）。
- 998244353 = 119·2²³ + 1，原根为 3，支持长度到 2²³，是 NTT 的常用模数；换成 1004535809（原根 3）、469762049（原根 3）同样可用。
- 长度不足 `2` 的幂时一定要 `while (n < need) n <<= 1` 补齐，否则位逆序置换和蝶形都会错。
- 逆变换最后必须乘 `n^{-1}`，忘了这一步的结果会整体放大 `n` 倍。
- 与 FFT 的取舍：NTT 全是整数运算、无精度误差，比 `double` FFT 稳；但只能在特定模数下用，任意模数要用三模 NTT + CRT 或 `long double` FFT。
- 多项式乘法是基础，求逆、`ln/exp`、开方等都在这份 `ntt` 上实现，建议把 `ntt` 单独封装复用。

## 典型应用

- 洛谷 P3803【模板】多项式乘法（FFT/NTT）
- 洛谷 P4245【模板】任意模数多项式乘法
- 洛谷 P4238【模板】多项式乘法逆

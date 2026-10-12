---
title: 背包 DP（01 / 完全 / 多重）
description: 三种背包的一维数组写法，含"恰好装满"初始化技巧
category: 背包
tags: [背包, 01背包, 完全背包, 多重背包]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long

const int N = 105, M = 1005;
int n = 3, W = 10, dp[M];
int w[N] = {0, 1, 10, 4}, v[N] = {0, 10, 11, 5}, c[N] = {0, 3, 1, 2};

int knap01() {                                  // 每件最多一次：体积倒序
    memset(dp, 0, sizeof dp);
    for (int i = 1; i <= n; i++)
        for (int j = W; j >= w[i]; j--) dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}

int knapFull() {                                // 每件无限次：体积正序
    memset(dp, 0, sizeof dp);
    for (int i = 1; i <= n; i++)
        for (int j = w[i]; j <= W; j++) dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}

int knapMulti() {                               // 第 i 件最多 c[i] 个：二进制拆分
    memset(dp, 0, sizeof dp);
    for (int i = 1; i <= n; i++)
        for (int k = 1, r = c[i]; r > 0; k <<= 1) {
            int t = min(k, r); r -= t;
            int ww = w[i] * t, vv = v[i] * t;
            for (int j = W; j >= ww; j--) dp[j] = max(dp[j], dp[j - ww] + vv);
        }
    return dp[W];
}

int knapExact() {                               // 恰好装满：只有 0 合法，其余 -inf
    fill(dp, dp + W + 1, -(1LL << 60)); dp[0] = 0;
    for (int i = 1; i <= n; i++)
        for (int j = W; j >= w[i]; j--)
            if (dp[j - w[i]] > -(1LL << 60)) dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}

signed main() {
    cout << knap01() << " " << knapFull() << " "
         << knapMulti() << " " << knapExact() << "\n";
    return 0;
}
```

## 说明

- **倒序 vs 正序**是 01 背包与完全背包的唯一区别：倒序保证 `dp[j - w[i]]` 还是「没考虑第 i 件」的状态。
- 求**方案数**时把 `max` 换成加法（`dp[j] += dp[j - w[i]]`），注意取模。
- 求**恰好装满**必须区分初始值；求「不超过容量」则全部初始化为 0 即可。
- 分组背包（每组最多选一件）：外层枚举组，内层倒序枚举体积，再枚举组内物品。
- 体积很大而价值很小时，可以做「价值维」的背包（交换维度）。

## 典型应用

- 洛谷 P1048 [NOIP2005 普及组] 采药（01 背包）；
- 洛谷 P1616 疯狂的采药（完全背包）；
- 洛谷 P1776 宝物筛选（多重背包 + 二进制拆分）。

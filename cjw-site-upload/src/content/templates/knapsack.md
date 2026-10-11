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
// 物品 i 的体积 w[i]、价值 v[i]，背包容量 W

// ---------- 01 背包：每件物品最多取一次 ----------
vector<int> dp(W + 1, 0);
for (int i = 0; i < n; ++i)
    for (int j = W; j >= w[i]; --j)                 // 倒序遍历体积
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
// 答案：dp[W]

// ---------- 完全背包：每件物品可以取无限次 ----------
for (int i = 0; i < n; ++i)
    for (int j = w[i]; j <= W; ++j)                 // 正序遍历体积
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);

// ---------- 多重背包：第 i 件最多取 cnt[i] 个 ----------
for (int i = 0; i < n; ++i) {
    int c = cnt[i];
    for (int k = 1; c > 0; k <<= 1) {               // 二进制拆分：1,2,4,...
        int take = min(k, c);
        c -= take;
        int ww = w[i] * take, vv = v[i] * take;
        for (int j = W; j >= ww; --j)
            dp[j] = max(dp[j], dp[j - ww] + vv);
    }
}

// ---------- 恰好装满 W 的写法 ----------
// dp[0] = 0，其它位置设为 -inf（求方案数时设 0 并改为加法累加）
const int NEG = -1e9;
vector<int> exact(W + 1, NEG);
exact[0] = 0;
for (int i = 0; i < n; ++i)
    for (int j = W; j >= w[i]; --j)
        exact[j] = max(exact[j], exact[j - w[i]] + v[i]);
// 若 exact[W] < 0 说明无法恰好装满
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

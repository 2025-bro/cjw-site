---
title: 倍增（二进制跳跃）
description: 预处理 up[k][i] 表示跳 2^k 步到的位置，O(log k) 回答任意步数跳跃
category: 倍增
tags: [倍增, 二进制拆分, 跳跃表]
author: 通用
date: 2026-10-12
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5, LOG = 17;   // 2^16 > 1e5
int nxt[N], up[LOG][N];            // up[k][i]：从 i 跳 2^k 步到达的点

void build(int n) {                // O(n log n) 预处理
    for (int i = 1; i <= n; i++) up[0][i] = nxt[i];
    for (int k = 1; k < LOG; k++)
        for (int i = 1; i <= n; i++) up[k][i] = up[k - 1][up[k - 1][i]];
}

int jump(int u, int k) {           // 从 u 出发跳 k 步：把 k 按二进制拆开
    for (int b = 0; k; b++, k >>= 1)
        if (k & 1) u = up[b][u];
    return u;
}

signed main() {
    int n = 5;
    for (int i = 1; i < n; i++) nxt[i] = i + 1;
    nxt[n] = 1;                    // 1 -> 2 -> 3 -> 4 -> 5 -> 1 成环
    build(n);
    cout << jump(1, 7) << ' ' << jump(1, 10) << '\n';   // 3 1
    return 0;
}
```

## 说明

- 核心思想：任何步数都能拆成若干个 2 的幂，预处理出「跳 `2^k` 步」的结果后，一次跳跃只需 `O(log k)` 次合并。
- 适用条件：**跳跃结构固定且可重复合并**（有向图每个点一条出边、树上祖先、区间最值等）。LCA、ST 表、快速幂都是倍增思想的不同应用。
- 数组第一维开 `LOG = ceil(log2(max 步数)) + 1`，开小了会越界。
- 若跳跃可能跳出边界，把越界位置指向一个哨兵节点（如 0），并保证 `up[k][0] = 0`。
- 倍增也常用于「二分答案的倍增版」：从高位往低位试，能跳就跳（如求第一个满足条件的位置），常数比二分小。

## 典型应用

- 洛谷 P3379 最近公共祖先（倍增求 LCA，见「树上问题」模板）；
- 洛谷 P3865【模板】ST 表（倍增预处理区间最值）；
- 洛谷 P1967 [NOIP2013 提高组] 货车运输（倍增维护路径最小值）。

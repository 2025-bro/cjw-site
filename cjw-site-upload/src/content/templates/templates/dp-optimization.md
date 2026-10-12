---
title: DP 优化（单调队列优化）
description: 滑动窗口最值 O(n)，多重背包与线性 DP 的单调队列优化 O(nW)，末尾附斜率优化
category: DP 优化
tags: [单调队列, 多重背包, 滑动窗口, 斜率优化]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int MAXN = 100005;
const int MAXW = 40005;
const ll NEG = -1e18;

int n, W;
int w[105], v[105], c[105];
int a[MAXN];
ll dp[MAXW];
int q[MAXW], val[MAXW];              // 手写队列，head/tail 比 deque 快

void winmax(int n, int k) {          // 滑动窗口最大值，窗口长 k
    int h = 0, t = 0;
    for (int i = 1; i <= n; ++i) {
        while (h < t && q[h] <= i - k) ++h;          // 队头过期
        while (h < t && a[q[t - 1]] <= a[i]) --t;     // 队尾不优的弹掉
        q[t++] = i;
        if (i >= k) cout << a[q[h]] << " \n"[i == n];
    }
}

void multi() {                       // 多重背包：第 i 种物品最多取 c[i] 个
    for (int i = 1; i <= n; ++i) {
        int wi = w[i], ci = c[i], vi = v[i];
        for (int r = 0; r < wi && r <= W; ++r) {
            int h = 0, t = 0, idx = 0;
            for (int j = r; j <= W; j += wi, ++idx) {
                while (h < t && q[h] < idx - ci) ++h;            // 超过个数上限
                while (h < t && val[t - 1] <= dp[j] - (ll)idx * vi) --t;
                q[t] = idx; val[t] = dp[j] - (ll)idx * vi; ++t;
                dp[j] = max(dp[j], val[h] + (ll)idx * vi);
            }
        }
    }
}

signed main() {
    int b[6] = {0, 1, 3, 7, 9, 4};
    for (int i = 1; i <= 5; ++i) a[i] = b[i];
    winmax(5, 3);                                     // 3 7 9
    n = 2; W = 6;
    w[1] = 2; v[1] = 3; c[1] = 3;
    w[2] = 3; v[2] = 4; c[2] = 2;
    for (int j = 1; j <= W; ++j) dp[j] = NEG;         // 恰好装满
    dp[0] = 0;
    multi();
    cout << "knap = " << dp[6] << '\n';               // 9
    return 0;
}
```

## 说明

- 单调队列的本质：维护一个**下标递增、值也递增（或递减）**的队列，队头即窗口最值；`while` 弹出的元素永远不会再用到。
- 两个方向别写反：队头判「过期」（`<= i - k`），队尾判「不优」（`<= a[i]` 时弹）。
- 多重背包的优化思路是**按模 `w[i]` 分组**，每组内 `dp[j] = max(dp[j - k·wi] + k·vi)` 可整理成一条斜率固定的直线，于是组内用单调队列维护 `dp - idx·vi` 的最大值即可，复杂度从 `O(nW log c)` 降到 `O(nW)`。
- 「恰好装满」必须把 `dp` 初值设为 `-INF` 且只让 `dp[0] = 0`；求「不超过」时全设 0，并且组内比较要允许空窗口。
- 只有当转移区间**左右端点都单调**（形如 `dp[i] = max(dp[j] + g(i))`，`j ∈ [i - k, i - 1]`）时才能上单调队列；区间长度不固定就要用线段树 / 平衡树。
- **斜率优化**：当转移写成 `dp[i] = min(dp[j] + a[i]·x[j] + b[j])` 时，把每个 `j` 看成点 `(x[j], dp[j] + b[j])`，用凸包 / 单调栈维护下凸壳，`O(n)` 或 `O(n log n)` 求解；斜率不单调时用二分或李超树，式子里有平方项是常见信号。
- 决策单调性之外还有四边形不等式优化、WQS 二分、矩阵快速幂加速线性递推，按题目形式选一种即可。

## 典型应用

- 洛谷 P1886 滑动窗口 /【模板】单调队列（滑动窗口最值）；
- 洛谷 P1776 宝物筛选（多重背包单调队列优化）；
- 洛谷 P3195 [HNOI2008] 玩具装箱（斜率优化模板）。

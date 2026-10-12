---
title: 状压 DP（TSP 旅行商问题）
description: dp[mask][i] 表示走过集合 mask 且停在 i 的最短路，O(2^n · n^2)
category: 状压 DP
tags: [状压DP, TSP, 位运算, 最短哈密顿回路]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int MAXN = 18;
const int INF = 0x3f3f3f3f;

int n;
int d[MAXN][MAXN];
int dp[1 << MAXN][MAXN];           // 全局：18 时约 4.7M 个 int

int tsp() {                        // 固定从 0 号点出发，走遍所有点再回到 0
    int full = 1 << n;
    for (int mask = 0; mask < full; ++mask)
        for (int i = 0; i < n; ++i) dp[mask][i] = INF;
    dp[1][0] = 0;
    for (int mask = 1; mask < full; ++mask) {
        if (!(mask & 1)) continue;                 // 起点必须是 0，剪掉一半状态
        for (int i = 0; i < n; ++i) {
            if (dp[mask][i] == INF) continue;
            for (int j = 0; j < n; ++j) {
                if (mask >> j & 1) continue;
                int &nx = dp[mask | 1 << j][j];
                nx = min(nx, dp[mask][i] + d[i][j]);   // 引用绑定，注意别写错下标
            }
        }
    }
    int ans = INF;
    for (int i = 0; i < n; ++i)
        if (dp[full - 1][i] < INF) ans = min(ans, dp[full - 1][i] + d[i][0]);
    return ans;
}

signed main() {
    n = 4;
    int h[4][4] = {{0, 2, 9, 10}, {1, 0, 6, 4}, {15, 7, 0, 8}, {6, 3, 12, 0}};
    for (int i = 0; i < n; ++i)
        for (int j = 0; j < n; ++j) d[i][j] = h[i][j];
    cout << "TSP = " << tsp() << '\n';             // 21：0->1->3->2->0
    return 0;
}
```

## 说明

- 状态定义 `dp[mask][i]`：已经访问过的点集为 `mask`、当前停在 `i` 的最小代价；转移是「枚举下一个点」。
- 复杂度 `O(2^n · n^2)`，`n <= 18` 左右可行；`n = 20` 时内存和时间都很紧，需要滚动或折半。
- 起点固定可以把 `mask` 的 bit0 恒置 1，只枚举含 0 的集合；若答案是回路（要回到 0）最后再补上 `d[i][0]`。
- 需要**路径**时开 `pre[mask][i]` 记录前驱；只要长度就不用。图不等价时把回边设为 `INF`。
- `INT_MAX` 直接相加会溢出，所以用 `0x3f3f3f3f` 这种「大但可加」的初值，判 `INF` 再转移更稳。
- 位运算拆集合：`mask & (mask-1)` 去掉最低位，`mask & -mask` 取出最低位，`__builtin_popcount` 数元素，都能省时间。
- 规模再大就换成随机化 / 近似算法（模拟退火、状态压缩 + 分支限界），精确 TSP 是指数级的。

## 典型应用

- 洛谷 P1171 售货员的难题（TSP 状压模板，注意内存）；
- 洛谷 P1433 吃奶酪（状压 DP 求最短路径）；
- 洛谷 P1896 [SCOI2005] 互不侵犯（按行状压 DP，与棋盘类状压同源）。

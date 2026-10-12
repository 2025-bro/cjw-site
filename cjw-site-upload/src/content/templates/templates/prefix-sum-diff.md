---
title: 前缀和与差分
description: 一维/二维前缀和与差分，O(1) 区间查询、O(1) 区间修改
category: 前缀和与差分
tags: [前缀和, 差分, 二维前缀和]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long

const int N = 1005;
int n = 5, m = 3;
int a[N] = {0, 1, 2, 3, 4, 5}, s[N], d[N];      // s：前缀和，d：差分
int g[N][N], s2[N][N], d2[N][N];

void build() {                                  // 一维前缀和，a 下标从 1 开始
    for (int i = 1; i <= n; i++) s[i] = s[i - 1] + a[i];
}
int query(int l, int r) { return s[r] - s[l - 1]; }

void add(int l, int r, int v) { d[l] += v, d[r + 1] -= v; }   // 区间 [l,r] 全部加 v

void build2() {                                 // 二维前缀和：容斥
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            s2[i][j] = s2[i - 1][j] + s2[i][j - 1] - s2[i - 1][j - 1] + g[i][j];
}
int query2(int x1, int y1, int x2, int y2) {
    return s2[x2][y2] - s2[x1 - 1][y2] - s2[x2][y1 - 1] + s2[x1 - 1][y1 - 1];
}

void add2(int x1, int y1, int x2, int y2, int v) {            // 二维差分：子矩阵加 v
    d2[x1][y1] += v, d2[x2 + 1][y1] -= v, d2[x1][y2 + 1] -= v, d2[x2 + 1][y2 + 1] += v;
}
void restore2() {                               // 对差分数组做二维前缀和即还原
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            d2[i][j] += d2[i - 1][j] + d2[i][j - 1] - d2[i - 1][j - 1];
}

signed main() {
    build();
    cout << query(2, 4) << "\n";                // 2+3+4
    add(2, 4, 10);
    int cur = 0;
    for (int i = 1; i <= n; i++) { cur += d[i]; cout << a[i] + cur << " \n"[i == n]; }
    for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) g[i][j] = i * j;
    build2();
    cout << query2(2, 1, 3, 3) << "\n";         // (2+3)*(1+2+3)
    add2(2, 2, 3, 3, 5), restore2();
    cout << d2[2][2] << " " << d2[1][1] << "\n";
    return 0;
}
```

## 说明

- 前缀和把「区间求和」从 `O(n)` 降到 `O(1)`，代价是 `O(n)` 预处理。
- 差分是前缀和的逆运算：把「区间修改」从 `O(n)` 降到 `O(1)`，代价是最后要还原一次。**在线查询**的区间修改请用树状数组 / 线段树。
- 二维公式记法：容斥三加一减；`x1 - 1`、`y1 - 1` 越界时按 0 处理即可。
- 数值较大时用 `long long`，前缀和很容易超过 `int`。

## 典型应用

- 洛谷 P2367 语文成绩（一维差分）；
- 洛谷 P1387 最大正方形（二维前缀和 + DP）；
- 多次区间加减、最后统一求值的所有题目。

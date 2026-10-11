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
// 一维前缀和：a 下标 1..n，sum[i] = a[1] + ... + a[i]
vector<long long> buildPrefix(const vector<long long>& a) {
    int n = (int)a.size() - 1;
    vector<long long> sum(n + 1, 0);
    for (int i = 1; i <= n; ++i) sum[i] = sum[i - 1] + a[i];
    return sum;
}
// 区间 [l, r] 的和：sum[r] - sum[l - 1]

// 一维差分：把「区间加」变成两个单点修改
// d[i] = a[i] - a[i - 1]
// 对 [l, r] 全部加 v：
d[l] += v;
d[r + 1] -= v;
// 最后对 d 求前缀和，就还原出修改后的 a

// 二维前缀和：sum[i][j] 表示左上角 (1,1) 到 (i,j) 的矩形和
for (int i = 1; i <= n; ++i)
    for (int j = 1; j <= m; ++j)
        sum[i][j] = sum[i - 1][j] + sum[i][j - 1] - sum[i - 1][j - 1] + a[i][j];

// 子矩阵 (x1,y1) ~ (x2,y2) 的和：
long long rect = sum[x2][y2] - sum[x1 - 1][y2] - sum[x2][y1 - 1] + sum[x1 - 1][y1 - 1];

// 二维差分：子矩阵全部加 v（d 数组比原矩阵多一行一列）
d[x1][y1] += v;
d[x2 + 1][y1] -= v;
d[x1][y2 + 1] -= v;
d[x2 + 1][y2 + 1] += v;
// 最后做一次二维前缀和还原
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

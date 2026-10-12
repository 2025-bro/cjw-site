---
title: 期望 DP（倒推写法）
description: 掷骰子前进与收集卡片的期望步数，按状态倒推转移，O(n)
category: 概率与期望
tags: [概率与期望, 期望DP, 倒推, 概率]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 100005;
double f[MAXN];

// 收集卡片：已有 i 种，每次等概率抽到 n 种之一，集齐的期望次数
// E[i] = 1 + (i/n)E[i] + ((n-i)/n)E[i+1]  =>  E[i] = E[i+1] + n/(n-i)
double coupon(int n) {
    double e = 0;                       // E[n] = 0，从终点倒推
    for (int i = n - 1; i >= 0; i--) e += (double)n / (n - i);
    return e;
}

// 掷骰子：每次等概率前进 1..6 格，从 0 走到 n 的期望步数（倒推）
double dice(int n) {
    f[n] = 0;
    for (int i = n - 1; i >= 0; i--) {
        double s = 0;
        for (int k = 1; k <= 6; k++) s += f[min(n, i + k)];   // 超过 n 视作到 n
        f[i] = 1 + s / 6;
    }
    return f[0];
}

int main() {
    printf("%.6f\n", coupon(4));        // 8.333333 = 4*(1+1/2+1/3+1/4)
    printf("%.6f\n", coupon(10));       // 29.289683
    printf("%.6f\n", dice(3));          // 1.361111
    printf("%.6f\n", dice(1));          // 1.000000
}
```

## 说明

- 复杂度：状态数 `O(n)`，每个状态转移 `O(1)`（骰子那题是常数 6），总 `O(n)`。
- 倒推的方向：`E[i]` 表示「从状态 i 出发到达目标的期望代价」，先令终止态 `E[n]=0`，再从后往前推；正推（从起点向后）只在转移无环（DAG 按拓扑序）时方便。
- 自环要移项：`E[i] = 1 + p*E[i] + ...`，把带 `E[i]` 的项合并到左边，否则方程写错就会算出 `inf` 或负数。
- 边界处理最容易错：骰子题中 `i+k > n` 应截断为 `n`（或理解为「已达目标」），写成越界访问会 RE 或读到错误值。
- 期望是线性的：`E[X+Y] = E[X] + E[Y]` 与是否独立无关，能拆就拆，很多题因此不需要状压。
- 数值用 `double` 即可，`O(n)` 项累加误差可接受；状态数很大或转移带环时改用矩阵快速幂 / 高斯消元。

## 典型应用

- 洛谷 P4550 收集邮票（收集卡片的期望步数）
- 洛谷 P4316 绿豆蛙的归宿（DAG 上期望 DP 倒推）
- 洛谷 P1365 WJMZBMR打osu! / Easy

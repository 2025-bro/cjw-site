---
title: 自适应辛普森积分
description: 自适应辛普森法求定积分，精度可控，复杂度随函数光滑程度自适应
category: 数值方法
tags: [数值方法, 辛普森积分, 自适应, 定积分]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const double eps = 1e-9;

// 被积函数：4/(1+x^2)，在 [0,1] 上的积分等于 π
double f(double x) { return 4.0 / (1 + x * x); }

// 三点辛普森公式：(r-l)/6 * (f(l) + 4f(mid) + f(r))
double simpson(double l, double r) {
    double mid = (l + r) / 2;
    return (r - l) * (f(l) + 4 * f(mid) + f(r)) / 6;
}

// 自适应：s 是 [l,r] 的整体辛普森值，e 是本段允许误差，dep 限制递归深度
double asr(double l, double r, double s, double e, int dep) {
    double mid = (l + r) / 2;
    double sl = simpson(l, mid), sr = simpson(mid, r);
    if (dep <= 0 || fabs(sl + sr - s) < 15 * e) return sl + sr + (sl + sr - s) / 15;   // 龙格误差校正
    return asr(l, mid, sl, e / 2, dep - 1) + asr(mid, r, sr, e / 2, dep - 1);
}

double integrate(double l, double r, double e = eps) { return asr(l, r, simpson(l, r), e, 25); }

int main() {
    printf("%.8f\n", integrate(0, 1));      // 3.14159265 ≈ π
    printf("%.8f\n", integrate(0, 0));      // 0.00000000
    printf("%.8f\n", integrate(-1, 1));     // 6.28318531 ≈ 2π
}
```

## 说明

- 复杂度：对光滑函数约 `O(递归深度)` 次求值即可收敛（通常几十次），整体复杂度自适应，无法用固定公式给出上界。
- 核心是误差校正项 `(sl+sr-s)/15`：辛普森公式误差是 `O(h^4)`，两段合起来比一段小 15 倍，加上这一项能显著提高精度。
- 返回值的收敛判据是 `fabs(sl+sr-s) < 15*e`，两边同时把误差预算 `e` 减半，保证总误差不超过 `eps`；直接用绝对误差 `e` 不缩小会过度递归。
- 被积函数在积分区间内有奇点、剧烈振荡或无界时，辛普森法会失效或栈溢出，必须加 `dep` 限制（本题 25）并用变量替换消掉奇点。
- 积分区间是闭区间、且要保证 `l <= r`；奇函数的对称区间可直接判 0，但不要指望 `double` 得到精确 0（本题区间对称故为 0，输出即 0.00000000）。
- 与牛顿-莱布尼茨公式的取舍：能求出原函数就直接算，只有原函数难求（如 `sin(x)/x`、椭圆周长）时才用自适应辛普森。

## 典型应用

- 洛谷 P4525【模板】自适应辛普森法 1
- 洛谷 P4526【模板】自适应辛普森法 2
- 洛谷 P4207 [NOI2005] 月下柠檬树（辛普森积分求面积）

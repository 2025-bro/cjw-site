---
title: 三分法求单峰函数极值
description: 整数三分与浮点三分两套写法，求单峰/单谷函数极值，复杂度 O(log n)
category: 二分与三分
tags: [三分, 单峰函数, 浮点, 极值]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// 单峰函数 f(x) = -(x-7)^2 + 100，最大值在 x = 7
ll f(ll x) { return -(x - 7) * (x - 7) + 100; }

// 整数三分：找最大值，[l, r] 闭区间
ll tsearch(ll l, ll r) {
    while (r - l > 2) {                       // 留下 3 个点直接枚举更稳
        ll m1 = l + (r - l) / 3, m2 = r - (r - l) / 3;
        if (f(m1) < f(m2)) l = m1;            // 极值在右侧，舍左段
        else r = m2;                          // 求最小值时把 < 改成 >
    }
    ll ans = l;
    for (ll x = l; x <= r; x++) if (f(x) > f(ans)) ans = x;
    return ans;
}

double g(double x) { return x * sin(x); }     // 单峰区间 [0, 12] 上最大值

// 浮点三分：固定迭代次数，避免 eps 卡死
double tsearchd(double l, double r) {
    for (int i = 0; i < 200; i++) {
        double m1 = l + (r - l) / 3, m2 = r - (r - l) / 3;
        if (g(m1) < g(m2)) l = m1;
        else r = m2;
    }
    return l;
}

int main() {
    ll p = tsearch(0, 15);
    cout << "整数三分: x=" << p << " f=" << f(p) << "\n";
    double q = tsearchd(0, 12);
    cout << fixed << setprecision(6) << "浮点三分: x=" << q << " g=" << g(q) << "\n";
    return 0;
}
```

## 说明

- 复杂度：整数三分 O(log n)，浮点三分固定 200 次迭代（约 1e-16 精度）。
- 三分只对**严格单峰**（或严格单谷）函数正确。函数带平台段时比较会失效，此时应二分极值点的导数符号，而不是三分。
- 整数三分别用 `(l+r)/3` 缩小区间，必须留 `r - l <= 2` 最后枚举；直接 `while (l < r)` 三分在区间长度 2 时会把答案舍掉。
- 求最小值时把判断里的 `<` 改成 `>`；`m2 = r - (r - l)/3` 这种写法避免 `l + 2*(r-l)/3` 的取整偏差。
- 浮点三分用固定迭代次数而不是 `eps`，可以完全绕开精度死循环；单调函数（极值在端点）也能退化到端点。
- 多峰函数三分不可用，需要模拟退火或整数规划；二维单峰要把三分嵌套成 O(log²)。

## 典型应用

- 洛谷 P3382 【模板】三分法（浮点三分求单峰函数极值）
- 洛谷 P1883 函数（多个单峰函数取 max 仍是单峰，三分最小值）
- 洛谷 P2571 [SCOI2010] 传送带（三分嵌套三分，二维最优路径）

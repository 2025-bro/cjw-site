---
title: 整数二分通用模板
description: 两个万能二分写法：求最大值与求最小值，附防死循环要点
category: 二分与三分
tags: [二分, 二分答案]
author: WJC
date: 2026-09-30
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;
int a[N] = {0, 1, 3, 5, 7, 9};                    // a[1..5] 升序

// 最大的 x 满足 check(x)：答案靠右
int maxTrue(int l, int r, function<bool(int)> check) {
    while (l < r) {
        int mid = (l + r + 1) >> 1;                // +1 防死循环
        if (check(mid)) l = mid;
        else r = mid - 1;
    }
    return l;
}
// 最小的 x 满足 check(x)：答案靠左
int minTrue(int l, int r, function<bool(int)> check) {
    while (l < r) {
        int mid = (l + r) >> 1;
        if (check(mid)) r = mid;
        else l = mid + 1;
    }
    return l;
}
int lower_bound_(int l, int r, int x) {            // 第一个 >= x 的位置
    while (l < r) {
        int mid = (l + r) >> 1;
        if (a[mid] >= x) r = mid;
        else l = mid + 1;
    }
    return l;
}

signed main() {
    int n = 5;
    cout << maxTrue(1, 100, [](int x) { return x * x <= 150; }) << ' ';    // 12
    cout << minTrue(1, 100, [](int x) { return x * x >= 150; }) << ' ';    // 13
    cout << lower_bound_(1, n, 6) << '\n';                                 // 4
    return 0;
}
```

## 说明

- 两个写法只差两点：`mid` 是否 `+1`，以及 `check` 为真时移动哪个端点。
- 防死循环口诀：出现 `l = mid` 时 `mid` 必须写 `(l + r + 1) >> 1`。
- 边界用左闭右闭 `[l, r]`，初始范围要覆盖答案，别忘 `check` 必须有单调性。

## 典型应用

- 二分答案（最大值最小化 / 最小值最大化），如洛谷 P1182 数列分段；
- 手写 `lower_bound` / `upper_bound`；
- 实数二分：固定迭代 100 次或取 `eps = 1e-8`。

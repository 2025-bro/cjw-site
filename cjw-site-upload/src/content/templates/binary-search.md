---
title: 整数二分通用模板
description: 两个万能二分写法：求最大值与求最小值，附防死循环要点
category: 其他
tags: [二分, 二分答案]
author: WJC
date: 2026-09-30
---

## 代码

```cpp
// 写法一：求满足条件 check(x) 的最大值（区间前真后假）
// 答案靠右边时
// check 具有单调性：x 小的时候成立，x 大的时候不成立
int l = 0, r = n;                  // 根据题意设定上下界，保证 check(l) 为真
while (l < r) {
    int mid = (l + r + 1) >> 1;    // 注意 +1，防止 l = mid 死循环
    if (check(mid)) l = mid;
    else r = mid - 1;
}
// 答案：l

// 写法二：求满足条件 check(x) 的最小值（区间前假后真）
// 答案靠左边时
// check 具有单调性：x 小的时候不成立，x 大的时候成立
int l = 0, r = n;
while (l < r) {
    int mid = (l + r) >> 1;
    if (check(mid)) r = mid;
    else l = mid + 1;
}
// 答案：l
```

## 说明

- 两个模板的差别只有两点：`mid` 是否 `+1`，以及 `check` 为真时移动哪个端点。**先用区间性质判断要最大值还是最小值，再套模板**。
- 边界习惯：左闭右闭 `[l, r]`，初始 `l`、`r` 要覆盖答案范围。
- 防死循环口诀：`l = mid` 时 `mid` 必须 `(l + r + 1) >> 1`。

## 典型应用

- 二分答案（最大值最小化 / 最小值最大化），如洛谷 P1182 数列分段；
- 有序序列中查找上下界（`lower_bound` / `upper_bound` 手写版）；
- 实数二分：固定 100 次迭代或设 `eps = 1e-8`，注意用 `double`。

---
title: 卡常与实用技巧
description: 输入输出加速、O(n) 求第 k 小、位运算内建函数、随机数，比赛常用杂项
category: 其他技巧
tags: [卡常, nth_element, 位运算, mt19937]
author: 通用
date: 2026-10-12
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);                                 // 关同步 + 解绑，cin 就够快了

    vector<int> v = {5, 1, 4, 2, 3};
    nth_element(v.begin(), v.begin() + 2, v.end());    // O(n) 求第 3 小（0 下标 2）
    cout << "第 3 小 = " << v[2] << '\n';               // 3

    unsigned x = 0b10110000u;
    cout << "popcount = " << __builtin_popcount(x)
         << ", 末尾 0 个数 = " << __builtin_ctz(x)
         << ", 前导 0 个数 = " << __builtin_clz(x) << '\n';

    mt19937 rng(12345);                                // 固定种子便于复现，比赛可换 chrono 时间
    cout << "随机数 = " << rng() % 100 << ' ' << rng() % 100 << '\n';

    vector<int> w = {3, 1, 2};
    sort(w.begin(), w.end());
    cout << "lower_bound(2) = " << lower_bound(w.begin(), w.end(), 2) - w.begin() << '\n';
    return 0;
}
```

## 说明

- 卡常顺序：**换算法（降复杂度）→ 换数据结构 → 输入输出加速 → 微优化**。前两步收益最大，别一上来就写快读。
- `nth_element` 是 `O(n)` 求第 k 小/第 k 大的利器（不需要全排序时比 `sort` 快）。
- 内建位函数：`__builtin_popcount`（1 的个数）、`__builtin_ctz`（末尾 0 个数，等价于 lowbit 的位数-1）、`__builtin_clz`（前导 0 个数）；`long long` 版本在函数名后加 `ll`。
- 随机数用 `mt19937`（不要用 `rand()`，周期短、质量差）；对拍和随机化算法中固定种子能复现问题数据。
- `#pragma GCC optimize("O2")` 等指令在部分评测机有效，但可能被禁用；比赛以算法正确性为主。
- 其他小技巧：`__int128` 处理乘法溢出、`array` 比 `vector` 快一点、`emplace_back` 代替 `push_back`、多测记得清空全局数组。

## 典型应用

- 洛谷 P10815【模板】快速读入（配合「读入优化」模板）；
- 洛谷 P1177【模板】快速排序（`nth_element` + 三路划分写法）；
- 洛谷 P3374 等任何被时限卡住的题目，用来做最后的常数优化。

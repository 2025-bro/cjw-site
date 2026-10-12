---
title: 离散化（排序去重 + 二分映射）
description: 排序去重后用 lower_bound 映射到 1..k 排名，并支持反查原始下标，复杂度 O(n log n)
category: 离散化
tags: [离散化, lower_bound, 排序去重, 映射]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;
int n, a[N];
vector<int> v;                 // 排序去重后的所有值
vector<vector<int>> pos;       // pos[rank] = 取到该排名的原下标

// 值 -> 排名（从 1 开始）；值不存在时返回 v.size()+1
int rk(int x) { return lower_bound(v.begin(), v.end(), x) - v.begin() + 1; }

// 排名 -> 原值
int val(int id) { return v[id - 1]; }

// 建表：排序 + 去重
void build() {
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
}

// 反查：每个排名对应哪些原下标（必须在 a[i] 已换成排名后调用）
void buildPos() {
    pos.assign(v.size() + 1, {});
    for (int i = 1; i <= n; i++) pos[a[i]].push_back(i);
}

signed main() {
    n = 6;
    int b[6] = {100, -3, 100, 7, 2, -3};
    for (int i = 1; i <= n; i++) v.push_back(a[i] = b[i - 1]);
    build();                                       // 先排序去重
    for (int i = 1; i <= n; i++) a[i] = rk(a[i]);  // 再把原值换成排名
    buildPos();
    for (int i = 1; i <= n; i++) cout << a[i] << " \n"[i == n];
    cout << "去重后 " << v.size() << " 个值，7 的排名 = " << rk(7) << "，排名 3 的原值 = " << val(3) << "\n";
    cout << "原值 100 出现在下标:";
    for (int i : pos[rk(100)]) cout << ' ' << i;
    cout << '\n';
    return 0;
}
```

## 说明

- 复杂度：排序 O(n log n) + 去重 O(n) + 每个数二分 O(log n)，总体 O(n log n)，空间 O(n)。
- 排名从 1 开始最省事，可直接当作树状数组 / 线段树的下标（树状数组下标不能为 0）。
- **顺序很重要**：`build()`（排序去重）必须在使用 `rk()` 之前调用，否则 `lower_bound` 作用在无序数组上会得到错误排名，甚至越界。
- `unique` 只把重复元素移到末尾并返回新尾迭代器，必须配 `erase` 才真正去重，且 `unique` 前必须先 `sort`。
- 「严格小于计数」用 `lower_bound`，「小于等于计数」用 `upper_bound`。
- 与 `map` / `unordered_map` 的取舍：离散化常数小、内存连续、能直接当下标；但必须等数据全部读入后才能建表，不支持在线插入。值域 ≤ 1e7 时直接用计数数组更快。

## 典型应用

- 洛谷 P1955 [NOI2015] 程序自动分析（值域 1e9，先离散化再并查集）；
- 洛谷 P1908 逆序对（值域过大时先离散化再上树状数组）；
- 洛谷 P3374 树状数组 1 的离线做法、洛谷 P1177 排序后按下标统计。

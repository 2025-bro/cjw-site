---
title: 主席树（静态区间第 k 小）
description: 可持久化权值线段树，O(n log n) 建树、O(log n) 查询区间第 k 小
category: 可持久化
tags: [主席树, 可持久化, 第k小]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 200005, MAXM = MAXN * 20;
int n, m, tot;
int a[MAXN], b[MAXN], rt[MAXN];
int lc[MAXM], rc[MAXM], sum[MAXM];

int upd(int q, int l, int r, int x) {        // 在版本 q 上插入 x，返回新版本根
    int p = ++tot;
    lc[p] = lc[q], rc[p] = rc[q], sum[p] = sum[q] + 1;
    if (l == r) return p;
    int mid = (l + r) >> 1;
    if (x <= mid) lc[p] = upd(lc[q], l, mid, x);
    else rc[p] = upd(rc[q], mid + 1, r, x);
    return p;
}

int qry(int p, int q, int l, int r, int k) { // 版本差 (p] - (q]，找第 k 小
    if (l == r) return l;
    int mid = (l + r) >> 1, d = sum[lc[p]] - sum[lc[q]];
    if (k <= d) return qry(lc[p], lc[q], l, mid, k);
    return qry(rc[p], rc[q], mid + 1, r, k - d);
}

int main() {
    n = 5;
    int arr[] = {0, 3, 1, 4, 1, 5};
    for (int i = 1; i <= n; ++i) a[i] = b[i] = arr[i];
    sort(b + 1, b + n + 1);
    m = unique(b + 1, b + n + 1) - b - 1;    // 离散化后的值域大小
    for (int i = 1; i <= n; ++i) {
        int x = lower_bound(b + 1, b + m + 1, a[i]) - b;
        rt[i] = upd(rt[i - 1], 1, m, x);
    }
    cout << b[qry(rt[4], rt[1], 1, m, 2)] << ' ' << b[qry(rt[5], rt[0], 1, m, 3)]
         << ' ' << b[qry(rt[5], rt[1], 1, m, 4)] << '\n';   // 1 3 5
    return 0;
}
```

## 说明

- 每次插入新建 O(log n) 个节点，总节点数 O(n log n)，`MAXM` 至少要开到 n*log 并留余量（4e6 节点约 48MB）。
- 先离散化再按值域建树，`rt[i]` 表示前 i 个数构成的版本；区间 [l, r] 用版本差 `rt[r] - rt[l-1]` 查询。
- 查询时比较左子树节点数差 d 与 k：k <= d 走左，否则走右并令 `k -= d`，走到叶子即为答案的下标。
- 主席树本质是可持久化权值线段树，只支持单点修改（版本继承）；区间修改要用标记永久化，代码量翻倍。
- 节点数固定就用静态数组，别用 `new`；开数组前先估算 `n * (log2(值域) + 1)`，注意题目的内存限制。
- 区间众数、区间 mex 等可以套同样的版本差思想，把树上维护的信息换成可减的量即可。

## 典型应用

- 洛谷 P3834【模板】可持久化线段树 2（静态区间第 k 小）；
- 洛谷 P3919【模板】可持久化线段树 1（可持久化数组）；
- 洛谷 P3567 [POI2014] KUR-Couriers（区间出现次数超过一半的数）。

---
title: 数列分块（区间加 + 区间求和）
description: 分块维护区间加法与区间求和，单次操作 O(sqrt n)，实现难度低于线段树且扩展性强
category: 分块与莫队
tags: [分块, 区间加, 区间求和]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long

const int MAXN = 100005;
int n, B, cnt;
int a[MAXN], bel[MAXN], L[MAXN], R[MAXN], sum[MAXN], add[MAXN];

void build() {
    B = sqrt(n), cnt = (n + B - 1) / B;
    for (int i = 1; i <= cnt; ++i)
        L[i] = (i - 1) * B + 1, R[i] = min(n, (int)(i * B));
    for (int i = 1; i <= n; ++i)
        bel[i] = (i - 1) / B + 1, sum[bel[i]] += a[i];
}

void upd(int l, int r, int v) {                  // 区间加
    if (bel[l] == bel[r]) {
        for (int i = l; i <= r; ++i) a[i] += v;
        sum[bel[l]] += v * (r - l + 1);
        return;
    }
    for (int i = l; i <= R[bel[l]]; ++i) a[i] += v;
    sum[bel[l]] += v * (R[bel[l]] - l + 1);
    for (int i = L[bel[r]]; i <= r; ++i) a[i] += v;
    sum[bel[r]] += v * (r - L[bel[r]] + 1);
    for (int b = bel[l] + 1; b < bel[r]; ++b) add[b] += v;   // 整块只打标记
}

int qry(int l, int r) {                          // 区间求和
    int res = 0;
    if (bel[l] == bel[r]) {
        for (int i = l; i <= r; ++i) res += a[i] + add[bel[i]];
        return res;
    }
    for (int i = l; i <= R[bel[l]]; ++i) res += a[i] + add[bel[l]];
    for (int i = L[bel[r]]; i <= r; ++i) res += a[i] + add[bel[r]];
    for (int b = bel[l] + 1; b < bel[r]; ++b) res += sum[b] + add[b] * (R[b] - L[b] + 1);
    return res;
}

signed main() {
    n = 8;
    int arr[] = {0, 1, 2, 3, 4, 5, 6, 7, 8};
    for (int i = 1; i <= n; ++i) a[i] = arr[i];
    build(), upd(2, 7, 1);
    cout << qry(1, 8) << ' ' << qry(3, 5) << '\n';   // 42 15
}
```

## 说明

- 块长取 sqrt(n)，散块暴力、整块 O(1) 打标记，单次操作 O(sqrt n)，总复杂度 O(n sqrt n)。
- 块长可以按询问数微调：修改多询问少取小一点，询问多时 `B = n / sqrt(m)` 常数更优。
- 同块的情况必须单独处理，不能走整块逻辑；整块循环写 `b < bel[r]` 而不是 `<=`。
- 散块修改时一定要同步更新 `sum[bel]`，否则整块询问会用到过期的块和。
- 分块上限比线段树高（区间众数、区间 >= x 的个数带修改等），但 O(sqrt n) 劣于 O(log n)。
- 区间加 + 区间和这种可合并信息优先用线段树 / 树状数组，分块留给线段树做不动的题。

## 典型应用

- 洛谷 P3372【模板】线段树 1（区间加、区间求和，分块可直接通过）；
- 洛谷 P2801 教主的魔法（区间加 + 查询区间内 >= x 的元素个数）；
- 洛谷 P4168 [Violet] 蒲公英（区间众数，分块经典题）。

---
title: 树状数组（Fenwick）
description: 单点修改 + 区间查询、区间加 + 区间和，常数小、代码短
category: 树状数组
tags: [树状数组, 前缀和, 动态区间和]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
// 最常用版本：单点加、前缀和 / 区间和查询，O(log n)
struct BIT {
    int n;
    vector<long long> t;

    BIT(int n = 0) : n(n), t(n + 1, 0) {}

    // a[i] += v
    void add(int i, long long v) {
        for (; i <= n; i += i & -i) t[i] += v;
    }

    // a[1] + ... + a[i]
    long long sum(int i) const {
        long long s = 0;
        for (; i > 0; i -= i & -i) s += t[i];
        return s;
    }

    // a[l] + ... + a[r]
    long long rangeSum(int l, int r) const { return sum(r) - sum(l - 1); }
};

// 如果要「区间加、区间求和」，维护两个树状数组（基于差分）
struct BITRange {
    int n;
    vector<long long> t1, t2;

    BITRange(int n = 0) : n(n), t1(n + 2, 0), t2(n + 2, 0) {}

    void add(vector<long long>& t, int i, long long v) {
        for (; i <= n; i += i & -i) t[i] += v;
    }

    // a[l..r] 全部加 v
    void rangeAdd(int l, int r, long long v) {
        add(t1, l, v);
        add(t1, r + 1, -v);
        add(t2, l, v * (l - 1));
        add(t2, r + 1, -v * r);
    }

    // 前缀和 a[1] + ... + a[i]
    long long pre(int i) const {
        long long s1 = 0, s2 = 0;
        for (int x = i; x > 0; x -= x & -x) {
            s1 += t1[x];
            s2 += t2[x];
        }
        return s1 * i - s2;
    }

    long long rangeSum(int l, int r) const { return pre(r) - pre(l - 1); }
};
```

## 说明

- 核心是 `i & -i`（lowbit）：`t[i]` 维护的是区间 `(i - lowbit(i), i]` 的和。
- 只支持「可减」的信息（求和、异或、计数）；求最值请用线段树或 ST 表。
- 区间加 + 单点查：对差分数组建普通 BIT，查询前缀和即可。
- 常数比线段树小很多，能用树状数组就别上线段树。

## 典型应用

- 洛谷 P3374【模板】树状数组 1（单点加、区间和）；
- 洛谷 P3368【模板】树状数组 2（区间加、单点查）；
- 逆序对计数（配合离散化，见「离散化」模板）。

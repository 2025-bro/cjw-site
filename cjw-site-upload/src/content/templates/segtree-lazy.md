---
title: 线段树（区间加 + 区间求和）
description: 带懒标记的线段树模板，支持区间加法与区间求和查询
category: 数据结构
tags: [线段树, 懒标记, RMQ]
author: WJC
date: 2026-09-25
---

## 代码

```cpp
// 需要 <vector>，using ll = long long;
// 下标约定：数组 a[1..n]，树节点编号从 1 开始
struct SegTree {
    int n;
    vector<ll> sum, add;   // add: 懒标记（区间加）

    SegTree(const vector<ll>& a) {
        n = (int)a.size() - 1;          // a[1..n]
        sum.assign(n * 4 + 5, 0);
        add.assign(n * 4 + 5, 0);
        build(1, 1, n, a);
    }

    void build(int p, int l, int r, const vector<ll>& a) {
        if (l == r) { sum[p] = a[l]; return; }
        int mid = (l + r) >> 1;
        build(p << 1, l, mid, a);
        build(p << 1 | 1, mid + 1, r, a);
        sum[p] = sum[p << 1] + sum[p << 1 | 1];
    }

    void apply(int p, int l, int r, ll v) {
        sum[p] += v * (r - l + 1);
        add[p] += v;
    }

    void pushdown(int p, int l, int r) {
        if (!add[p]) return;
        int mid = (l + r) >> 1;
        apply(p << 1, l, mid, add[p]);
        apply(p << 1 | 1, mid + 1, r, add[p]);
        add[p] = 0;
    }

    void update(int p, int l, int r, int ql, int qr, ll v) {
        if (ql <= l && r <= qr) { apply(p, l, r, v); return; }
        pushdown(p, l, r);
        int mid = (l + r) >> 1;
        if (ql <= mid) update(p << 1, l, mid, ql, qr, v);
        if (qr > mid) update(p << 1 | 1, mid + 1, r, ql, qr, v);
        sum[p] = sum[p << 1] + sum[p << 1 | 1];
    }

    ll query(int p, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return sum[p];
        pushdown(p, l, r);
        int mid = (l + r) >> 1;
        ll res = 0;
        if (ql <= mid) res += query(p << 1, l, mid, ql, qr);
        if (qr > mid) res += query(p << 1 | 1, mid + 1, r, ql, qr);
        return res;
    }

    // 对外接口
    void update(int l, int r, ll v) { update(1, 1, n, l, r, v); }
    ll query(int l, int r) { return query(1, 1, n, l, r); }
};
```

## 说明

- 区间加 + 区间求和是懒标记最经典的形态，改动 `apply`/`pushdown` 即可扩展成区间赋值、区间乘等。
- 单点修改可以看成区间长度 1 的区间修改。
- 常数优化：非递归（zkw）线段树更快，需要时再查对应模板。

## 典型应用

- 洛谷 P3372【模板】线段树 1（区间加、区间和）；
- 配合差分思想处理区间覆盖类问题。

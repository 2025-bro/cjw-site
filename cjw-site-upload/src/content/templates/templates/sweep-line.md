---
title: 扫描线（矩形面积并）
description: 线段树 + 扫描线求矩形面积并，离散化 y 坐标后 O(n log n)
category: 扫描线
tags: [线段树, 离散化, 面积并, 扫描线]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 2e5 + 5;
int cnt[N << 2], len[N << 2], ys[N << 1];

struct Seg {                                 // 竖直边：在 x 处，覆盖 y 区间 [yl, yr]
    int x, yl, yr, v;
    bool operator<(const Seg& o) const { return x != o.x ? x < o.x : v > o.v; }
} e[N << 1];

void upd(int o, int l, int r, int ql, int qr, int v) {
    if (ql <= l && r <= qr) {
        cnt[o] += v;
        len[o] = cnt[o] ? ys[r + 1] - ys[l] : (l == r ? 0 : len[o << 1] + len[o << 1 | 1]);
        return;
    }
    int m = (l + r) >> 1;
    if (ql <= m) upd(o << 1, l, m, ql, qr, v);
    if (qr > m) upd(o << 1 | 1, m + 1, r, ql, qr, v);
    len[o] = cnt[o] ? ys[r + 1] - ys[l] : len[o << 1] + len[o << 1 | 1];
}

signed main() {
    int x1[3] = {0, 2, 1}, y1[3] = {0, 1, 3};       // 三个矩形的左下 / 右上
    int x2[3] = {4, 6, 5}, y2[3] = {3, 4, 5};
    int n = 3, m = 0, tot = 0;
    for (int i = 0; i < n; ++i) {
        ys[m++] = y1[i];
        ys[m++] = y2[i];
        e[++tot] = {x1[i], y1[i], y2[i], 1};
        e[++tot] = {x2[i], y1[i], y2[i], -1};
    }
    sort(ys, ys + m);
    m = (int)(unique(ys, ys + m) - ys);
    sort(e + 1, e + tot + 1);
    int ans = 0;
    for (int i = 1; i <= tot; ++i) {
        if (i > 1) ans += len[1] * (e[i].x - e[i - 1].x);              // 上一段宽度 × 当前高度
        int l = (int)(lower_bound(ys, ys + m, e[i].yl) - ys);
        int r = (int)(lower_bound(ys, ys + m, e[i].yr) - ys) - 1;
        if (l <= r) upd(1, 0, m - 2, l, r, e[i].v);
    }
    cout << ans << '\n';
    return 0;
}
```

## 说明

- 把矩形拆成两条竖直边（左 `+1`、右 `-1`），按 `x` 排序后从左往右扫，面积增量为「当前被覆盖的 y 总长 × 相邻两条边的 `x` 差」，总复杂度 `O(n log n)`。
- 线段树每个节点记 `cnt`（完全覆盖该区间的边数）和 `len`（该区间被覆盖的总长度）；`cnt > 0` 时 `len` 直接取整个区间长度，否则从左右儿子合并——因此不需要下传标记（不下传的区间加线段树）。
- 叶子表示的是「相邻两个 y 坐标之间的一段」，`ys` 有 `m` 个不同值就对应 `m - 1` 个区间，所以线段树下标范围是 `0 .. m-2`；写成 `0 .. m-1` 会越界。
- 更新前先累加面积再插入当前边：`ans += len[1] * (e[i].x - e[i-1].x)`，这样区间 `[x_{i-1}, x_i]` 恰由前 `i-1` 条边覆盖，不易多算。
- 排序时同一 `x` 要让 `+1` 排在 `-1` 前面（`v > o.v`），否则相邻矩形边界处会算出一段负宽度。
- 矩形周长并可在同一框架上做：面积增量外再记录覆盖段数与是否覆盖左右端点，增量改为 `2 * 段数 * Δx`。

## 典型应用

- 洛谷 P5490【模板】扫描线（矩形面积并）；
- 洛谷 P1856 [IOI1998] Picture / [USACO5.5] 矩形周长 Picture（周长并）；
- 洛谷 P1502 窗口的星星（矩形覆盖权值和，扫描线 + 线段树）。

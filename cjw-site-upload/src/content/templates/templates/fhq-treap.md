---
title: FHQ Treap（无旋平衡树）
description: split/merge 实现插入、删除、排名、第 k 小、前驱后继，单次操作期望 O(log n)
category: 平衡树
tags: [FHQ Treap, 平衡树, split/merge]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 200005;
int rt, tot;
int lc[MAXN], rc[MAXN], sz[MAXN], val[MAXN], pri[MAXN];

int newnode(int v) {
    val[++tot] = v, sz[tot] = 1, pri[tot] = rand();
    lc[tot] = rc[tot] = 0;
    return tot;
}

void pushup(int p) { sz[p] = sz[lc[p]] + sz[rc[p]] + 1; }

void split(int p, int v, int& x, int& y) {   // x: <= v, y: > v
    if (!p) { x = y = 0; return; }
    if (val[p] <= v) x = p, split(rc[p], v, rc[p], y);
    else y = p, split(lc[p], v, x, lc[p]);
    pushup(p);
}

int merge(int x, int y) {
    if (!x || !y) return x | y;
    if (pri[x] < pri[y]) { rc[x] = merge(rc[x], y), pushup(x); return x; }
    lc[y] = merge(x, lc[y]), pushup(y);
    return y;
}

void ins(int v) { int x, y; split(rt, v, x, y), rt = merge(merge(x, newnode(v)), y); }

void del(int v) {                            // 只删一个 v
    int x, y, z;
    split(rt, v, x, z), split(x, v - 1, x, y);
    y = merge(lc[y], rc[y]);                 // 扔掉等于 v 的那个根
    rt = merge(merge(x, y), z);
}

int rnk(int v) {                             // 排名 = 小于 v 的个数 + 1
    int x, y;
    split(rt, v - 1, x, y);
    int res = sz[x] + 1;
    rt = merge(x, y);
    return res;
}

int kth(int k) {                             // 第 k 小
    int p = rt;
    while (p) {
        if (sz[lc[p]] >= k) p = lc[p];
        else if (sz[lc[p]] + 1 == k) return val[p];
        else k -= sz[lc[p]] + 1, p = rc[p];
    }
    return -1;                               // k 越界
}

int pre(int v) {                             // 前驱：< v 的最大值
    int x, y;
    split(rt, v - 1, x, y);
    int p = x, res = -1;
    while (p) res = val[p], p = rc[p];
    rt = merge(x, y);
    return res;
}

int nxt(int v) {                             // 后继：> v 的最小值
    int x, y;
    split(rt, v, x, y);
    int p = y, res = -1;
    while (p) res = val[p], p = lc[p];
    rt = merge(x, y);
    return res;
}

int main() {
    srand(19260817);
    for (int v : {5, 3, 8, 3, 1}) ins(v);
    cout << rnk(3) << ' ' << kth(1) << ' ' << kth(3) << ' ' << pre(5) << ' ' << nxt(5) << '\n';
    del(3);                                  // 2 1 3 3 8
    cout << kth(3) << ' ' << rnk(3) << '\n'; // 5 2
    return 0;
}
```

## 说明

- 无旋 Treap 只有 `split` / `merge` 两个核心函数，代码短且天然支持区间操作（把区间 split 出来打标记）。
- `split(p, v, x, y)` 约定左树 `x` 全 <= v、右树 `y` 全 > v；改成 `< v` 就能直接查排名 / 前驱。
- `rnk(v)` 返回的是"第一个 v"的排名，有重复元素时和普通平衡树板子的定义保持一致。
- `del(v)` 只删一个：把等于 v 的那棵子树 y 的根丢掉再 merge 它的左右儿子，重复元素会被保留。
- 期望树高 O(log n) 依赖随机质量，`rand()` 足够用；多测时记得重置 `tot = rt = 0`，静态数组比 new 快很多。
- 查前驱后继要在 split 出的子树上走到底，取完值一定要 merge 回去，否则整棵树会散掉。

## 典型应用

- 洛谷 P3369【模板】普通平衡树（本题六个操作的全套）；
- 洛谷 P3391【模板】文艺平衡树（FHQ 做区间翻转）；
- 洛谷 P1486 [NOI2004] 郁闷的出纳员（按值 split 批量删除）。

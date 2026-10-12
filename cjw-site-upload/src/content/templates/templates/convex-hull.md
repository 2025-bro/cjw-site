---
title: 二维凸包（Andrew 算法）
description: O(n log n) 求凸包顶点，可用于凸包周长/面积
category: 凸包
tags: [计算几何, 凸包, Andrew, 叉积]
author: 通用
date: 2026-10-09
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

struct P {
    ll x, y;
    bool operator<(const P &o) const { return x != o.x ? x < o.x : y < o.y; }
    bool operator==(const P &o) const { return x == o.x && y == o.y; }
};

ll cross(P o, P a, P b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }

vector<P> hull(vector<P> p) {               // Andrew 单调链，逆时针返回
    sort(p.begin(), p.end());
    p.erase(unique(p.begin(), p.end()), p.end());
    int n = p.size(), k = 0;
    if (n <= 2) return p;
    vector<P> h(2 * n);
    for (int i = 0; i < n; i++) {                                  // 下凸壳
        while (k >= 2 && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    for (int i = n - 2, t = k + 1; i >= 0; i--) {                  // 上凸壳
        while (k >= t && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    h.resize(k - 1);                                              // 末点与起点重复
    return h;
}

ll area2(const vector<P> &h) {              // 面积的两倍，整数运算
    ll s = 0;
    for (int i = 0; i < (int)h.size(); i++) {
        P a = h[i], b = h[(i + 1) % h.size()];
        s += a.x * b.y - a.y * b.x;
    }
    return s < 0 ? -s : s;
}

int main() {
    vector<P> p = {{0, 0}, {4, 0}, {4, 4}, {0, 4}, {2, 2}, {0, 0}};
    p = hull(p);
    cout << p.size() << " " << area2(p) << "\n";
    for (auto &q : p) cout << q.x << "," << q.y << " ";
    cout << "\n";
    return 0;
}
```

## 说明

- 单调链思路：按 `x` 排序后分别扫出下凸壳和上凸壳，每扫一个点就弹掉「不左转」的栈顶点。
- `cross(...) <= 0` 表示去掉共线的中间点；若想保留边上的点（共线也算凸包上），改成 `< 0`。
- 坐标较大时叉积要开 `long long`（`10^9 × 10^9` 会爆 `int`）。
- 凸包常用于旋转卡壳（求最远点对、最小外接矩形）、半平面交等后续算法。

## 典型应用

- 洛谷 P2742【模板】二维凸包 / [USACO5.1] 圈奶牛 Fencing the Cows；
- 洛谷 P1452 旋转卡壳（凸包 + 最远点对）；
- 判断点是否在多边形内、最小覆盖图形等几何题。

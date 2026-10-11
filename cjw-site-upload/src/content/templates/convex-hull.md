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
struct Point {
    long long x, y;
    bool operator<(const Point& o) const { return x != o.x ? x < o.x : y < o.y; }
    bool operator==(const Point& o) const { return x == o.x && y == o.y; }
};

// 叉积 OA × OB：> 0 表示 O->A->B 是逆时针（左转）
long long cross(const Point& O, const Point& A, const Point& B) {
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

// Andrew 单调链：返回逆时针排列的凸包顶点
vector<Point> convexHull(vector<Point> p) {
    sort(p.begin(), p.end());
    p.erase(unique(p.begin(), p.end()), p.end());
    int n = (int)p.size();
    if (n <= 2) return p;

    vector<Point> hull(2 * n);
    int k = 0;
    for (int i = 0; i < n; ++i) {                          // 下凸壳
        while (k >= 2 && cross(hull[k - 2], hull[k - 1], p[i]) <= 0) --k;
        hull[k++] = p[i];
    }
    for (int i = n - 2, lower = k + 1; i >= 0; --i) {      // 上凸壳
        while (k >= lower && cross(hull[k - 2], hull[k - 1], p[i]) <= 0) --k;
        hull[k++] = p[i];
    }
    hull.resize(k - 1);                                    // 末尾与起点重复，去掉
    return hull;
}

// 凸包周长
double hullPerimeter(const vector<Point>& h) {
    double sum = 0;
    for (int i = 0; i < (int)h.size(); ++i) {
        const Point& a = h[i];
        const Point& b = h[(i + 1) % h.size()];
        sum += sqrt((double)(a.x - b.x) * (a.x - b.x) + (double)(a.y - b.y) * (a.y - b.y));
    }
    return sum;
}

// 凸包面积的两倍（鞋带公式，整数运算）
long long hullArea2(const vector<Point>& h) {
    long long s = 0;
    for (int i = 0; i < (int)h.size(); ++i) {
        const Point& a = h[i];
        const Point& b = h[(i + 1) % h.size()];
        s += a.x * b.y - a.y * b.x;
    }
    return s < 0 ? -s : s;
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

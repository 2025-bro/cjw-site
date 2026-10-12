---
title: 基础几何（向量运算与相交判定）
description: O(1) 点积叉积、线段相交、线段方向，配 O(n) 射线法判点在多边形内
category: 基础几何
tags: [计算几何, 叉积, 线段相交, 点在多边形内]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const double eps = 1e-9;
int sgn(double x) { return x > eps ? 1 : (x < -eps ? -1 : 0); }

struct P {
    double x, y;
    P operator+(const P& o) const { return {x + o.x, y + o.y}; }
    P operator-(const P& o) const { return {x - o.x, y - o.y}; }
    double operator*(const P& o) const { return x * o.x + y * o.y; }   // 点积
    bool operator<(const P& o) const { return sgn(x - o.x) ? x < o.x : y < o.y; }
    bool operator==(const P& o) const { return !sgn(x - o.x) && !sgn(y - o.y); }
};

double cross(const P& O, const P& A, const P& B) {                    // OA × OB
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

// 判断以 O 为拐点时 A->B 的转向：1 逆时针，-1 顺时针，0 共线
int turn(const P& O, const P& A, const P& B) { return sgn(cross(O, A, B)); }

// 点是否在线段 ab 上（含端点，假定已共线）
bool onSeg(const P& a, const P& b, const P& p) {
    return sgn((p - a) * (p - b)) <= 0;
}

// 线段 ab 与 cd 是否相交（含共线重叠、端点接触）
bool segCross(const P& a, const P& b, const P& c, const P& d) {
    int d1 = turn(a, b, c), d2 = turn(a, b, d), d3 = turn(c, d, a), d4 = turn(c, d, b);
    if (d1 * d2 < 0 && d3 * d4 < 0) return true;                      // 严格跨立
    if (!d1 && onSeg(a, b, c)) return true;
    if (!d2 && onSeg(a, b, d)) return true;
    if (!d3 && onSeg(c, d, a)) return true;
    if (!d4 && onSeg(c, d, b)) return true;
    return false;
}

// 射线法：点 p 是否在简单多边形 poly 内，边界返回 -1，内部 1，外部 0
int inPolygon(const vector<P>& poly, const P& p) {
    int n = (int)poly.size(), c = 0;
    for (int i = 0, j = n - 1; i < n; j = i++) {
        const P& a = poly[i];
        const P& b = poly[j];
        if (onSeg(a, b, p) && !sgn(cross(a, b, p))) return -1;         // 落在边上
        if ((a.y > p.y) != (b.y > p.y)) {
            double x = a.x + (p.y - a.y) * (b.x - a.x) / (b.y - a.y);
            if (sgn(x - p.x) > 0) c ^= 1;
        }
    }
    return c;
}

signed main() {
    cout << turn({0, 0}, {1, 0}, {0, 1}) << '\n';                       // 1 逆时针
    cout << segCross({0, 0}, {2, 2}, {0, 2}, {2, 0}) << '\n';           // 1 相交
    cout << segCross({0, 0}, {1, 1}, {2, 2}, {3, 3}) << '\n';           // 0 平行共线不搭
    cout << inPolygon({{0, 0}, {4, 0}, {4, 4}, {0, 4}}, {2, 2}) << '\n';// 1 内部
    cout << inPolygon({{0, 0}, {4, 0}, {4, 4}, {0, 4}}, {5, 2}) << '\n';// 0 外部
    return 0;
}
```

## 说明

- 一律用 `sgn()` 代替直接比 `double`，浮点误差不会漏判共线；坐标是整数时优先改用 `long long` 叉积，完全避开 `eps`。
- `cross(O,A,B) > 0` 表示 `O->A->B` 逆时针（左转）；凸包、极角排序、旋转卡壳都靠它。
- 线段相交不能只看 `d1*d2 < 0 && d3*d4 < 0`，还必须单独处理共线情形（`d == 0` 时用点积 `onSeg` 判落在段内），否则会漏掉端点接触与重叠。
- 射线法用 `(a.y > p.y) != (b.y > p.y)` 做半开区间统计，避开了射线过顶点被重复计数的经典 bug；边界点用 `onSeg` 单独返回。
- 多边形顶点需按顺（逆）时针给出（简单多边形，不自交）；射线法在凸多边形上不如二分 `O(log n)` 快，但通用性最好。

## 典型应用

- 洛谷 P1355 神秘大三角（点在三角形内外判定）；
- 洛谷 P2742【模板】二维凸包（叉积判转向）；
- 洛谷 P1652 圆 / 线段与多边形交、线段相交类几何判定题。

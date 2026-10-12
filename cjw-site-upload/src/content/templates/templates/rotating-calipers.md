---
title: 旋转卡壳（凸包直径）
description: O(n log n) 求凸包后，O(n) 卡壳求出凸包上最远点对距离
category: 旋转卡壳
tags: [计算几何, 凸包, 最远点对, 叉积]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
struct Point {
    int x, y;
    bool operator<(const Point& o) const { return x != o.x ? x < o.x : y < o.y; }
    bool operator==(const Point& o) const { return x == o.x && y == o.y; }
};

int cross(const Point& O, const Point& A, const Point& B) {          // OA × OB
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

vector<Point> hull(vector<Point> p) {                                // Andrew 单调链
    sort(p.begin(), p.end());
    p.erase(unique(p.begin(), p.end()), p.end());
    int n = (int)p.size();
    if (n <= 2) return p;
    vector<Point> h(2 * n);
    int k = 0;
    for (int i = 0; i < n; ++i) {
        while (k >= 2 && cross(h[k - 2], h[k - 1], p[i]) <= 0) --k;
        h[k++] = p[i];
    }
    for (int i = n - 2, low = k + 1; i >= 0; --i) {
        while (k >= low && cross(h[k - 2], h[k - 1], p[i]) <= 0) --k;
        h[k++] = p[i];
    }
    h.resize(k - 1);                                                 // 首尾重复去掉
    return h;
}

int dis2(const Point& a, const Point& b) {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

// 凸包直径的平方（最远点对），h 为逆时针凸包
int calipers(const vector<Point>& h) {
    int n = (int)h.size();
    if (n == 1) return 0;
    if (n == 2) return dis2(h[0], h[1]);
    int j = 1, ans = 0;
    for (int i = 0; i < n; ++i) {
        while (cross(h[i], h[(i + 1) % n], h[(j + 1) % n]) >
               cross(h[i], h[(i + 1) % n], h[j])) j = (j + 1) % n;   // 对踵点随边单调转
        ans = max(ans, max(dis2(h[i], h[j]), dis2(h[(i + 1) % n], h[j])));
    }
    return ans;
}

signed main() {
    vector<Point> p = {{0, 0}, {4, 0}, {4, 4}, {0, 4}, {2, 3}};
    vector<Point> h = hull(p);
    cout << h.size() << '\n';            // 4 个凸包顶点
    cout << calipers(h) << '\n';         // 32 = 4^2 + 4^2
    return 0;
}
```

## 说明

- 先 `O(n log n)` 求凸包，再做旋转卡壳：最远点对一定在凸包顶点上，凸包内部点无需考虑。
- 卡壳核心是「对踵点」单调性：枚举边 `(i, i+1)` 时，离该边最远的顶点 `j` 只会随 `i` 前进而不回退，因此 `while` 用叉积（点到直线的面积）比较即可，总移动 `O(n)`。
- 距离比较一律用平方（`dis2`），避免开根号的精度问题；`ans` 也返回平方，输出时再 `sqrt`。
- 叉积比较用严格 `>`，遇共线时停住不转，答案依然正确；若写成 `>=` 在共线多点的凸包上可能导致跨步过多。
- 边界：`n == 1` 返回 0，`n == 2` 直接返回两点距离平方；凸包必须逆时针且无重复点，否则 `j` 的单调性被破坏。
- 与「枚举点对 `O(n^2)`」的取舍：点数 `10^5` 时必须用卡壳；若还要求最小外接矩形、最小宽度、两凸包最近距离，用同一份对踵点代码扩展即可。

## 典型应用

- 洛谷 P1452 旋转卡壳（【模板】凸包直径 / 最远点对）；
- 洛谷 P2742【模板】二维凸包（求凸包后接卡壳）；
- 洛谷 P4166 [USACO08MAR] 面积最大的三角形、最小覆盖矩形等凸包最优化问题。

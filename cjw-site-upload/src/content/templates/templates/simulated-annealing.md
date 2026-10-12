---
title: 模拟退火求函数极值
description: 一维模拟退火模板，用固定随机种子求函数最大值，迭代 O(迭代次数)
category: 模拟退火
tags: [模拟退火, 随机化, 爬山, 极值]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
typedef double db;
const db INF = 1e18;
mt19937_64 rng(20261010);                 // 固定种子，结果可复现

db f(db x) { return x * sin(x) + cos(x); }

db rnd() { return (db)(rng() % 1000000000) / 1e9; }            // [0,1)
db rnd(db l, db r) { return l + rnd() * (r - l); }             // [l,r)

// 模拟退火：在 [L, R] 上找 f 的最大值
db sa(db L, db R) {
    db cur = rnd(L, R), best = cur;
    for (db T = 100; T > 1e-8; T *= 0.98) {                    // 初温、降温系数
        db nxt = cur + rnd(-1, 1) * T;                          // 邻域随温度收缩
        if (nxt < L || nxt > R) continue;
        db d = f(nxt) - f(cur);
        if (d > 0 || rnd() < exp(d / T)) {                      // 更优直接接受，更差按概率接受
            cur = nxt;
            if (f(cur) > f(best)) best = cur;
        }
    }
    return best;
}

signed main() {
    db x = sa(0, 12);
    cout << fixed << setprecision(6) << "x=" << x << " f=" << f(x) << "\n";
    return 0;
}
```

## 说明

- 复杂度：O(迭代次数) 次函数求值，和值域无关；一维示例约 2000 次，二维/高维每次邻域都要重算。
- 三个关键参数：初温 `T`、降温系数（一般 0.95~0.99）、终止温度。降温太慢会 TLE，太快会提前收敛到局部最优。经验做法是把初温设成「能让劣解接受概率约 0.5」的量级。
- 接受准则 `exp(d / T)`：`d` 是劣化量，必须取负值。写成 `exp(-|d|/T)` 更保险；`d/T` 过小（< -700）时 `exp` 下溢成 0，属正常行为。
- 邻域步长要随 T 收缩（`rnd(-1,1)*T`）。固定步长会一直在最优解附近抖，步长过小则前期挪不动。多维时对每一维分别扰动。
- 必须**多跑几次取最优**（`for (int k = 0; k < 20; k++) ans = max(ans, sa(...))`），单次结果不稳定，这也是模拟退火最容易丢分的地方。
- 固定种子 `mt19937_64 rng(20261010)` 保证调试/对拍结果可复现；正式提交若怕被卡，可改成 `random_device` 或时间种子。
- 与三分取舍：能用三分/二分（严格单峰）就别退火，退火精度和常数都更差；退火只用于多峰、无解析梯度、或状态空间离散的问题。

## 典型应用

- 洛谷 P1337 [JSOI2004] 平衡点 / 吊打XXX（模拟退火经典模板题）
- 洛谷 P3878 [TJOI2010] 分金币（离散状态交换扰动，退火找最小差）
- 洛谷 P2503 [HAOI2006] 均分数据（退火或随机化贪心 + DP 判定）

---
title: 区间调度与反悔贪心
description: 按右端点排序求最多不重叠区间，以及小根堆实现的反悔贪心，复杂度均为 O(n log n)
category: 贪心
tags: [贪心, 区间调度, 反悔贪心, 优先队列]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N = 1e5 + 5;
int n;
pair<int,int> seg[N];  // (右端点, 左端点)

// 最多不重叠区间：按右端点排序，能放就放
int sol1() {
    sort(seg + 1, seg + n + 1);
    int cnt = 0, last = -1e18;
    for (int i = 1; i <= n; i++)
        if (seg[i].second >= last) cnt++, last = seg[i].first;
    return cnt;
}

// 反悔贪心：n 个任务，第 i 个截止时刻 d[i]、收益 p[i]，每个单位时间最多做一个
// 按截止时刻排序，先全收，堆里最小的收益一旦超出容量就丢掉
int sol2(vector<pair<int,int>> job) {
    sort(job.begin(), job.end());
    priority_queue<int, vector<int>, greater<int>> q;  // 小根堆存已选收益
    int sum = 0;
    for (auto &[d, p] : job) {
        q.push(p); sum += p;
        if ((int)q.size() > d) sum -= q.top(), q.pop();
    }
    return sum;
}

signed main() {
    n = 4;
    seg[1] = {3, 1}; seg[2] = {5, 2}; seg[3] = {4, 3}; seg[4] = {7, 5};
    cout << "最多不重叠区间: " << sol1() << "\n";
    vector<pair<int,int>> job = {{1, 3}, {1, 5}, {2, 4}, {2, 6}};
    cout << "反悔贪心最大收益: " << sol2(job) << "\n";
    return 0;
}
```

## 说明

- 复杂度：区间调度排序 O(n log n) + 扫描 O(n)；反悔贪心 O(n log n)，堆中元素不超过 n 个。
- 区间调度必须按**右端点**排序（选结束最早的）；按左端点排序是反例做法，只能拿到近似解。
- 判重叠用 `l >= last`（端点相接算不重叠）；若要严格不接触改成 `l > last`。`last` 要初始化成极小值，别用 0。
- 反悔贪心的核心是「先贪心接下，撑不下就把贡献最小的扔掉」。堆里存收益而不是任务编号，丢掉即撤销。
- 与 DP 取舍：区间带权（加权区间调度）时贪心失效，要按右端点排序后树状数组/二分优化 DP；反悔贪心只适用于每个单位时间容量为 1 的带截止时间问题。
- 全程用 long long，收益求和与 `last` 都可能溢出 int。

## 典型应用

- 洛谷 P1803 凌乱的yyy / 线段覆盖（按右端点排序选最多不重叠区间）
- 洛谷 P2949 [USACO09OPEN] Work Scheduling G（带截止时间的反悔贪心）
- 洛谷 P4053 [JSOI2007] 建筑抢修（反悔贪心：超时后扔掉耗时最长的）

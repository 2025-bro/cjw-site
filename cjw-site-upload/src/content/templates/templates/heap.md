---
title: 堆与优先队列（含对顶堆求中位数）
description: priority_queue 的三种写法与对顶堆动态维护中位数，插入 O(log n)、取中位数 O(1)
category: 堆与优先队列
tags: [优先队列, 对顶堆, 中位数]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

priority_queue<int> pqmax;                                    // 默认大根堆
priority_queue<int, vector<int>, greater<int>> pqmin;         // 小根堆
struct Node {                                                 // 结构体：w 小的先出队
    int w, id;
    bool operator<(const Node& o) const { return w > o.w; }   // 注意这里方向是反的
};
priority_queue<Node> pqn;
// pair<int,int> 默认先比 first 再比 second，都是大的优先

priority_queue<int> lo;                                       // 较小的一半（大根堆）
priority_queue<int, vector<int>, greater<int>> hi;             // 较大的一半（小根堆）

void ins(int x) {
    if (lo.empty() || x <= lo.top()) lo.push(x);
    else hi.push(x);
    if (lo.size() > hi.size() + 1) hi.push(lo.top()), lo.pop();
    if (hi.size() > lo.size()) lo.push(hi.top()), hi.pop();
}

int ask() { return lo.top(); }   // 奇数个取中间，偶数个取较小中间

int main() {
    for (int x : {5, 1, 9, 3, 7}) ins(x), cout << ask() << ' ';   // 5 1 5 3 3
    cout << '\n';
    pqmin.push(3), pqmin.push(1), pqn.push({4, 1}), pqn.push({2, 2});
    cout << pqmin.top() << ' ' << pqn.top().w << '\n';            // 1 2
    return 0;
}
```

## 说明

- `priority_queue` 默认是大根堆，小根堆要么写 `greater<int>`，要么把数取负压进去、拿出来再取负（后者常数更小）。
- 结构体的 `operator<` 要"反着写"：优先队列按 `<` 取最大值作为堆顶，所以想按 w 最小值出队就得写 `w > o.w`。
- 对顶堆：`lo` 存较小一半、`hi` 存较大一半，两堆大小差不超过 1，插入 O(log n)，取中位数 O(1)。
- 偶数个元素时中位数有两种取法；要平均值就 `(lo.top()+hi.top())/2.0`，注意别用整数除法。
- `priority_queue` 不支持删除任意元素，需要删除就用懒删除（再开一个"待删堆"）或直接换 `multiset`。
- 既要取最值又要频繁删任意元素、查前驱后继时，用 FHQ Treap 更合适。

## 典型应用

- 洛谷 P3378【模板】堆（插入、取最小、删除最小）；
- 洛谷 P1168 中位数（对顶堆经典题）；
- 洛谷 P1090 [NOIP2004 提高组] 合并果子（贪心 + 小根堆）。

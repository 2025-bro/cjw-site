---
title: 随机化技巧合集
description: 随机化快速排序、随机洗牌与随机化哈希底数，期望复杂度 O(n log n) / O(n)
category: 随机化
tags: [随机化, 快排, 洗牌, 哈希]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef unsigned long long ull;
const int N = 1e5 + 5;
const ll MOD = (1LL << 61) - 1;              // 梅森素数，乘法用 __int128 防溢出
const ull BASE = chrono::steady_clock::now().time_since_epoch().count() % 1000000 + 131;

mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());

// 随机化快排：Hoare 划分 + 随机基准，严格弱序对重复元素也正确
void qs(vector<int> &a, int l, int r) {
    if (l >= r) return;
    int p = a[l + rng() % (r - l + 1)];      // 随机选基准值
    int i = l, j = r;
    while (i <= j) {
        while (a[i] < p) i++;
        while (a[j] > p) j--;
        if (i <= j) swap(a[i++], a[j--]);
    }
    qs(a, l, j); qs(a, i, r);
}

// Fisher-Yates 洗牌，O(n)，每种排列等概率
void shuf(vector<int> &a) {
    for (int i = a.size() - 1; i > 0; i--) swap(a[i], a[rng() % (i + 1)]);
}

// 随机化哈希底数：mod 2^64 自然溢出，冲突概率可忽略
ull hsh(const string &s) {
    ull h = 0;
    for (char c : s) h = h * BASE + c;
    return h;
}

int main() {
    vector<int> a = {5, 2, 9, 2, 7, 1, 9, 3, 2, 8};
    qs(a, 0, a.size() - 1);
    for (int i = 0; i < (int)a.size(); i++) cout << a[i] << " \n"[i + 1 == (int)a.size()];
    vector<int> p = {1, 2, 3, 4, 5, 6, 7, 8};
    shuf(p);
    for (int i = 0; i < (int)p.size(); i++) cout << p[i] << " \n"[i + 1 == (int)p.size()];
    cout << hex << hsh("abc") << "\n" << hsh("acb") << "\n";
    return 0;
}
```

## 说明

- 复杂度：随机化快排期望 O(n log n)、最坏 O(n²)（概率极低）；洗牌严格 O(n)；哈希 O(|s|)。
- 快排被卡是因为固定取 `a[l]` 作基准，全相等或已排序的构造数据会退化成 O(n²)。取随机下标后任何输入都不再针对你，但**算法本身没变**，不能宣称 O(n log n) 最坏。
- 随机化快排用「值」而不是「下标」作基准（`p = a[rand]`），配合 `while (a[i] < p) / while (a[j] > p)` 的 Hoare 划分才能正确处理大量重复元素；用 `partition` 三路划分更稳。
- 洗牌必须从后往前 `swap(a[i], a[rng() % (i+1)])`（Fisher-Yates）；写成 `swap(a[i], a[rng() % n])` 得到的分布不均匀。
- 哈希底数随机化是为了防出题人构造冲突。`MOD = 2^61-1` 时乘法要 `__int128` 或改用双模数；直接用 ull 自然溢出更省事但可被定向攻击。
- `mt19937_64` 比 `rand()` 好：值域 64 位、周期 2^19937-1。`rand()` 在 Windows 上只有 15 位且周期仅 2^31，随机化题会 WA。
- 需要可复现结果（对拍、调试）时把种子写死成常数，例如 `mt19937_64 rng(20261010);`。

## 典型应用

- 洛谷 P1177 【模板】快速排序（随机基准可过掉卡普通快排的数据）
- 洛谷 P3370 【模板】字符串哈希（随机底数 + 自然溢出降低冲突）
- 洛谷 P1224 [NOI2013] 向量内积 / 洛谷 P3792 由乃与大母神原型和偶像崇拜（随机化哈希判定）

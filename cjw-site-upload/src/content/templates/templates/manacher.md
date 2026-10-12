---
title: Manacher 最长回文子串
description: O(n) 求出每个中心的最长回文半径，得到最长回文子串长度
category: Manacher
tags: [字符串, 回文, 回文半径]
author: 通用
date: 2026-10-10
---

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e7 + 5;
int p[N];                                 // 插入 # 后的回文半径

// 返回 t 的最长回文子串长度，t 只含小写字母
int manacher(const string& t) {
    string s = "^#";
    for (char c : t) { s += c; s += '#'; }
    s += '$';
    int n = (int)s.size(), mid = 0, rb = 0, ans = 0;
    for (int i = 1; i < n - 1; ++i) {
        p[i] = (i <= rb) ? min(rb - i + 1, p[2 * mid - i]) : 1;   // 对称点 2*mid-i
        while (s[i - p[i]] == s[i + p[i]]) ++p[i];
        if (i + p[i] - 1 > rb) mid = i, rb = i + p[i] - 1;
        ans = max(ans, p[i] - 1);          // 原串回文长度恰为 p[i]-1
    }
    return ans;
}

int main() {
    cout << manacher("abacaba") << '\n';   // 7 "abacaba"
    cout << manacher("abacabad") << '\n';  // 7 "abacaba"
    cout << manacher("aaaa") << '\n';      // 4
    return 0;
}
```

## 说明

- 相邻字符间插入 `'#'`、首尾加 `'^'` 和 `'$'` 哨兵后，奇偶长度回文统一成「以某位置为中心」，不必分类讨论。
- `p[i]` 是中心 `i` 的回文半径（含中心），原串中对应回文长度恰为 `p[i] - 1`。
- 盒子 `[mid, rb]` 内先取 `min(rb - i + 1, p[2*mid - i])`：镜像点半径超出盒子右界的部分必须留给暴力扩展，`'^'`/`'$'` 两个不同哨兵保证 `while` 不用判边界也不会越界。
- 严格 `O(n)`：`rb` 单调不减，暴力扩展的总次数为 `O(n)`；回文树 / 哈希二分是 `O(n log n)`。
- 需要输出具体子串时记录最优中心与半径再截取，(中心 - 半径)/2 换算回原串下标。

## 典型应用

- 洛谷 P3805【模板】Manacher（输出最长回文子串长度）；
- 洛谷 P4555 [国家集训队] 最长双回文串；
- 洛谷 P1659 [国家集训队] 拉拉队排练（回文串计数）。

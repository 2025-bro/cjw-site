---
title: Back and Forth Distance
platform: atcoder
problemId: abc479-D
problemUrl: https://atcoder.jp/contests/abc479/tasks/abc479_d
difficulty: 简单
tags: [模拟]
author: CJW
date: 2026-10-12
---

## 题意简述

有 N 个方格排成一行，从左到右编号为 1, 2, …, N。

当你在方格 i 上时，可以进行以下移动之一。

选择一个满足 1 ≤ j < i 的整数 j，并移动到方格 j。此移动的代价为 Lᵢ。

选择一个满足 i < j ≤ N 的整数 j，并移动到方格 j。此移动的代价为 Rᵢ。

给定 Q 个查询。请回答每一个查询。每个查询的格式如下。

给定整数 s 和 t。求从方格 s 出发，通过反复移动到达方格 t 所需的最小总代价。

约束条件
2 ≤ N ≤ 3 × 10⁵
1 ≤ Q ≤ 3 × 10⁵
1 ≤ Lᵢ ≤ 10⁹（2 ≤ i ≤ N）
1 ≤ Rᵢ ≤ 10⁹（1 ≤ i ≤ N−1）
每个查询满足 1 ≤ s, t ≤ N。
每个查询满足 s ≠ t。
所有输入值均为整数。

## 思路

s如果要到t，一种路径是直接到达，代价为l[s]或r[s]，但是显然有可以通过中转节点来实现更小的代价，如果s<t，那么中转一定在s左边，因为在右边不如直接到t，同理s>t亦是如此。本题每个查询都o(n)遍历找中转显然TLE,因此可以维护一个数组。观察可以发现，s<t时，s->i->t只需找到在s左边拥有最小r值的i，不用关心具体节点。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
static const long long MOD = 998244353;
const int N = 25;

void sol() {
    int n,q;cin>>n>>q;
    vector<int> l(n+1);
    vector<int> r(n+1);
    for(int i=2;i<=n;i++) cin>>l[i];
    for(int i=1;i<n;i++) cin>>r[i];
    vector<int> a=l,b=r;
    for(int i=n-1;i>=1;i--) a[i]=min(a[i],a[i+1]);
    for(int i=2;i<n;i++) b[i]=min(b[i],b[i-1]);
    while(q--){
        int ans;
        int s,t;cin>>s>>t;
        if(s<t){
            ans=r[s];
            if(s>1)ans=min(ans,l[s]+b[s-1]);
        }else{
            ans=l[s];
            if(s<n)ans=min(ans,r[s]+a[s+1]);
        }
        cout<<ans<<endl;
    }
}

signed main(){
    int T=1;
    //cin>>T;
    while(T--){
        sol();
    }
    return 0;
}
```

## 小结

- 观察出可以中转实现更小代价很简单，但是后续优化更为重要！

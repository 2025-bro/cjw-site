---
title: 切割木材
platform: 洛谷
problemId: P16227
problemUrl: https://www.luogu.com.cn/problem/P16227
difficulty: 普及
tags: [二分，模拟]
author: CJW
date: 2026-10-09
---

## 题意简述

角落里，一台老旧的自动分装机正发出沉闷的轰鸣声。

小蓝站在流水线旁，准备将一批木材送入分装机。机器的挡板间距 $L$ 是唯一可调参数，任何长度超过 $L$ 的木段都会导致传送带卡死。显然，挡板间距越小，单位时间内的输送密度就越高。因此，小蓝希望将这个挡板间距 $L$ 设定得尽可能小。

眼前有 $N$ 根原始木材，第 $i$ 根的长度为 $A_i$。小蓝可以对这些木材进行切割以满足长度要求，但由于锯片磨损，他全程最多只能进行 $K$ 次切割。具体的切割规则如下：

1. 每次切割可以将一根木材切割为两段。
2. 分割后，新产生的两段木材的长度必须为正整数，且长度之和等于原木材的长度。

现在，请你为小蓝找出这个最小可行的挡板间距 $L$，使得在总切割次数不超过 $K$ 的前提下，切割后所有木段的最大长度不超过 $L$。

## 思路

简单的二分，计算在每个mid下所需的次数是否小于等于k,如果可以那就是有更小的长度。


## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
const int N=1e6+10;
//int a[N];
int n,k;
bool check(int x,vector<int> &a){
    int cnt=0;
    for(int i=0;i<n;i++){
        if(a[i]%x==0) cnt+=a[i]/x-1;
        else 
            cnt+=a[i]/x;
    }
    return cnt<=k;
}

void sol() {
    cin>>n>>k;
    vector<int> a(n);
    int maxx=-1;
    for(int i=0;i<n;i++){
        cin>>a[i];
        maxx=max(maxx,a[i]);
    }
    int l=0,r=maxx;
    while(l<r){
        int mid=l+(r-l)/2;
        if(check(mid,a)){
            r=mid;
        }else{
            l=mid+1;
        }
    }
    cout<<r<<endl;
}

signed main(){
    int t=1;
    //cin>>t;
    while(t--){
        sol();
    }
    return 0;
}
```

## 小结



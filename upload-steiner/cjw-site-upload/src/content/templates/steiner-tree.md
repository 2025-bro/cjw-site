---
title: 最小斯坦纳树（状压 DP + 最短路）
description: 给定 k 个关键点，求包含它们的连通子图最小边权和。dp[v][S] + 子集合并 + 每个 S 跑一次最短路，O(3^k·n + 2^k·(n+m))
category: 图论
tags: [斯坦纳树, 状压DP, SPFA, 图论]
author: CJW
date: 2026-10-18
---

**问题**：无向连通图，给定 `k` 个关键点 `S`，求一个**连通子图**包含所有关键点，使边权和最小。（洛谷 P6192）

`k ≤ 10` 是关键信号：**状压 DP**。

## 代码（洛谷 P6192 已 AC）

```cpp
#include <bits/stdc++.h>
using namespace std;
//#define int long long
#define vec vector
#define all(a) a.begin(),a.end()
namespace IO{

}
const int N = 110;
const int mod = 1e9 + 7;
const int k1=10;
struct edge{
    int v,ne,w;
}e[10*N];
//vector<edge> e;
queue<int> q;
int head[N],tot,p[N];
int dp[N][1<<k1];
int n,m,k;
bool vis[N];
void addedge(int u,int v,int w){
    e[++tot]={v,head[u],w};
    head[u]=tot;
}

void spfa(int s){
    for(int i=1;i<=n;i++){
        if(dp[i][s]<0x3f3f3f3f){
            q.push(i);
            vis[i]=1;
        }
    }
    while(!q.empty()){
        int f=q.front();
        q.pop();
        vis[f]=0;
        //if(vis[f]) continue;
        for(int i=head[f];i;i=e[i].ne){
            int t=e[i].v;
            if(dp[t][s]>dp[f][s]+e[i].w){
                dp[t][s]=dp[f][s]+e[i].w;
                if(!vis[t]){
                vis[t]=1;
                q.push(t);
            }
            }
        }
    }
}

void sol(){
    memset(dp,0x3f,sizeof(dp));
    memset(head,0,sizeof(head));
    tot=0;

    cin>>n>>m>>k;
    for(int i=1;i<=m;i++){
        int u,v,w;cin>>u>>v>>w;
        addedge(u,v,w);
        addedge(v,u,w);
    }
    for(int i=1;i<=k;i++){
        cin>>p[i];
        dp[p[i]][1<<(i-1)]=0;
    }
    int mask=(1<<k)-1;
    for(int s1=1;s1<=mask;s1++){
        for(int i=1;i<=n;i++){
            for(int s2=s1&(s1-1);s2;s2=s1&(s2-1)){
                dp[i][s1]=min(dp[i][s1],dp[i][s2]+dp[i][s1^s2]);
            }
        }
        spfa(s1);
    }
    cout<<dp[p[1]][mask]<<endl;
    //flush();
}

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
    //pre();
    int t=1;
    //cin>>t;
    while(t--){sol();}
    
    return 0;
}
```

## 状态与两个转移

**状态**：`dp[v][S]` = 以 `v` 为根、覆盖关键点集合 `S` 的**连通子图**的最小边权和。

**转移一（在同一个根上合并两个子集）**

```cpp
for (int s2 = s1 & (s1 - 1); s2; s2 = s1 & (s2 - 1))
    dp[i][s1] = min(dp[i][s1], dp[i][s2] + dp[i][s1 ^ s2]);
```

含义：以 `i` 为根的两棵树，一棵覆盖 `s2`、另一棵覆盖 `s1^s2`，把它们在 `i` 处拼起来。`s2` 枚举的是 `s1` 的**真子集**（枚举技巧见下方易错点）。

**转移二（在图上走边，即「换根」）**

固定 `S`，把所有 `dp[i][S] < INF` 的 `i` 作为多源起点，跑一次最短路松弛：

```cpp
if (dp[t][s] > dp[f][s] + e[i].w)
    dp[t][s] = dp[f][s] + e[i].w;
```

这就是把「根从 `f` 挪到相邻点 `t`」的代价。边权为正，用 SPFA 或 Dijkstra 都行。

**顺序不能乱**：外层按 `S` 从小到大枚举 → 先做子集合并 → 再跑最短路。
因为合并要用的 `s2`、`s1^s2` 都严格小于 `s1`，必须已经算好。

**答案为什么是 `dp[p[1]][mask]`**：
最优斯坦纳树一定包含 `p[1]`（它本身是关键点），所以以 `p[1]` 为根得到的 `dp[p[1]][mask]` 就是最优值。写成 `min(dp[i][mask] for i in 1..n)` 也对，两者相等。

## 数组 / 变量解释

| 名字 | 大小 | 含义 | 坑 |
| --- | --- | --- | --- |
| `dp[N][1<<k1]` | `n × 2^k` | `dp[v][S]`，`N=110`、`k1=10` | `k` 变了要同步改 `k1` |
| `head[N]` | `n + 5` | 邻接表头，0 表示空 | 弧编号从 1 起 |
| `e[10*N]` | `2m` 条弧 | `v` 终点、`ne` 下一条、`w` 边权 | `m ≤ 500` 时 `2m = 1000 ≤ 1100` 刚好够，**再大就要改** |
| `tot` | — | 弧编号计数 | 从 0 开始、`++tot` 后用 |
| `p[N]` | `k + 5` | 第 `i` 个关键点是哪个点 | 下标从 1 开始 |
| `mask` | — | `(1<<k)-1`，全集 | |
| `vis[N]` | `n + 5` | **「在不在队列里」**，不是「访问过」 | 见下方易混点 |
| `q` | — | SPFA 队列 | 每次 `spfa` 前必须是空的（代码里出队到空才结束） |

## 复杂度

- 子集合并：`O(3^k · n)`（每个 `S` 枚举子集是 `3^k` 量级）
- 最短路：每个 `S` 一次，SPFA 平均 `O(n + m)`，最坏 `O(nm)`；换 Dijkstra 稳定 `O((n+m) log n)`
- `k ≤ 10`、`n ≤ 100`、`m ≤ 500` 时完全够用

## 易错点 / 易混点

| 问题 | 错法 | 对法 | 后果 |
| --- | --- | --- | --- |
| `vis` 的语义 | 当成「已访问」，`if(vis[f]) continue;` | 它是**在队标记**：出队置 0、入队置 1 | SPFA 漏松弛，答案偏大 |
| 枚举子集 | `for(s2=1;s2<s1;s2++)` | `for(s2=s1&(s1-1); s2; s2=s1&(s2-1))` | 复杂度退化成 `4^k`，或枚举到不存在的位 |
| 合并与最短路的顺序 | 先 SPFA 再合并 | 先合并、再 SPFA | 用到未更新的值，答案错 |
| 入队范围 | 只把关键点入队 | 所有 `dp[i][s] < INF` 的点都入队 | 根不在关键点上时漏解 |
| 集合合并方向 | `dp[i][s2] + dp[i][s1]` | `dp[i][s2] + dp[i][s1^s2]` | 重复计算或死循环 |
| 初始化 | `dp` 全 0 | `dp` 全 INF，只把关键点的单点集设 0 | 全输出 0 |
| `e` 开太小 | 按 `m` 开 | 按 `2m` 开（无向边两条弧） | 越界（本题 `10*N` 刚好够） |
| 自环 / 重边 | 特判 | 不用管，正权下不会更优 | — |
| 输出位置 | `cout << dp[1][mask]` | `dp[p[1]][mask]`（或对全部点取 min） | 1 号点不是关键点时答案偏大 |

## 容易有理解误差的地方

1. **「以 `v` 为根」是什么意思**
   DP 里的树是抽象的连通子图，`v` 只是**指定的一个包含点在子图里的锚点**，用来做换根转移。不是真实的树根。

2. **为什么合并只在同一个点上做**
   两棵都含 `i` 的子树拼起来仍然连通（公共点 `i`），边权和直接相加，不产生额外边——这是状态设计成立的关键。

3. **为什么每个 `S` 都要跑一遍最短路**
   合并只解决了「`i` 为根的子树怎么拼」，但最优根不一定在关键点上，可能要在图上走一段。跑最短路就是把 `dp[·][S]` 沿边传播成「以任意点为根的最小值」。

4. **`dp[i][s] < 0x3f3f3f3f` 这个判断**
   既排除了 INF，也顺便说明「这个点对 `S` 还没有可行方案」。所以入队范围天然正确。

5. **答案取 `p[1]` 不代表根必须是 `p[1]`**
   因为最优树必然经过 `p[1]`，以它为锚点算出来的值就等于全局最优；写成 `min` 只是更保险。

## 代码可以更清楚的地方（可选整理）

原代码能 AC，但这几处读起来容易分心：

```cpp
// 1) 清掉空命名空间、没用到的宏与变量
// #define vec / #define all / namespace IO{} / const int mod
//    —— 全都没用上，留着只会让人以为有隐藏逻辑

// 2) vis → inQ：名字直接说明它是「在队列里」
bool inQ[N];

// 3) SPFA 里的缩进对齐
if (!inQ[t]) { inQ[t] = 1; q.push(t); }

// 4) 想要更稳就把 SPFA 换成 Dijkstra（正权图），复杂度稳定
//    priority_queue<pair<int,int>, vector<...>, greater<...>>
```

## 例题

- [洛谷 P6192【模板】最小斯坦纳树](https://www.luogu.com.cn/problem/P6192) — 本题
- 关键点很少（`k ≤ 10`）、又要求「把所有点连起来且代价最小」→ 基本都是这个套路

## 延伸

- **斯坦纳森林**：若允许分成若干棵互不相连的树（每组内部连通），在合并阶段再加一层「子集划分」DP。
- **状态压缩 DP 常见套路**：`k ≤ 20` 且要求「覆盖/连通/选点集」时，先想 `dp[mask]` 或 `dp[v][mask]`；
  `dp[v][mask]` + 图上松弛就是斯坦纳树，`dp[mask]` + 子集枚举就是普通状压 DP。

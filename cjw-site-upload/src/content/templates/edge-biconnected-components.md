---
title: 边双连通分量（Tarjan 求桥 + 删桥染色）
description: 无向图求桥（low[v] > dfn[u]）后删桥 DFS 染色求边双连通分量，O(n+m)，附交互动画（点击原地展开）
category: 图论
tags: [边双连通分量, 桥, Tarjan, 图论]
author: CJW
date: 2026-10-18
---

**定义**：删掉一条边后图不再连通，这条边就是**桥**；图中不含桥的极大连通块称为**边双连通分量（EBCC）**。
等价说法：分量内任意两点之间存在**两条边不相交**的路径。

求法两步：**Tarjan 求桥 → 删掉所有桥后 DFS 染色**，复杂度 **O(n + m)**。

## 代码（洛谷 P8436 已 AC）

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = (int)5e5 + 5;
const int M = (int)2e6 + 5;

struct edge{
    int to,ne;
}e[M<<1];
int n,m;
int he[N],tot=1;
void add(int u,int v){
    e[++tot].to=v;
    e[tot].ne=he[u];
    he[u]=tot;
}

int b[M<<1];
int dfn[N],low[N],timer;
int vis[N];
vector<vector<int>> ans;

void tarjan(int u,int f){
    dfn[u]=low[u]=++timer;
    for(int i=he[u];i;i=e[i].ne){
        int v=e[i].to;
        if(!dfn[v]){
            tarjan(v,i);
            if(low[v]>dfn[u]) b[i]=b[i^1]=true;
            low[u]=min(low[u],low[v]);
        }else if(i!=(f^1)){
            low[u]=min(low[u],dfn[v]);
        }
    }
}

void dfs(int u,int p){
    vis[u]=p,ans[p-1].push_back(u);
    for(int i=he[u];i;i=e[i].ne){
        int v=e[i].to;
        if(vis[v]||b[i]) continue;
        dfs(v,p);
    }
}

int main() {
  ios::sync_with_stdio(false), cin.tie(nullptr);
  cin>>n>>m;
  for(int i=0;i<m;i++) {
    int u,v;cin>>u>>v;
    if(u==v) continue;
    add(u,v);
    add(v,u);
  }

  for(int i=1;i<=n;i++) if(!dfn[i]) tarjan(i,0);

  //ans.push_back(vector<int>());
  int id=0;
  for(int i=1;i<=n;i++){
    if(!vis[i]){
        ans.push_back(vector<int>());
        dfs(i,++id);
    }
  }
  cout<<id<<endl;
  for(int i=0;i<id;i++){
    cout<<ans[i].size()<<" ";
    for(int j=0;j<ans[i].size();j++){
        cout<<ans[i][j]<<" ";
    }
    cout<<endl;
  }

  return 0;
}
```

## 要点

1. **按「边编号」判父边**：`i != (f ^ 1)`。因为存的是双向边（编号 `2k` 与 `2k+1` 互为反向），所以父边可以用异或直接找到。**按「点」判父边会在重边上出错**。
2. **桥的判定**：`low[v] > dfn[u]`。严格大于——等于说明 `v` 能回到 `u`，这条边在环上，不是桥。
3. **自环**：`if (u == v) continue;` 直接丢掉，自环不影响连通性。
4. **染色**：Tarjan 之后**不需要缩点建新图**，直接在原图上 DFS，遇到 `b[i]` 为真的边就跳过，走到的整块就是一个 EBCC。
5. **双向边存两次**：`tot` 从 1 开始、`++tot` 先加后用，所以第 `k` 条无向边的两条弧是 `2k` 和 `2k+1`，`i ^ 1` 就是它的反向弧。

### 动画：一步一步看桥是怎么被找出来、分量是怎么被染出来的

<details style="margin:16px 0;border:1px solid var(--border);border-radius:12px;background:var(--surface);overflow:hidden">
<summary style="cursor:pointer;padding:10px 14px;font-weight:600;color:var(--accent);background:var(--surface-2)">▶ 点击展开动画：Tarjan 求桥 + 删桥染色</summary>
<div style="height:min(70vh,660px);padding:8px">
<iframe src="/media/scc/ebcc.html" title="边双连通分量动画" loading="lazy" style="width:100%;height:100%;border:0;border-radius:8px;background:#0d1526;display:block"></iframe>
</div>
</details>
<p style="margin:6px 0 0;font-size:13px"><a href="/media/scc/ebcc.html" target="_blank" rel="noopener">在新标签打开（更大视野）↗</a></p>

动画里的图：`1-2-3` 为一个环、`4-5-6` 为另一个环、`3-4` 与 `6-7` 是两座桥，最终得到 `{1,2,3}`、`{4,5,6}`、`{7}` 三个分量。

## 易错点

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 按点判父边（`v != fa`） | **重边被当成父边**，桥漏判 | 按边编号：`i != (f ^ 1)` |
| 桥判定写成 `low[v] >= dfn[u]` | 把环上的边误判成桥 | 必须严格 `>` |
| 只开 `M` 条弧 | 无向图要存 `2m` 条弧 → 越界 | 数组按 `2m` 开（`M<<1`） |
| 递归深度 | `n = 5e5` 的长链会**爆栈** | 加编译参数 `-Wl,--stack=67108864`，或改手写栈迭代 |
| 输出顺序 | 误以为要按编号排序 | 题目说明**任意顺序**，不用排序 |

## 复杂度

- 时间：O(n + m)（Tarjan 一遍 + 染色一遍）
- 空间：O(n + m)（`2m` 条弧 + 桥标记）

## 例题

- [洛谷 P8436【模板】边双连通分量](https://www.luogu.com.cn/problem/P8436) — 本题
- [洛谷 P1656 炸铁路](https://www.luogu.com.cn/problem/P1656) — 只求桥的经典题，可以用同一份 `tarjan` 直接过

## 延伸

- **割点 / 点双连通分量**：把「删边不连通」换成「删点不连通」，判定式变成 `low[v] >= dfn[u]`（注意是 `>=`，和桥正好相反）；割点是点双连通分量的分界点。
- **边双 vs 点双**：边双缩点后是**树**，点双缩点后是**圆方树**——两者在 1800 档的题目里经常一起出现。

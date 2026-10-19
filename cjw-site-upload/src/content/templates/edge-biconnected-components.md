---
title: 边双连通分量（Tarjan 求桥 + 删桥染色）
description: 无向图求桥（low[v] > dfn[u]）后删桥 DFS 染色求边双连通分量，O(n+m)；含数组逐项解释、输出桥的两种写法、易错/易混清单与交互动画
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

## 数组逐个解释

| 数组 / 变量 | 开多大 | 含义 | 容易踩的坑 |
| --- | --- | --- | --- |
| `he[N]` | `n + 5` | 邻接表头指针（存第一条弧的编号） | **用 0 表示「没有」**，所以弧编号必须从 1 开始 |
| `e[M<<1]` | `2m` 条弧 | `to` = 终点，`ne` = 同起点的下一条弧 | 无向边要存**两条**弧；`tot` 必须按 `2m` 算 |
| `tot` | — | 已分配的弧编号，初值 1、先 `++` 再用 | 第 `k` 条无向边的两条弧正好是 `2k` 与 `2k+1`，**互为 `i^1`** |
| `b[M<<1]` | `2m` | 这条**弧**是不是桥 | 两条弧都要标 `true`，否则染色阶段漏跳 |
| `dfn[N]` | `n + 5` | DFS 时间戳，同时兼作「是否访问过」 | `if(!dfn[v])` 就是在判「没访问过」 |
| `low[N]` | `n + 5` | 从这个子树能回溯到的**最小 dfn** | 判桥 `low[v] > dfn[u]`、判割点 `low[v] >= dfn[u]`，符号不同 |
| `timer` | — | 时间戳计数器 | 别起名 `time`（和库函数冲突） |
| `vis[N]` | `n + 5` | **染色阶段**用：存**分量编号**（0 = 未染色） | 名字像 bool，实际存编号；不要写成 `vis[u] = 1` |
| `ans` | 动态 | `ans[c-1]` 存第 `c` 个分量的所有点 | **下标差 1**，写成 `ans[p]` 会越界或用错桶 |
| `id` | — | 当前分量数（1 开始） | 和 `tot`（弧编号）、`timer`（时间戳）别混 |

## 输出桥

### 方法 A：判桥时顺手记端点（最省事）

桥一定是在回溯时由**父结点**那侧判出来的：此时你正站在 `u`、处理弧 `i` 指向 `v`，所以桥就是无向边 `{u, v}`。

```cpp
vector<pair<int,int>> br;         // ← 新增：所有桥

if(low[v] > dfn[u]){              // 桥
    b[i] = b[i^1] = true;
    br.push_back({min(u, v), max(u, v)});   // ← 记端点；P1656 要求 u<v
}
```

输出（P1656 的格式：先排序）：

```cpp
sort(br.begin(), br.end());
cout << br.size() << '\n';
for(auto &p : br) cout << p.first << ' ' << p.second << '\n';
```

### 方法 B：按「输入边编号」标记（题目要边号时用）

```cpp
vector<pair<int,int>> E(m + 1);   // E[k] = 第 k 条输入边
int eid[M<<1];                    // 弧 -> 输入边编号
bool b[M + 5];                    // 按「边编号」标记，不是按弧

void add(int u,int v,int k){ e[++tot].to=v; e[tot].ne=he[u]; eid[tot]=k; he[u]=tot; }
// 建图：add(u,v,k), add(v,u,k)
// 判桥：if(low[v] > dfn[u]) b[eid[i]] = true;
// 输出：for(int k=1;k<=m;k++) if(b[k]) cout << E[k].first << ' ' << E[k].second << '\n';
```

### 两个「想当然会写错」的点

1. **每条桥只会被记录一次**：桥一定是 Tarjan 的**树边**，只在父侧判一次，所以方法 A 不需要去重。
2. **不要事后扫弧**：
   ```cpp
   for(int i = 2; i <= tot; i++) if(b[i]) ...;   // ✗ 每条桥输出两次
   ```
   因为一条无向边有 `2k / 2k+1` 两条弧，`b` 两条都标了。要扫就判 `if(i < (i^1))`，或者改用方法 B 按边号标记。

## 要点

1. **按「边编号」判父边**：`i != (f ^ 1)`。存的是双向边，`2k` 与 `2k+1` 互为反向，所以父边用异或直接定位。**按「点」判父边会在重边上出错**。
2. **桥的判定**：`low[v] > dfn[u]`，严格大于——等于说明 `v` 能回到 `u`，这条边在环上，不是桥。
3. **自环**：`if (u == v) continue;` 直接丢掉，自环不影响连通性。
4. **染色不用缩点**：Tarjan 结束后直接在原图上 DFS，遇到 `b[i]` 为真就跳过，走到的整块就是一个 EBCC。
5. **`tot` 从 1 起**：既让 0 能当空指针，又让 `i^1` 成对成立。

### 动画：一步一步看桥是怎么被找出来、分量是怎么被染出来的

<details style="margin:16px 0;border:1px solid var(--border);border-radius:12px;background:var(--surface);overflow:hidden">
<summary style="cursor:pointer;padding:10px 14px;font-weight:600;color:var(--accent);background:var(--surface-2)">▶ 点击展开动画：Tarjan 求桥 + 删桥染色</summary>
<div style="height:min(70vh,660px);padding:8px">
<iframe src="/media/scc/ebcc.html" title="边双连通分量动画" loading="lazy" style="width:100%;height:100%;border:0;border-radius:8px;background:#0d1526;display:block"></iframe>
</div>
</details>
<p style="margin:6px 0 0;font-size:13px"><a href="/media/scc/ebcc.html" target="_blank" rel="noopener">在新标签打开（更大视野）↗</a></p>

动画里的图：`1-2-3` 一个环、`4-5-6` 一个环、`3-4` 与 `6-7` 两座桥，最终得到 `{1,2,3}`、`{4,5,6}`、`{7}` 三个分量。

## 易错点 / 易混点

| 问题 | 错误写法 | 正确做法 | 后果 |
| --- | --- | --- | --- |
| 判父边 | `if(v != fa)` 按点判 | `if(i != (f^1))` 按边判 | **重边被当成父边**，桥漏判 |
| 桥判定 | `low[v] >= dfn[u]` | `low[v] > dfn[u]` | 把环边误判成桥 |
| 桥标记 | 只标 `b[i]` | `b[i] = b[i^1] = true` | 染色时反方向没跳过，分量粘连 |
| 数组大小 | `e[M]` / `b[M]` | `e[M<<1]` / `b[M<<1]`（`2m` 条弧） | 越界 RE / 结果随机 |
| 递归深度 | 直接递归 | `-Wl,--stack=67108864` 或手写栈迭代 | `n = 5e5` 长链**爆栈** |
| 连通性 | 只从 1 号点 DFS | 外层 `for(i=1..n) if(!dfn[i])` | 非连通图少算分量 |
| 自环 | 照常建边 | `if(u==v) continue;` | 不影响正确性，但白占内存 |
| `vis` 语义 | 当 bool 用 | 存**分量编号**（1,2,3…） | 染色阶段判重出错 |
| `ans` 下标 | `ans[p].push_back(u)` | `ans[p-1].push_back(u)`（`p` 从 1 起） | 越界或错位 |
| 输出顺序 | 排序分量内点 | 题目说**任意顺序** | 白花时间还容易写错 |

## 容易有理解误差的地方（逐条拆）

1. **`2k` / `2k+1` 怎么来的**
   `tot` 初值 1、`add` 里先 `++tot` 再用，所以第 1 条无向边占用弧 2 和 3，第 2 条占 4 和 5……即第 `k` 条边占 `2k`、`2k+1`。因此 `i^1` 一定是它的反向弧——这就是 `f^1` 能识别父边的根本原因。

2. **`f^1` 里的 `f` 是什么**
   `f` 是**父边对应的那条弧编号**（`tarjan(v, i)` 传下去的是 `i`，也就是 `u → v` 这条弧）。`f^1` 就是它的反向弧 `v → u`。跳过它=不走回头路；但**只跳过这一条弧**，所以重边（另有一对弧）仍然能被访问到。

3. **`low` 为什么用 `dfn[v]` 而不是 `low[v]`**
   遇到已访问的点 `v` 时，`v` 可能在一个还没跑完的分支里，`low[v]` 还没定型；按定义只看「能不能回到 `v` 这个点」，所以用 `dfn[v]`。

4. **`vis` 为什么能兼作「访问标记」**
   因为 `vis[u] = p` 里的 `p ≥ 1`，非 0 即「已访问」；同时 `vis[u]` 又正好记录了分量号，一举两得——但这也让它看起来像 bool，读代码时容易误会。

5. **染色为什么不需要建新图**
   桥已经标好了，只要在 DFS 时跳过桥边，走到的连通块天然就是 EBCC；缩点建图是多余的。

6. **边双 ≠ 点双**
   边双是**删边**不连通（桥），点双是**删点**不连通（割点）。判定式一字符之差：桥 `>`、割点 `>=`。缩点后：边双缩点是**树**，点双缩点是**圆方树**。

## 代码可以更清楚的地方（可选整理）

原代码能 AC，但有两处让人读起来费劲，可以顺手改：

```cpp
// 1) vis → col：名字直接说明它是「颜色/分量号」
int col[N];                                  // 0 = 未染色
void dfs(int u, int c){
    col[u] = c;
    ans.back().push_back(u);                 // 2) 不再需要 p-1，直接用刚 push 的桶
    for(int i = he[u]; i; i = e[i].ne)
        if(!col[e[i].to] && !b[i]) dfs(e[i].to, c);
}
// 调用处：
for(int i = 1; i <= n; i++)
    if(!col[i]) { ans.push_back({}); dfs(i, ++id); }
```

- `vis` 改 `col`：消除「bool 还是编号」的歧义；
- `ans[p-1]` 改 `ans.back()`：消除差 1 的下标风险；
- 删掉注释掉的 `//ans.push_back(...)` 这类死代码。

## 复杂度

- 时间：O(n + m)（Tarjan 一遍 + 染色一遍）
- 空间：O(n + m)。`2m` 条弧：`edge` 8 字节 × 4e6 ≈ 32MB，`b` 4 字节 × 4e6 ≈ 16MB；空间紧张可以把 `b` 换成 `bool`/`char`（省 12MB）。

## 例题

- [洛谷 P8436【模板】边双连通分量](https://www.luogu.com.cn/problem/P8436) — 本题
- [洛谷 P1656 炸铁路](https://www.luogu.com.cn/problem/P1656) — 只求桥，用上面「输出桥 · 方法 A」改几行就能交（记得 `sort` 且 `u<v`）

## 延伸

- **割点 / 点双连通分量**：判定式 `low[v] >= dfn[u]`，注意符号和桥相反；割点把图切成点双连通分量。
- **边双缩点**：把每个 EBCC 缩成一个点后得到的是一棵**树**，树上问题（直径、路径覆盖、边权统计）常在这上面做。

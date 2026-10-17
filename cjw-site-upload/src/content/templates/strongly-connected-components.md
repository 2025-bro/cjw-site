---
title: 强连通分量（Tarjan / Kosaraju）
description: 有向图求 SCC：Tarjan 一次 DFS、Kosaraju 两次 DFS，附交互动画（点击原地展开）与缩点技巧
category: 图论
tags: [SCC, Tarjan, Kosaraju, 缩点]
author: CJW
date: 2026-10-17
---

有向图中「极大的强连通子图」就是强连通分量（SCC）。两种写法都是 **O(n + m)**：Tarjan 一次 DFS、Kosaraju 两次 DFS。下面两段代码都已编译验证（同一张图两种算法结果一致，只是分量编号不同）。

## Tarjan（一次 DFS，最常用）

维护 `dfn`（访问次序）、`low`（能回溯到的最早栈中结点）、栈和 `inStk`。当 `dfn[u] == low[u]` 时，从栈顶弹到 `u`，弹出的一批结点就是一个 SCC。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = (int)1e5 + 5;

vector<int> g[N];
int dfn[N], low[N], timer_, stk[N], top, inStk[N];
int scc[N], sc, sz[N];  // scc[i]: i 所属分量编号；sz[c]: 分量 c 的大小

void tarjan(int u) {
  dfn[u] = low[u] = ++timer_;
  stk[++top] = u, inStk[u] = 1;
  for (int v : g[u]) {
    if (!dfn[v]) {
      tarjan(v);
      low[u] = min(low[u], low[v]);          // 回溯：子树能到的，我都能到
    } else if (inStk[v]) {
      low[u] = min(low[u], dfn[v]);          // 返祖边：只能用 dfn[v]
    }
  }
  if (dfn[u] == low[u]) {                    // u 是这个 SCC 的「根」
    ++sc;
    do {
      ++sz[sc], scc[stk[top]] = sc, inStk[stk[top]] = 0;
    } while (stk[top--] != u);
  }
}

int main() {
  ios::sync_with_stdio(false), cin.tie(nullptr);
  int n, m;
  cin >> n >> m;
  for (int i = 0, u, v; i < m; i++) cin >> u >> v, g[u].push_back(v);
  for (int i = 1; i <= n; i++)
    if (!dfn[i]) tarjan(i);
  cout << sc << '\n';                        // 分量个数
  for (int i = 1; i <= n; i++) cout << scc[i] << " \n"[i == n];
  return 0;
}
```

**要点**
- 只用 `dfn[v]` 更新 `low[u]`（不是 `low[v]`），且必须 `inStk[v]`；
- **分量编号是逆拓扑序**：缩点后从编号大到小就是拓扑序，可以直接拿来递推；
- 递归深度 = 搜索路径长度，`1e5` 的长链会爆栈 → 改成手写栈迭代版，或 `-Wl,--stack=104857600`。

### 动画：Tarjan 逐步执行（点击展开）

<details style="margin:16px 0;border:1px solid var(--border);border-radius:12px;background:var(--surface);overflow:hidden">
<summary style="cursor:pointer;padding:10px 14px;font-weight:600;color:var(--accent);background:var(--surface-2)">▶ 点击展开动画：Tarjan 求 SCC 的完整过程</summary>
<div style="height:min(70vh,660px);padding:8px">
<iframe src="/media/scc/tarjan-scc.html" title="Tarjan 强连通分量动画" loading="lazy" style="width:100%;height:100%;border:0;border-radius:8px;background:#0d1526;display:block"></iframe>
</div>
</details>
<p style="margin:6px 0 0;font-size:13px"><a href="/media/scc/tarjan-scc.html" target="_blank" rel="noopener">在新标签打开（更大视野）↗</a></p>

## Kosaraju（两次 DFS，代码最短）

第一次在原图跑 DFS 记录**后序**；第二次在**反图**上按后序的逆序染色，每进入一次第二次 DFS 就得到一个 SCC。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = (int)1e5 + 5;

vector<int> g[N], rg[N];  // g: 原图；rg: 反图
int vis[N], ord[N], cnt, scc[N], sc, sz[N];

void dfs1(int u) {        // 第一次：原图，记录后序
  vis[u] = 1;
  for (int v : g[u])
    if (!vis[v]) dfs1(v);
  ord[++cnt] = u;
}
void dfs2(int u) {        // 第二次：反图，整棵子树就是一个 SCC
  scc[u] = sc, ++sz[sc];
  for (int v : rg[u])
    if (!scc[v]) dfs2(v);
}

int main() {
  ios::sync_with_stdio(false), cin.tie(nullptr);
  int n, m;
  cin >> n >> m;
  for (int i = 0, u, v; i < m; i++) cin >> u >> v, g[u].push_back(v), rg[v].push_back(u);
  for (int i = 1; i <= n; i++)
    if (!vis[i]) dfs1(i);
  for (int i = cnt; i >= 1; i--)
    if (!scc[ord[i]]) ++sc, dfs2(ord[i]);
  cout << sc << '\n';
  for (int i = 1; i <= n; i++) cout << scc[i] << " \n"[i == n];
  return 0;
}
```

**要点**
- 不需要 `low` 数组，代码最好背；
- 第二次 DFS 用 `scc[u]` 兼作访问标记，不用额外 `vis`；
- 常数比 Tarjan 略大（要存反图、跑两遍）。

### 动画：Kosaraju 逐步执行（点击展开）

<details style="margin:16px 0;border:1px solid var(--border);border-radius:12px;background:var(--surface);overflow:hidden">
<summary style="cursor:pointer;padding:10px 14px;font-weight:600;color:var(--accent);background:var(--surface-2)">▶ 点击展开动画：Kosaraju 两次 DFS 的完整过程</summary>
<div style="height:min(70vh,660px);padding:8px">
<iframe src="/media/scc/kosaraju-scc.html" title="Kosaraju 强连通分量动画" loading="lazy" style="width:100%;height:100%;border:0;border-radius:8px;background:#0d1526;display:block"></iframe>
</div>
</details>
<p style="margin:6px 0 0;font-size:13px"><a href="/media/scc/kosaraju-scc.html" target="_blank" rel="noopener">在新标签打开（更大视野）↗</a></p>

## 怎么选

| | Tarjan | Kosaraju |
| --- | --- | --- |
| 复杂度 | O(n + m) | O(n + m) |
| DFS 次数 | 1 次 | 2 次 |
| 代码量 | 稍多 | **更短** |
| 常数 | **更小** | 略大（要反图） |
| 典型用途 | 缩点、2-SAT、边双连通 | 手写快、教学、怕写错 |

比赛建议：**Tarjan 写熟**（能直接拿到逆拓扑编号）；时间紧或怕写错就用 Kosaraju。

## 缩点（最常见的用法）

```cpp
vector<int> dag[N];
for (int u = 1; u <= n; u++)
  for (int v : g[u])
    if (scc[u] != scc[v]) dag[scc[u]].push_back(scc[v]);  // 可能重复，按需去重
```

缩点后是按分量编号的 DAG，直接在 `dag` 上拓扑 / 递推（最长路、方案数、可达性）。

## 例题

- [洛谷 P3387【模板】缩点](https://www.luogu.com.cn/problem/P3387) — 缩点 + DAG 上最长路
- [洛谷 P2341 受欢迎的牛](https://www.luogu.com.cn/problem/P2341) — 缩点后出度为 0 的分量必须唯一
- [POJ 1236 Network of Schools](http://poj.org/problem?id=1236) — 缩点后统计入度/出度
- [LOJ 10091 受欢迎的牛](https://loj.ac/problem/10091)

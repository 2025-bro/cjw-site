---
title: 高精度（加减乘除 + 取模 + 比较 + 输入输出）
description: 一个 struct 搞定高精度全家桶：+ - * / %、比较、cin/cout 直读直出，小端存储，O(n²) 竖式乘法与长除法
category: 基础算法 / 高精度
tags: [高精度, BigInt, 大数, 基础算法]
author: CJW
date: 2026-10-18
---

`long long` 只能到 1e18 左右（19 位），再大就要手写高精度。下面这个 `Big` 把**加减乘除、取模、比较、输入输出**全包了，读到就能直接用：

```cpp
Big a,b;
cin>>a>>b;            // 直接 cin 读入
cout<<a+b<<endl;      // 直接 cout，运算符全部重载好
```

## 代码（可直接编译，末尾 main 是用法示例）

```cpp
// 高精度全家桶（非负）：加减乘除、取模、比较、输入输出
// 用法：Big a,b; cin>>a>>b; cout<<a+b<<endl;
#include <bits/stdc++.h>
using namespace std;
#define int long long

struct Big{
    vector<int> d;                  // 小端存储：d[0] 是个位
    Big():d{0}{}
    Big(int v){ if(v==0) d={0}; while(v) d.push_back(v%10),v/=10; if(d.empty()) d={0}; }
    Big(const string&s){
        for(int i=(int)s.size()-1;i>=0;i--) d.push_back(s[i]-'0');
        if(d.empty()) d={0};
        trim();
    }
    void trim(){ while(d.size()>1&&!d.back()) d.pop_back(); }
    int size()const{ return d.size(); }
    bool zero()const{ return d.size()==1&&d[0]==0; }
    int& operator[](int i){ return d[i]; }
    int operator[](int i)const{ return d[i]; }
};

/* ---------- 比较 ---------- */
bool operator<(const Big&a,const Big&b){
    if(a.size()!=b.size()) return a.size()<b.size();
    for(int i=a.size()-1;i>=0;i--) if(a[i]!=b[i]) return a[i]<b[i];
    return false;
}
bool operator==(const Big&a,const Big&b){ return a.d==b.d; }
bool operator!=(const Big&a,const Big&b){ return !(a==b); }
bool operator>(const Big&a,const Big&b){ return b<a; }
bool operator<=(const Big&a,const Big&b){ return !(b<a); }
bool operator>=(const Big&a,const Big&b){ return !(a<b); }

/* ---------- 加法 ---------- */
Big operator+(const Big&a,const Big&b){
    Big c; int n=max(a.size(),b.size());
    c.d.assign(n+1,0);
    for(int i=0;i<n;i++){
        c[i]+=(i<a.size()?a[i]:0)+(i<b.size()?b[i]:0);
        c[i+1]+=c[i]/10; c[i]%=10;
    }
    c.trim(); return c;
}

/* ---------- 减法（要求 a>=b） ---------- */
Big operator-(const Big&a,const Big&b){
    Big c; c.d.assign(a.size()+1,0);
    for(int i=0;i<a.size();i++){
        c[i]+=a[i]-(i<b.size()?b[i]:0);
        if(c[i]<0){ c[i]+=10; c[i+1]--; }
    }
    c.trim(); return c;
}

/* ---------- 乘法 ---------- */
Big operator*(const Big&a,int k){
    if(k==0||a.zero()) return Big(0);
    Big c; c.d.assign(a.size()+1,0);
    for(int i=0;i<a.size();i++){
        c[i]+=a[i]*k;
        c[i+1]+=c[i]/10; c[i]%=10;
    }
    c.trim(); return c;
}
Big operator*(const Big&a,const Big&b){
    if(a.zero()||b.zero()) return Big(0);
    Big c; c.d.assign(a.size()+b.size()+1,0);
    for(int i=0;i<a.size();i++) for(int j=0;j<b.size();j++) c[i+j]+=a[i]*b[j];
    for(int i=0;i+1<(int)c.d.size();i++){ c[i+1]+=c[i]/10; c[i]%=10; }
    c.trim(); return c;
}

/* ---------- 高精 / 低精，高精 % 低精 ---------- */
Big operator/(const Big&a,int k){
    Big c; c.d.assign(a.size(),0); int r=0;
    for(int i=a.size()-1;i>=0;i--){ r=r*10+a[i]; c[i]=r/k; r%=k; }
    c.trim(); return c;
}
int operator%(const Big&a,int k){
    int r=0;
    for(int i=a.size()-1;i>=0;i--) r=(r*10+a[i])%k;
    return r;
}

/* ---------- 高精 / 高精（带余数） ---------- */
void divmod(const Big&a,const Big&b,Big&q,Big&r){
    q=Big(0); q.d.assign(a.size(),0); r=Big(0);
    for(int i=a.size()-1;i>=0;i--){
        r.d.insert(r.d.begin(),a[i]); r.trim();        // r = r*10 + 第 i 位
        int res=0;
        for(int t=9;t>=0;t--) if(b*t<=r){ res=t; break; }
        if(res) r=r-b*res;
        q[i]=res;
    }
    q.trim();
}
Big operator/(const Big&a,const Big&b){ Big q,r; divmod(a,b,q,r); return q; }
Big operator%(const Big&a,const Big&b){ Big q,r; divmod(a,b,q,r); return r; }

/* ---------- 复合赋值 ---------- */
Big& operator+=(Big&a,const Big&b){ return a=a+b; }
Big& operator-=(Big&a,const Big&b){ return a=a-b; }
Big& operator*=(Big&a,const Big&b){ return a=a*b; }
Big& operator/=(Big&a,const Big&b){ return a=a/b; }

/* ---------- 输入输出 ---------- */
istream& operator>>(istream&in,Big&a){
    string s; in>>s;
    a=Big(s);
    return in;
}
ostream& operator<<(ostream&out,const Big&a){
    for(int i=a.size()-1;i>=0;i--) out<<a[i];
    return out;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    Big a,b;cin>>a>>b;
    cout<<a+b<<endl;
    if(a>=b) cout<<a-b<<endl; else cout<<'-'<<b-a<<endl;
    cout<<a*b<<endl;
    cout<<a/b<<endl;
    cout<<a%b<<endl;
    return 0;
}
```

## 复杂度

| 运算 | 复杂度 | 说明 |
| --- | --- | --- |
| `+` `-` | O(n) | 逐位加减 + 进位/借位 |
| `*`（Big × 低精） | O(n) | 逐位乘，立即进位 |
| `*`（Big × Big） | O(n²) | 竖式，先全部累加再一次进位 |
| `/` `%`（Big ÷ 低精） | O(n) | 从高位逐位试商 |
| `/` `%`（Big ÷ Big） | O(n²)（×10 次试商） | 长除法，每轮从 9 试到 0 |
| 比较 | O(n) | 先比长度，再从高位比 |

`n` 是位数。`n ≤ 5000` 时 `O(n²)` 完全够用（1e5 位的题要 FFT/NTT，不在这里）。

## 用法备忘

```cpp
Big x;                 // 0
Big y(12345);          // 由 int 构造
Big z("98765432109876543210");   // 由字符串构造

Big s = x+y, dd = x-y, p = x*y, q = x/y, r = x%y;
if (x < y) swap(x,y);            // 比较运算符齐全，能直接 sort
cout << x*2 << endl;             // Big × int
cout << x/7 << " " << x%7 << endl;   // Big ÷ int（不需要额外套 Big）
```

## 易错点 / 易混点

| 问题 | 后果 | 正确做法 |
| --- | --- | --- |
| 存储方向 | 输出反了 | **小端**：`d[0]` 是个位，输出时从 `size()-1` 倒着打 |
| 前导零 | 输出 `000123`、比较出错 | 每次运算后 `trim()` |
| 减法越界 | `c[i+1]--` 越界 RE | 结果数组开 `a.size()+1`（多留一位） |
| 减法负数 | 借位借成乱码 | 只支持 `a>=b`；`a<b` 时输出 `'-'` 再算 `b-a` |
| 除零 | 崩溃 / 死循环 | 自己保证除数非 0（模板里不判） |
| 中间溢出 | 结果错乱 | 必须 `#define int long long`：`r*10+d`、`a[i]*k` 都可能超 `int` |
| 负数 | 构造出空 vector | 模板**只支持非负**；负数请先取绝对值再处理符号 |
| `vector` 拷贝 | 传参多了会变慢 | 参数一律 `const Big&`，只有返回时按值 |
| 乘法进位 | 只进位一次不够 | 用循环 `for(i) c[i+1]+=c[i]/10, c[i]%=10` |
| 比较时长度相等 | 直接返回 false | 长度相等要**从高位逐位**比 |
| `Big` 与 `int` 混用 | 担心重载歧义 | 实测无歧义：`x/7`、`x*7`、`x%7` 都走 `Big×int` 版本 |

## 常见变形

```cpp
// 1) 阶乘 / 斐波那契：直接用累乘、累加
Big f(1);
for (int i = 2; i <= n; i++) f *= i;      // n!

// 2) 取模版大数（答案要对 M 取模时，别用这个模板，直接边算边取模）
//    高精度只在"必须输出精确值"时用

// 3) 只要比较大小、不需要精确值：用 log10 估位数，或直接用字符串比长度
```

## 例题

- [洛谷 P1601 A+B Problem](https://www.luogu.com.cn/problem/P1601) — 只用到 `+`
- [洛谷 P2142 高精度减法](https://www.luogu.com.cn/problem/P2142) — 注意 `a<b` 的处理
- [洛谷 P1303 A*B Problem](https://www.luogu.com.cn/problem/P1303) — `Big×Big`
- [洛谷 P1480 A/B Problem](https://www.luogu.com.cn/problem/P1480) — `Big÷Big`（其实除数是低精，用 `x/k` 更快）
- [洛谷 P1009 阶乘之和](https://www.luogu.com.cn/problem/P1009) — `+=` 与 `*=`
- [洛谷 P1255 数楼梯](https://www.luogu.com.cn/problem/P1255) — 斐波那契 + 高精度

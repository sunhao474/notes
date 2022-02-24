# 连续请求

1. [前置知识](#1)
2. [题目描述](#2)
3. [循序渐进的实现](#3)

---

## <a id="1">前置知识</a>
* [reduce](#reduce)
* Promise
    - 基本应用
    - 链式调用的理解
* 当遇见多次请求的时候，是不是力求一定程度的并行

---

## <a id="2">题目描述</a>
假设你们遇到了一些麻烦：本地计算机无法自行进行低等运算（加减乘除）。  
以加法为例：
```javascript
function addRemote = async(a, b) => return new Promise((res, rej) => {
    setTimeout(() => resolve(a + b), 1000)
})
```
我们要实现如下效果：
```javascript
async function add() {
    ///
}

add(1, 2).then(res => {
    console.log(res) // 3
})

add(3, 5, 2).then(res => {
    console.log(res) // 10
})
```

### 最简单版本
喝口水，思考一下，看看题目，再看看我们都要的效果。需要支持两个参数即以上的加法。我们先来热个身
```js
async function add(...args) {
    let res = 0
    for (let i = 0; i < args.length;i++) {
        res = await addRemote(res, args[i])
    }

    return res;
}
```
似乎很简单。但是问题出现了：如果args小于2呢？没有判断。判断一下吧：
```js
async function add(...args) {
    // 判断参数个数
    let res = 0
    if (args.length < 2) {
        return args[0] || 0
    }

    for (let i = 0; i < args.length;i++) {
        res = await addRemote(res, args[i])
    }

    return res;
}
```
本来这么做是可以的。但是我们要体现js的掌握水平是不能止步于此的。出题人肯定是希望我们展现对于promise的理解。那么问题来了：我们现在是依次处理数组内容，有什么方法对于这样处理数组是有帮助的？reduce。先看代码
```js
async function add(...args) {
    return args.reduce((chain, item) => {
        return chain.then(res => {
            return addRemote(res, item)
        })
    }, Promise.resolve(0))
}
```
我们在复习一遍reduce：
# 连续请求

1. [前置知识](#1)
2. [题目描述](#2)
3. [最简单版本](#3)
4. [更快的请求](#4)
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
    setTimeout(() => res(a + b), 1000)
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

### <a id="3">最简单版本</a>
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
```js 
arr.reduce(
    callback(
        accumulator,
        currentValue[, index[, array]])[, initialValue]
)
```
reduce为数组中的每一个元素依次执行callback函数，不包括数组中被删除或从未被赋值的元素。
回调函数第一次执行时，accumulator 和currentValue的取值有两种情况：如果调用reduce()时提供了initialValue，accumulator取值为initialValue，currentValue取数组中的第一个值；如果没有提供 initialValue，那么accumulator取数组中的第一个值，currentValue取数组中的第二个值。  

另外，promise链式调用的细节，就是promise每次会返回一个新的promise，会接受前一个promisethen之后返回的值。  

我们尝试使用reduce + promise解决这个问题:
```js
async function add(...args) {
    return args.reduce((chain, item) => {
        return chain.then(res => {
            return addRemote(res, item)
        })
    }, Promise.resolve(0))
}
```
简要分析一下这个reduce：  
* reduce的起始状态是一个Promise.resolve(0)，这意味着reduce的累加器第一个参数是一个promise，
这个promise的then会返回一个0；
* 观察累加器参数，第一个参数应该是上一次reduce返回的一个promise，第二个参数则是累加的数字；
* 内部我们要关键分析：  
首先看最外层。根据设计，累加器第一个参数是一个可执行的Promise实例；
```js
    return args.then((chain, item) => {
        ...
    })
```
其次里面的返回：
```js
return addRemote(res, item)
```
这部分就是最能体现promise链式调用理解的部分。我举一个简单的例子：
```js
let prms1 = new Promise(res => {
    res('prms1')
})

let prms2 = prms1.then(result => {
    let prms2 = new Promise(res => {
        res('prms2' + ' + ' + result)
    })

    return prms2
})

console.log(prms2)

prms2.then(res => {
    console.log(res)
})

```
首先声明了一个prms1，然后令prms2等于prms1.then的执行结果；prms1中又声明了一个新的内部的prms2
将这个prms2在then的末尾返回；打印外层的prms2，会发现其实外层的prms2其实就是then中的prms2；在prms2中打印，结果就是prms2 + prms1.  
回到逻辑部分,每一次reduce，就会返回一个promise，这个promise实质上就是addRemote，相当于
```js
addRemote(0, args[0])
    .then(res1 => {
        addRemote(res1, args[1])
            .then(res2 => {
                addRemote(res2, args[2])
                    .then(res3 => {
                        // ...
                    })
            })
    })
```

## <a id="4">更快的请求</a>
这个版本显然是不能让人满意的。当我们进行多次数的加法时，每次两两相加再请求下一次，
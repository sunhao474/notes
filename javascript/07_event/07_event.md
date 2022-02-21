# 目录
1. [eventloop](#1)

---

## <a id="1">eventloop</a>
![](https://static.vue-js.com/61efbc20-7cb8-11eb-85f6-6fac77c0c9b3.png)

* 微任务
    - 由js引擎发起的任务。
    - 一个需要异步执行的函数，执行时机是在主函数执行结束之后、当前宏任务结束之前。
        - promise.then
        - MutationObserver
        - Object.observe（已废弃；Proxy 对象替代）
        - process.nextTick（Node.js）
* 宏任务
    - 由浏览器宿主发起的任务。
    - 不能精确控制执行时间
        - script
        - setTimeout/setInterval
        - UI rendering/UI事件
        - postMessage、messageChannel
        - setImmediate、I/O（Node.js）

### async/await
```javascript
function asyncF() {
    return Pormise.resolve('test')
}
```
和下面的函数类似：
```javascript
async function f() {
    return 'test'
}
```

await会阻塞后面的代码，无论await后面跟的是不是异步函数。
例子：

```js
async function fn1() {
    console.log(1)
    await fn2()
    console.log(2)
}

async function fn2() {
    console.log('fn2')
}

fn1()
console.log(3)
```
上面的例子中，`await`会阻塞await下方的代码（将其加入微任务队列）,先执行`async`外面的同步代码，同步代码执行完，再回到`async`函数中，执行之前的阻塞代码。

```js
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function () {
    console.log('settimeout')
})
async1()
new Promise(function (resolve) {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
console.log('script end')
```

分析过程：

1. 执行整段代码，遇到 `console.log('script start')` 直接打印结果，输出 `script start`
2. 遇到定时器了，它是宏任务，先放着不执行
3. 遇到 `async1()`，执行 `async1` 函数，先打印 `async1 start`，下面遇到` await `怎么办？先执行 `async2`，打印 `async2`，然后阻塞下面代码（即加入微任务列表），跳出去执行同步代码
4. 跳到 `new Promise` 这里，直接执行，打印 `promise1`，下面遇到 `.then()`，它是微任务，放到微任务列表等待执行
5. 最后一行直接打印 `script end`，现在同步代码执行完了，开始执行微任务，即 `await `下面的代码，打印 `async1 end`
6. 继续执行下一个微任务，即执行 `then` 的回调，打印 `promise2`
7. 上一个宏任务所有事都做完了，开始下一个宏任务，就是定时器，打印 `settimeout`

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

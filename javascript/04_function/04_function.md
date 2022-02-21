# summary

1.[闭包](#1)  
2.[执行上下文](#2)  
3.[执行栈](#3)  
4.[函数声明和函数表达式的区别](#4)  
5.[基本类型中的string真的实在栈中吗](#5)  
6.[函数缓存](#6)  
7.[内存泄露](#7)


---

## <a id="1">闭包</a>

### 概念
一个绑定了执行环境的函数。与一般函数的区别是：他携带了执行环境。（不难发现，一切javascript函数，皆是闭包）
* 环境部分
    - 环境：函数的词法环境（执行上下文的一部分）
    - 标识符列表：函数中用到的未声明的变量
* 表达式部分:函数体

特别解释：执行上下文：执行时所需的所有信息
执行上下文分为：
* lexical enviroment: 词法环境，当获取变量或者this时使用
* variable environment：变量环境，当声明变量时使用
* code evaluation state: 用于恢复代码执行位置
* Function: 如果当前执行的是函数，标识正在被执行的函数
* ScriptOrModule: 当前执行的是脚本或者模块，表示正在被执行的代码
* realm: 使用的基础库和内置对象实例
* Generator: 仅生成器函数有这个属性，表示当前生成器。

其中Funcion和ScriptOrModule的概念，请去学习js的语法环境加深理解

举例
``` javascript
function outer() {
    var a = 44;
    let inner = function() {
        // a是inner未声明的变量，他在标识符列表中
        console.log(a);
    }

    return inner;
}

outer()();
```

---

## <a id="2">执行上下文</a>
当代码运行时，他需要的所有环境信息。

分为三种：
* 全局执行上下文：只有一个，window
* 函数执行上下文： 每当函数被调用时就会单独创建一个
* Eval执行上下文：运行在eval中的代码。

分为三个阶段：
* 创建阶段：
    - 确定this的值
    - 创建词法环境
        - 全局环境： 没有外部环境的词法环境，有一个全局对象，this的值指向这个全局对象，其外部环境引用为null
        - 函数环境：用户在函数中定义的变量存储在环境记录中，包含了`arguments`对象，其外部环境的引用取决于函数的执行作用域。
    - 创建变量环境
        - 跟词法环境的结构是极其类似的。在es6中，词法环境和变量环境的区别在于前者用于存储函数声明和变量（ `let` 和 `const` ）绑定，而后者仅用于存储变量（ `var` ）绑定
* 执行阶段：
    - 变量的赋值，以及代码的执行。
* 回收阶段：
    - 执行上下文出栈，等待虚拟机回收执行上下文。

---

## <a id="3">执行栈</a>

执行栈（调用栈），先进后出，用于存储代码执行期间创建的所有执行上下文。
1. 当`Javascript`引擎开始执行你第一行脚本代码的时候，它就会创建一个全局执行上下文然后将它压到执行栈中
2. 每当引擎碰到一个函数的时候，它就会创建一个函数执行上下文，然后将这个执行上下文压到执行栈中
3. 引擎会执行位于执行栈栈顶的执行上下文(一般是函数执行上下文)，当该函数执行结束后，对应的执行上下文就会被弹出，然后控制流程到达执行栈的下一个执行上下文

---

## <a id="4">函数声明和函数表达式的区别</a>

用函数声明创建的函数funDeclaration可以在funDeclaration定义之前就进行调用；而用函数表达式创建的funExpression函数不能在funExpression被赋值之前进行调用。

原因在于变量提升：函数声明提升带着函数定义一起提升了，函数表达式在提升的时候被定义为undefined，要等赋值时才会有函数体。

---

## <a id="5">基本类型中的string真的实在栈中吗</a>
并不。
当我们声明一个字符串的时候：
``` javascript
const str = 'string'
```
v8引擎内部有一个名为stringTable的hashMap缓存了所有字符串。V8阅读我们代码的时候，转换成ast时，没遇到一个字符串，根据其特征计算出hash值，插入到hashmap中。

---

## <a id="6">函数缓存</a>
函数缓存：将上次的计算结果缓存起来，当下次调用时，如果遇到相同的参数，就直接返回缓存中的数据。  
如何实现：
* 闭包
* 柯里化
* 高阶函数

简单实现
```js
const memorize = function(fn, content) {
    let content = content || this;
    let cache = Object.create(null)

    return func = (...key) => {
        if (!cache[key]) {
            cache[key] = fn.call(content, key)
        }

        return cache[key]
    }
}
```
使用场景：
* 执行复杂计算的函数，开销昂贵。
* 高度重复输入范围的函数。
* 具有重复输入递归值的函数。
* 纯函数，即每次使用特定输入调用时返回相同输出的函数。

---

## <a id="7">内存泄露</a>
由于各种原因，未能释放不再使用的内存。
### 垃圾回收机制
js具有自动垃圾回收机制。  
通常使用的方法有：
* 标记清除
    - 当变量进入环境时候，会被标记为“使用中”，当离开环境时，会被标记为“使用完毕”
    - 垃圾回收程序运行的时候，会标记内存中存储的所有变量。然后，它会将所有在上下文中的变量，以及被在上下文中的变量引用的变量的标记去掉
    - 在此之后再被加上标记的变量就是待删除的了，原因是任何在上下文中的变量都访问不到它们了
    - 随后垃圾回收程序做一次内存清理，销毁带标记的所有值并收回它们的内存
* 引用计数
    - 语言引擎有一张表存储引用变量及它的引用次数。如果他的引用次数是0，就表示不会再用到了，可以将这块内存释放。
    - 如果一个值不再需要了，引用数却不为`0`，垃圾回收机制无法释放这块内存，从而导致内存泄漏  

标记清除的例子：
```js
var m = 0,n = 19 // 把 m,n,add() 标记为进入环境。
add(m, n) // 把 a, b, c标记为进入环境。
console.log(n) // a,b,c标记为离开环境，等待垃圾回收。
function add(a, b) {
  a++
  var c = a + b
  return c
}
```

引用计数的例子：
```javascript
const arr = [1, 2, 3, 4];
console.log('hello world');
```

面代码中，数组`[1, 2, 3, 4]`是一个值，会占用内存。变量`arr`是仅有的对这个值的引用，因此引用次数为`1`。尽管后面的代码没有用到`arr`，它还是会持续占用内存

如果需要这块内存被垃圾回收机制释放，只需要设置如下：

```js
arr = null
```

### 存在内存泄漏的情况
* 意外的全局变量  
```js
function fn() {
    bar = 'a'
}

function fn() {
    this.bar = 'a'
}

fn()
```
* 定时器造成内存泄露
```js
var someResource = getData();
setInterval(function(){
    var node = document.getElementById('node')
    if (node) {
        node.innerHTML = JSON.stringify(someResource)
    }
}, 1000)
```
如果`id`为Node的元素从`DOM`中移除，该定时器仍会存在，同时，因为回调函数中包含对`someResource`的引用，定时器外面的`someResource`也不会被释放
* 闭包
```js
function bindEvent() {
    var obj = document.createElement('XXX')
    var unused = function() {
        console.log(obj, '闭包内引用obj obj不会被摧毁')
    }

    obj = null // 解决
}
```

* 没有及时清理dom的元素
```js
const refA = document.getElementById('refA');
document.body.removeChild(refA); // dom删除了
console.log(refA, 'refA'); // 但是还存在引用能console出整个div 没有被回收
refA = null;
console.log(refA, 'refA'); // 解除引用
```

* 监听addEventListener,忘记remove
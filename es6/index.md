# ES6

1. [array](#1)
2. [decorator](#2)
3. [function](#3)
4. [generator](#4)
5. [异步解决方案](#5)

---

## <a id="1">array</a>

### 一. ...操作符

将一个剋展开的对象（数组，对象）转化为序列

``` js
let obj = {
    a: 1,
    b: 2,
}

let obj2 = {
    ...obj, // = a: 1, b: 2,
    c: 3
}
```
需要注意：通过扩展运算符实现的依然是浅拷贝。  
定义了遍历器（iterator）的对象，可以使用...操作符。反之会报错。  

### 二. 构造器新增方法 form \ of

* from
    - 将类数组对象和实现了( iterator )的对象转化为真正的数组。
    - ( arr , func ), 第二个参数可以在转化的过程中处理每一个迭代对象。
* of
    - 将一系列参数放进一个数组返回。
        ``` js
            Array.of() // 不传参数，返回空数组[]
            Array.of(3) // 只传一个比较特殊， 返回一个长度为3，每个位置都是空的数组[ , , ]
            Array.of(3, 1) // 返回一个长度为2的数组[3, 1]
        ```

### 三. 实例对象新增方法： 
* copyWithin()
    - 将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组
    - (target, start, end), target 为目标起始位置; start 为复制源的起始位置; end 为复制源的终止位置（不包含该位置）
        ``` js
        [1, 2, 3, 4, 5].copyWithin(0, 3)
        // [4, 5, 3, 4, 5]
        ```
* find()、findIndex()
    - find 用于找到第一个满足条件的数组成员
    - findIndex 返回第一个符合条件的数组成员的 index 
    - 这两个函数的第二个参数可以用来改变绑定的 `this` 对象
* fill()
    - 用注定参数列表填充一个已经存在的数组
    - 第一个参数是要填充进去的值，第二个参数和第三个参数和copywithin一样。
        ``` js
        ['a', 'b', 'c'].fill(7)
        // [7, 7, 7]

        ['a', 'b', 'c'].fill(7, 1, 2)
        // ['a', 7, 'c']
        ```
* entries(), keys(),values()
    - entries：返回键值对
    - keys: 返回键
    - values： 返回值
* includes()
    - 判断数组里是否有对应的值，返回true、false
    - 第二个参数可选，
* flat()、flatMap()
    - flat()，用于将数组扁平化,有一个参数可以指定flat深入到哪种层数。
        ```js
        [1, 2, [3, [4, 5]]].flat()
        // [1, 2, 3, [4, 5]]

        [1, 2, [3, [4, 5]]].flat(2)
        // [1, 2, 3, 4, 5]
        ```
    - flatMap()难以解释，看看例子：
        ```js
        // 相当于 [[2, 4], [3, 6], [4, 8]].flat()
        [2, 3, 4].flatMap((x) => [x, x * 2])
        // [2, 4, 3, 6, 4, 8]
        ```

### 四 改变了sort算法，使之成为稳定排序算法。

---

## <a id="2">decorator</a>
即装饰者模式：在不改变原类的情况下，动态扩展对象功能的设计理论。  
详情看看代码：
```js
class A {
    // ...
}
```
定义一个装饰器，为A增加一个新功能：
```js
function extendA(target) {
    target.newFn = 'hello'
}
```

最后扩展A
```js
@extendA
class A {

}

// 等同于
A = extendA(A) || A
```

PS: 修饰器语法目前浏览器不支持，需要使用babel等工具转译。  

`decorator` 可以用在下列两种情况：
* 类的装饰
* 类属性的装饰
    - 当对类属性进行装饰的时候，能够接受三个参数：类的原型对象，需要装饰的属性名，装饰属性名的描述对象。举个例子：
        ```js
        function readonly(target, name, descriptor) {
            descriptor.writable = false;
            return descriptor;
        }

        class Person {
            @readonly
            name() { return this.name }
        }

        // 等价于

        readonly(Person.prototype, 'name', descriptor);
        ```

---

## <a id="3">function</a>

### 默认值
```js
function fn(a , b = 1) {
    // ...
}
```

* 函数的形参是默认声明的，不能使用`let` `const`再次声明
* 参数默认值应该是函数的尾参数，如果不是非尾部的参数设置默认值，实际上这个参数是不能省略的
    ```js
    function(a = 1, b) { // 错误

    }
    ```

### 属性
* `length` 将返回没有指定默认值的参数的个数, `rest` 参数也不会计入`length`属性。
* `name` 返回该函数的函数名。
    - 注意，如果将一个具名函数赋值一个变量，`name` 将返回这个具名函数原本的名字。
        ```js
        const bar = functino baz();
        bar.name // baz
        ```
    - `Function` 构造函数返回的函数实例，`name`属性为 `anoymous`
        ```js
        (new Function).name  // 'anoymous'
        ```
    - `bind` 返回的函数，`name` 属性值会加上`bound` 前缀
    ```js
    function foo() {}
    foo.bind({}).name // 'bound foo'
    ```

### 作用域
一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域。  
等到初始化结束，这个作用域就会消失。
```js
let x = 1;
function f( y = x) {
    let x = 2;
    console.log(y)
}

f() // 1
```

### 严格模式

只要函数参数使用了默认值、解构赋值、扩展运算符，那么函数内部就不能显示设定为严格模式。

### 箭头函数

* 函数体内的 `this` 对象，就是定义时所在的对象，而不是使用时所在的对象。箭头函数不会创建自己的this,它只会从自己的作用域链的上一层继承this
* 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会抛出错误。
* 不可以使用 `arguments` 对象，该对象在函数体内不存在。
* 不可以使用 `yield` 命令，因此箭头函数不能用作 generator 


---

## <a id="4">generator</a>
generator 是 es6 提供的一种异步编程解决方案，语法行为与传统函数不同。  
执行 generator 会返回一个遍历器对象，可以依次遍历内部的每一个状态：
```js
function* hello() {
    yield 'hello';
    yield 'world';
    return 'ending';
}
```

所谓`返回遍历器对象`，即结果具有`Symbol.iterator`属性
```js
function* gen() {

}

var g = gen();
g[Symbol.iterator]() === g // true
```

* 通过 `yield` 关键字可以暂停 `generator` 函数返回的遍历器对象状态。比如上面的 `hello` 函数。  
* 只要拿到遍历器对象，可以通过 `next` 方法将状态进行下去，直到遇到下一次 `yield` 停止。
* 如果没有到新的 `yield` , 就一直运行到函数结束，直到 `return` 。并将 `return` 的变量作为返回值。
* 如果没有 `return` ,则会在执行 `next` 返回一个 `value` 值为 `undefined` 的对象。
```js
let h = hello()

h.next()
// {value: 'hello', done: false}
h.next()
// {value: 'world', done: false}
h.next()
// {value: 'end', done: true}
h.next()
// {value: undefined, done: true}
```

`done` 判断是否有下个状态， `value`对应状态值。`yield`本身没有返回值，通过调用`next` 方法可以带一个参数，该参数就会被当作***上一个*** `yield`表达式的返回值。

```js
function *foo(x) {
    var y = 2 * (yield(x + 1));
    var z = yield (y / 3);
    return (x + y + z)
}

var a = foo(5);
a.next()
// { value: 6, done: false }
a.next()
// { value: NAN, done: false }
a.next()
// { value: NAN, done: true }

var b = foo(5)
b.next()
// { value: 6, done: false }
b.next(12)
// { value: 8, done: false }
b.next(13)
// { value: 42, done: false }
```
如上所说，`generator` 返回的是 `iterator` 对象，所以可以通过`for...of`遍历。  
```js
function* foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}

for (let v of foo()) {
    console.log(v)
}
// 1 2 3 4 5 注意，遍历不到return
```

---

## <a id="5">异步解决方案</a>
下面通过一个顺序文件读取的案例来展示：

* 回调函数
    ```js
    fs.readFile('a', function(err, data) {
        if (err) throw err;
        console.log(data)
        fs.readFile('b', function(err, data) {
            if (err) throw err;
            console.log(data)
        })
    })
    ```
* Promise 对象
    ```js
    const readFile = function(fileName) {
        return new Promise((res, rej) => {
            fs.readFile(fileName, function(err, data) {
                if (err) rej(err)

                res(data)
            })
        })
    }

    readFile('a')
        .then(res => {
            console.log(res)
            return readFile('b')
        })
        .then(res => {
            console.log(res)
        })
    ```
* generator 函数
    ```js
    
    ```
* async / await



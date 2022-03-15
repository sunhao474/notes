# ES6

1. [array](#1)
2. [decorator](#2)
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
        }
        ```
# 目录

1. [实现call](#1)  
2. [实现bind](#2)  
3. [实现new](#3)
4. [箭头函数的指向](#4)

---

## <a id="1">实现call</a>
概念：  
call方法接受一个指定的this值，以及后续的参数列表来调用一个函数，实现改变函数的this指向。需要注意以下几点：
* 第一个参数为null或者undefined时，this指向全局对象window，值为原始值的指向该原始值的自动包装对象，如 String、Number、Boolean
* 为了避免函数名与上下文(context)的属性发生冲突，使用Symbol类型作为唯一值
* 将函数作为传入的上下文(context)属性执行
* 函数执行完成后删除该属性
* 返回结果

``` javascript
Function.prototype.mycall = function() {
    let args = Array.prototype.slice.call(arguments);
    let t = args.shift();

    t = t || window;

    let sym = symbol();
    t[sym] = this;
    
    let res = t[sym](...args);

    delete t[sym];
    return res;
}
```


## <a id="2">实现bind</a>
步骤
* 通过arguments分拆出this和绑定函数时传的参数。
* 声明一个func，并且也分拆他的arguments
* 判断是否是this调用，详情看下方代码，通过判断一个空对象的原型是否是当前调用this即可。


``` javascript
Function.prototype.mybind = function() {
    let args = Array.prototype.slice.call(arguments);
    let target = args.shift();

    function NOP() {}
    function func() {
        var currentArgs = Array.prototype.slice.call(arguments);

        target = NOP.isPrototypeOf(this) ? this : target
        this.call(target, ...currentArgs, ...args);
    }

    if (this.prototype) {
        NOP.prototype = this.prototype;
    }
    func.prototype = new NOP();

    return func
}
```

## <a id="3">实现new</a>

```js
function myNew(constructor, ...args) {
    let obj = {};
    obj.prototype = constructor.prototype;
    let result = constructor.apply(obj, args);
    return result instanceof Object ? result : obj;
}
```

---

## <a id="4">箭头函数的指向</a>
看下面两个例子：  
```js
// 1
var o = {
    a: 1,
    b: () => {
        console.log(this.a)
    }
}

o.b()

// 2
function b() {
    this.a = 'hello'
    this.fn = () => {
        this.a = 'world'
        console.log(this.a)
    }
}

let c = new b();
c.fn()
```
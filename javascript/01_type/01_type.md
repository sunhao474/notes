# 目录
1. [undfined和null的区别](#1)
2. [浅拷贝，深拷贝](#2)
3. [精度丢失](#3)  
---

## <a id="1">type和null的区别</a>
* null: 不该有值
* undefined: 缺少值，应该有一个值但没有定义

typeof null        // "object" (因为一些以前的原因而不是'null')  
typeof undefined   // "undefined"  
null === undefined // false  
null  == undefined // true  
null === null // true  
null == null // true  
!null //true  
isNaN(1 + null) // false  
isNaN(1 + undefined) // true  

## <a id="2">浅拷贝，深拷贝</a>

* 浅拷贝
    - 拷贝基本类型，新的值；拷贝引用类型，拷贝内存地址；
    - 存在浅拷贝的现象有：
        - `object.assign`
        - `Array.prototype.slice()`
        - `Array.prototype.concat()`
        - 使用...实现的复制。
* 深拷贝
    - 创建一个全新的对象，对应两个完全不同的地址，修改的时候不会相互影响。
    - JSON.stringify()可以利用来赋值，但是stringify会忽略undefined、函数、symbol

一个循环递归的例子：
```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== "object") return obj;
  // 是对象的话就要进行深拷贝

  // 避免循环引用
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  hash.set(obj, cloneObj);

  // 有个小问题，这里没法找到enumerate为false的参数
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

## <a id="3">精度丢失</a>
```js
0.1 + 0.2 === 0.3
```
上述语句的执行结果是false。
在`javascript`中，0.1和0.2都会转化为二进制后在进行运算（扩展阅读：[js数字精度研究](extends.md)）  
```js
// 0.1 和 0.2 都转化成二进制后再进行运算
0.00011001100110011001100110011001100110011001100110011010 +
0.0011001100110011001100110011001100110011001100110011010 =
0.0100110011001100110011001100110011001100110011001100111

// 转成十进制正好是 0.30000000000000004
```
所以比较是不等于的。
但为什么x = 0.1，得到的确实是0.1呢？
主要是存储二进制时小数点的偏移量最大为52位，最多可以表达的位数是`2^53=9007199254740992`，对应科学计数尾数是 `9.007199254740992`，这也是 JS 最多能表示的精度。  
它的长度是 16，所以可以使用 `toPrecision(16)` 来做精度运算，超过的精度会自动做凑整处理
```js
0.1.toPrecision(21) = 0.100000000000000005551
```

如果整数大于 `9007199254740992` 会出现什么情况呢？

由于指数位最大值是1023，所以最大可以表示的整数是 `2^1024 - 1`，这就是能表示的最大整数。但你并不能这样计算这个数字，因为从 `2^1024` 开始就变成了 `Infinity`

```
> Math.pow(2, 1023)
8.98846567431158e+307

> Math.pow(2, 1024)
Infinity
```
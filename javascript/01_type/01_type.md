# 目录
1. [undfined和null的区别](#1)
2. [浅拷贝，深拷贝](#2)
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


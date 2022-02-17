# 目录
1.[== 和 === 的区别](#1)

---

## <a id="1">== 和 === 的区别</a>

### ==运算符
会进行隐式转换
有一下规则：
* 如果任一操作数是布尔值，则将其转换为数值再比较是否相等
``` javascript
let result = (true == 1); // true
```
* 如果一个操作数是字符串，另一个操作数是数值，则尝试将字符串转换为数值，再比较是否相等
``` javascript
let result1 = ("55" == 55); // true
```
* 如果一个操作数是对象，另一个操作数不是，则调用对象的 valueOf() 方法取得其原始值，再根据前面的规则进行比较
``` javascript
let obj = {valueOf:function(){return 1}}
let result1 = (obj == 1); // true
```
* null 和 undefined相等
``` javascript
let result1 = (null == undefined ); // true
```

* NaN不和任何相等，包括自己
``` javascript
let result1 = (NaN == NaN ); // false
```
* 引用类型，只会查看他们地址是否一致

### ===运算符
不执行转换，首先满足类型必须相同

一些奇怪的情况
``` javascript
'' == '0' // false
0 == '' // true
0 == '0' // true

false == 'false' // false
false == '0' // true

false == undefined // false
false == null // false
null == undefined // true

// 为什么相等？相关扩展: Number()转换的规则
' \t\r\n' == 0 // true
```
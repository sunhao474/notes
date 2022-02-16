# 目录
1. [undfined和null的区别](#1)

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
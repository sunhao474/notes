# summary

1.[闭包](#1)  

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


# summary

1. [IIFE及作用域](#1) / [答案](#11)

---

<a id="1">IIFE及作用域</a>
```javascript
var name = 'Tom';
(function() {
    if (typeof name == 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
```

---

<a id="11">IIFE及作用域</a>

解析：
* var声明的变量没有块级作用域。当var声明的函数内部时，声明在当前函数作用域。函数的变量找到了这个声明的var，所以肯定不会再向上寻找外层的var了;
* 声明和赋值是两回事；var确实会变量提升到顶部，但name只会走到if里面才会有值，所以在判断的时候才会取值。这时候typeof name的值为undefined
* 所以进第一个判断。最后打印Goodbye jack
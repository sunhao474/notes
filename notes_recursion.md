# 递归


## 总结
---

就目前讲，js涉及的递归不会出现太复杂的情况。解决递归问题的基本节奏就是：
### 1.最简单的形式分析
### 2.递归规律的查找，总结出递归式
### 3.可能出现的形式之间的归纳和区分
### 4.非递归形式
从常理而言，只要能做到前两步，一个递归好歹都是能写出来的。但是第三点比较重要，会影响到你在面试现场的解题速度：我们自然是越快越好。第四点根据

## 举例
---

### 1. 斐波那契数列
递归经典题目。递归式基本不用思考，就是你高中大学上课的那个:  

f(n) = f(n - 1) + f(n - 2)

不过我们按照形式来，首先
* 最简单形式： 当n = 0 时，f(n) = 0;当n = 1时, f(1) = 1,这也是数列的前两项。
    - 代码为： if (n === 0 || n === 1) return n;
* 递归式：f(n) = f(n - 1) + f(n - 2)
    - 递归式部分，就是return函数本身了，return f(n - 1) + f(n - 2)
* 可能的形式：这个递归过于简单，不存在可能的特别形式
    - 留白

将三点组合：
```javascript
function fib(n) {
    // 首先，处理最简形式
    if (n === 0 || n === 1) {
        return n
    }

    // 可能的形式没有，中间就不做什么了。


    // 处理递归式
    return f(n - 1) + f(n - 2)
}
```

## 2. deepclone
非常经典的一个js面试编程题。让我们一次来分析：（函数定义为f(n)）,其中n接受的参数是一个属性值，它可以是obj,array,还有基本类型  
ps: **这里的类型判断很不规范，最好能详细判断一下, 再者，没有使用尾递归形式，效能不佳**

* 最简单形式：每当我们处理到一个属性，他是一个基本类型的时候，那么直接复制就好了：
    - if (typeof key == string || number) return key;
* 递归式：
    - 递归式非常简单，我们一个递归只处理一个属性，我们返回一个当前递归处理的属性:  
    return f(key)（是不是没有懂？没关系，这个递归的难点就在于分析第三个要点：归纳形式）
* 可能出现的形式的区分：
    - 1.如果参数是一个数组，我们同样需要返回一个数组：return [f(n[0]), f(n[1]),... f(n[n])]
    - 2.如果参数是一个对象，我们同样要复制一个对象: return {key1: f(n(key1)), key2: f(n(key2))...}这样

根据思路，可以开始写代码了：
``` javascript
function cloneDeep(target) {
    // 这个res需要提前提出来，因为根据类型不同，我们要返回不同的res，对res的处理也不太一样，具体可以往下看到形式区分的部分
    let res;
    // 可以先做一下判断，面试的时候会加一点小分吧。
    if (!target) {
        throw new Error('illegal value')
    }

    // 形式区分
    // 我这里，把复杂的形式提前了，按照习惯可以先写最简单形式，也方便理解一点
    if (Array.isArray(target)) {
        // 这时候，我们的res需要赋为数组,然后用数组的push操作来添加针对每一个数组元素的递归处理
        res = []
        for (let i = 0; i < target.length;i++) {
            res.push(cloneDeep(target[i]))
        }
    } else if (typeof target == 'object') {
        // 判断是一个对象，初始化res为一个对象，并遍历对象的可访问属性（暂时就不考虑不可访问属性的复制了,不然就使用Object.getOwnPropertyNames()）另外不可使用Object.keys，原型上的可枚举属性就没法弄到了
        for (let attrs in target) {
            // attention in cloneDeep //
            res[attrs] = cloneDeep()
        }
    } else {
        // 处理最简单形式
        res = targets
    }

    return res
}
```

完事。需要注意的是，如果要改成尾递归的形式（简要说明）
``` javascript
function cloneDeep(target) {
    let res;

    function inner(target, insertFather) {
        // deal
        return inner(attr, target)
    }

    return res
}
```
这种类似的形式，递归函数要标明第二个参数，也就是将属性插入哪里。这样写就稍微麻烦一点，而且要在cloneDeep中和inner里面分别判断target的类型，不太优雅。

## 3. stringify
同样非常经典。实现类似JSON.stringify的功能，把目标转化为纯字符串数组。我们这里来玩个花活，把空格和换行符也插入（实际上是不用插入的）  
同样，函数为f(n)

再次进入分析步骤：
* 最简单形式：依旧是基本类型情况，直接根据字符串或者数字类型反回对应的json格式：
    - string: '"' + target + '"' + ",\n"
    - number: target + ",\n"
* 递归式：同样是f(n), 道理同cloneDeep，复杂体现在第三点。
* 可能出现的形式区分，这是非常有趣的一个阶段：
    - Array: 返回一个数组的字符串，这个字符串的构造，简单想想就能理解：  
    "[" + f(n(0)) + f(n(1)) + ... + "],\n"
    - Object: 返回一个对象字符串，这个要稍微复杂一点了，因为我们要处理key值：  
    "{" + "attr1:" + f(n[attr0]) + ... + "},\n"

分析完毕了。关于空格的问题，将在代码的注释里加上说明：
代码如下：
``` javascript
// 先构建一个增加空格的函数，根据传入的层级来渲染空格数量
function addNbsp(level) {
    let nbsps;
    for (let i = 0; i < level * 4; i++) {
        nbsps += ' '
    }

    return nbsps;
}

function stringify(target) {
    function recursion(target, level) {
        let res = ''

        // 参数是对象和数组的情况要分开讨论，因为不能都用for in循环，会有问题。
        // 用一个arr来存储每一行属性，同时用join的办法巧妙处理最后一个行的行尾跟其他行不同的情况：最后一行是没有逗号的,单纯换行
        if (Array.isArray(target)) {
            res += '[\n'
            let arr = []
            for (let i = 0; i < target.length; i++) {
                arr.push(addNbsp(level + 1) + recursion(target[i], level + 1))
            }

            res += arr.join(',\n') + '\n' + addNbsp(level) + ']'
        } else if (typeof target == 'object') {
            res += '{\n'
            let arr = []
            for (let attr in target) {
                arr.push(addNbsp(level + 1) + '"' + attr + '"' + ':' + recursion(target[attr], level + 1))
            }

            res += arr.join(',\n') + '\n' + addNbsp(level) + '}'
        } else if (typeof target == 'string') {
            res += '"' + target + '"'
        } else {
            res += target
        }

        return res;
    }


    // 增加空格函数，根据传入的Num增加对应倍数的空格
    function addNbsp(num) {
        let nbsps = ''
        for (let i = 0; i < num * 4; i++) {
            nbsps += ' '
        }

        return nbsps;
    }

    return recursion(target, 0)
}
```
完事。把换行和空格干掉，就是完全的stringify了。
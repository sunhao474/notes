## 置顶
https://www.cnblogs.com/theblogs/p/10575845.html
https://segmentfault.com/a/1190000015288700
https://www.jianshu.com/p/3433142faa68
http://bigerfe.com/ 9527
https://www.cnblogs.com/liuhao-web/p/11589848.html


## 2022.2.10
1. 零宽字符及其应用 https://github.com/zengkan0703/text-watermark/blob/master/src/index.js
2. reg.exec的返回值含义（返回一个数组，第0项是完全匹配的字符串，后面是正则表达式内()里的内容） 例子：

```javascript
var re = /quick\s(brown).+?(Jumps)/ig;
var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');

console.log(result)
结果是result: [
    0: 'Quick Brown Fox Jumps',
    1: 'brown', // 第一个括号内容
    2: 'Jumps',// 第二个括号内容
]
```

## 2022.2.7
1. 注意Array.concat的用法：arr = arr.concat(arr2)


## 2022.2.5
1. IIFE：一个立即执行的匿名函数，拥有独立的词法作用域
2. delete数组的item，数组的length时候会变化?
不会，被delete的位置为变为empty。（从C++角度理解，其实就是把内存释放了，但是内存位置依然被数组所记录）
http://bigerfe.com/iq/n690

3. ['1', '3', '10'].map(parseInt)的结果？
首先，map对应的参数（item, index）,parseInt对应的参数（item， 进制）
所以分别为: parseint(1, 0), parseInt(3, 1), parseInt(10, 2)
parseInt的结果固定是十进制数，第二个参数代表的进制是指如何解释第一位参数的预设进制。
parseInt的第二个参数传入0，相当于null，默认会被识别为十进制；1进制是不存在的进制，故为NaN；10解释为2进制，则转为10进制是2

4. 为什么不建议使用for in 循环数组？
https://www.jianshu.com/p/aaab5be59f7a

## 2022.2.3
1. 属性名表达式
其实一直在用，obj[],方括号就是属性名表达式。如果属性名表达式是一个不是一个字符串，会调用这个类型的toString

2. forEach map .filter的区别
forEach性能稍好于map


## 2022.2.2
1. 单点登录
https://juejin.cn/post/6844903664264413198

2. 居中/重排、重绘
http://bigerfe.com/iq/n769

3. addeventListener的第三个参数

4. Promise.all并发限制(粗略看了下)
https://segmentfault.com/a/1190000016389127

## 2022.2.1
1. node中间层概览
http://bigerfe.com/iq/n816

2. tcp 滑动窗口
http://bigerfe.com/iq/n814

3. 用proxy实现负数下标访问

4. 实现了async
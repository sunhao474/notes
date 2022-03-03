# 目录

1. [概念](#1)  
2. [操作](#2)
3. [事件](#3)
4. [可视区域](#4)
---

## <a id="1">概念</a>
* 是用来呈现`html`和`xml`文档并与其交互的API。
* 提供了一个结构化的描述，并提供改变结构的方式。

---

## <a id="2">操作</a>
主要分为：
* 创建
    - createElement
    - createTextNode
    - createDocumentFragment: 创建一个文档碎片，一种轻量级文档，对它的操作不会发生重绘、回流事件。
* 查询
    - querySelector: 传入任何有效的css选择器，选中首个符合条件的dom元素
    - querySelectorAll：返回一个包含节点子树内所有与之相匹配的`Element`节点列表
    - getElementBy(Id/ClassName/TagName/Name): 除了ID，都是返回集合。
* 修改
* 删除


---


## <a id="3">dom事件</a>
捕获->目标->冒泡  
事件委托：根据事件冒泡的原理，将子元素的事件回调函数绑定到父元素上。可以减少绑定函数，提升性能。

以下事件不适合使用事件委托：
* `focus`、`blur`: 没有冒泡机制。

事件模型分为三种：
* 原始事件模型(dom 0级)
    - 通过html结点中的属性绑定，或者通过js dom API获取结点绑定。
    - 支持冒泡，不支持捕获。
    - 同一个类型的事件只能绑定一次。
* 标准事件模型(dom 2级)
    - addEventListener(eventType, handler, useCapture), 第三个参数支持捕获
* IE事件模型(基本不用)

---

## <a id="4">可视区域</a>
需要判断可视区域的场景：
* 图片懒加载
* 列表无限滚动
* 计算广告元素的曝光情况
* 可点击链接的预加载

有三种办法判断元素是否在可视区域：
* offsetTop\scrollTop
    -  offset 相关属性能得到当前元素相对于父级第一个具有定位属性（relative，absolute，fixed）的元素的距离
    -  clientWidth 与 clientHeight 是元素内容区宽度（高度）+ padding
    -  scrollWidth 与 scrollHeight 可以确定元素实际大小，不包括内外边距。也就是滚动视口的大小。
    -  scrollLeft 与 scrollTop 属性是可读写的，用来确定当前元素的滚动位置
* getBoudingClientRect
    -  返回的是一个`DOMRect`对象。拥有`left`, `top`, `right`, `bottom`, `x`, `y`, `width`, 和 `height`属性
* intersection Observer
    - new IntersectionObserver(callback, options)
```js
function callback = (entries, observer) => {
// entries是一个被观测的子元素数组
entries.forEach(item => {
        item.time;               // 触发的时间
        item.rootBounds;         // 根元素的位置矩形，这种情况下为视窗位置
        item.boundingClientRect; // 被观察者的位置举行
        item.intersectionRect;   // 重叠区域的位置矩形
        item.intersectionRatio;  // 重叠区域占被观察者面积的比例（被观察者不是矩形时也按照矩形计算）
        item.target;             // 被观察者
})
}
```

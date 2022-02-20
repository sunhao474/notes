# 目录

1.[概念](#1)  
2.[操作](#2)
3.[事件](#3)
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

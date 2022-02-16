# 目录

1. [写一个精确判断类型的函数](#1)

---

## <a id="1">写一个精确判断类型的函数</a>

```javascript

function judge(target) {
    if (target === null) return 'null'

    return typeof target == 'object' ?
        Object.prototype.toString.call(target).split(' ')[1].replace(']', '') : typeof target
}

```

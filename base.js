// 判断函数类型
function judge(target) {
    if (target === null) return 'null'

    return typeof target == 'object' ?
        Object.prototype.toString.call(target).split(' ') : typeof target
}

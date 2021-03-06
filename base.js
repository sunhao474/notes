// 判断函数类型
function judge(target) {
    if (target === null) return 'null'

    return typeof target == 'object' ?
        Object.prototype.toString.call(target).split(' ')[1].replace(']', '') : typeof target
}
// 将横线式命名（get-element-by-id）转化为驼峰命名getElementById
function transformString(val) {
    console.log(typeof val)
    if (typeof val !== 'string') {
        throw new Error(`${val}is not a string`)
    }

    let result = [];
    let reg = /[a-z0-9\-]/i;
    let i = 0;
    let prevHypen = false;

    while (i < val.length) {
        if (!reg.test(val[i])) {
            throw new Error('not valid string')
        }

        if (val[i] == '-') {
            if (prevHypen) {
                throw new Error('continuous hypen not allowed')
            }

            i++;
            prevHypen = true
        } else {
            let char = val[i];
            if (prevHypen) {
                char = char.toUpperCase()
            }

            result.push(char)
            prevHypen = false
            i++;
        }
    }

    return result
}

// 标准答案 使用正则匹配+字符串原生方法
function transformCamelCase(s) {
    // replace方法第一个参数采用全局匹配模式，会匹配所有符合的条件并触发replace的第二个参数
    return s.replace(/-\w/g, function (x) {
        return x.slice(1).toUpperCase();
    })
}

console.log(transformCamelCase('get-element-by-id'))

// 解析查询字符串为对象
function parseParams(url) {
    // 首先要把?号后面的东西提取出来，规则上只要遇到第一个？号，后面的都归类为查询字符串
    // 注意转义?号
    let reg = /\?(.+)$/i;
    console.log(reg.exec('www.baidu.com?a=1&b=2&c=3'))
}

parseParams()


setTimeout(() => console.log("d"), 10);
var r = new Promise(function (resolve, reject) {
    setTimeout(() => {
        resolve()
    }, 0)
});
r.then(() => {
    var begin = Date.now();
    while (Date.now() - begin < 1000); console.log("c1");
    new Promise(function (resolve, reject) { resolve() }).then(() => console.log("c2"))
});
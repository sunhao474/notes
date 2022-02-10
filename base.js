// 判断函数类型
function judge(target) {
    if (target === null) return 'null'

    return typeof target == 'object' ?
        Object.prototype.toString.call(target).split(' ') : typeof target
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
    return s.replace(/-\w/g, function(x) {
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

function deepclone(source) {
    let res;
    if (Array.isArray(source)) {
        res = []
        source.forEach(item => {
            res.push(deepclone(item))
        })
    } else if (typeof source == 'object') {
        res = {}

        for (let attrs in source) {
            res[attrs] = deepclone(source[attrs])
        }
    } else {
        res = source
    }

    return res
}

// 实现json.stringfy
function stringify(obj) {
    if (typeof obj !=='object') {
        throw new Error('no object')
    }

    let res;
    function recursion(target) {

    }

    function addNbsp(str, num) {
        const res = ''
        for (let i = 0; i < num; i++) {
            res += ' '
        }

        return res += str;
    }
}

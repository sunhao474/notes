// 20222.2.1

// 函数柯里化
// 实现 add(1)(2)(3)

// 版本1 暴力解法
function myAdd(y) {
    return function (x) {
        return function (z) {
            return y + x + z
        }
    }
}
// 或者:

const curry = (fn) => {
    return judge = (...args) => {
        console.log(args.length)
        console.log(Object.create(fn))
        // fn.length： fn的这个属性是指能接受的参数的长度
        // 其实逻辑很简单，就是每次调用函数，只要参数长度没有达到函数本身要求的数量，就一直拼接，直到所有参数符合
        return args.length == fn.length ?
            fn(...args)
            : (...arg) => judge(...args, ...arg)
    }
}

const add = (a, b, c) => a + b + c
const curryAdd = curry(add)

console.log(curryAdd(1)(2)(3))

// 版本1肯定是不够的，我们要实现参数不固定是最好的
// 版本2
// 长度不定的一个数组求和，要借助到reduce函数

function addNew(...args) {
    return args.reduce((a, b) => a + b)
}

function currying(fn) {
    let args = []
    return function tmp(...newArgs) {
        //第一，我们要知道柯里化何时结束。怎么判断呢？这是由你自己定义的，比如我们可以在最后不传调用函数，所以args.length == 0 代表结束
        console.log(args)
        if (newArgs.length === 0) {
            let tempArgs = [...args]
            args = [] // 不要忘记清零
            return fn(...tempArgs) // 记得...一下，不然addnew里面取的是一个数组，不是一个参数列，args.reduce会失效
        } else {
            args = [...args, ...newArgs]
            return tmp
        }
    }
}

let newCurryAdd = currying(addNew)

console.log(newCurryAdd(1)(2)(3)(5)())

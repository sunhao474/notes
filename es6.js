// proxy实现负下标访问

// let arr = [1, 2, 3, 4, 5]

// let arrProxy = new Proxy(arr, {
//     get(target, key) {
//         if (key < 0) {
//             let remainder = Math.abs(key % arr.length)
//             if (remainder === 0) return target[0] 
//             let index = arr.length - remainder - 1
//             return target[index]
//         }

//         return target[key]
//     }
// })

// console.log(arrProxy[-1])
// console.log(arrProxy[-6])

// 实现async函数
// 考点：对于generator的把握

// 看看我们要什么效果：不能实现语法上的async/await,只能通过如下方式：
// 首先是执行，我们构造的async函数接收一个generator

function get1() {
    return new Promise((res, rej) => {
        console.log(2)
        // setTimeout(() => {
        //     res('get1 complete')
        // }, 3000)
        res('1 res')
    })
}

function get2() {
    return new Promise((res, rej) => {
        res('2 res')
        // setTimeout(() => {
        //     res('get2 complete')
        // }, 1000)
    })
}

async(function*() {
    try {
        console.log(1)
        let res = yield get1()
        console.log(3)
    } catch(err) {
        console.log(err)
    }
})

Promise.resolve().then(res => {
    console.log(4)
})

function async(generator) {
    let iter = generator()

    return new Promise(res => {
        function handle(iterResult) {
            if (iterResult.done !== true) {
                let value = iterResult.value
    
                if (value instanceof Promise) {
                    value.then(res => {
                        handle(iter.next(res))
                    })
                }
            } else {
                res(iterResult.value)
            }
        }
    
        handle(iter.next())
    })
}

// 实现数组的filter方法
Array.prototype.customFilter = function(fn ,context) {
    if (typeof fn != 'function') {
        throw new Error(`${fn} is not a function`)
    }

    let arr = this;
    let result = [];

    // for (let i in arr) {
    //     let temp = fn.call(context, arr[i], i , arr)
    //     if (temp) {
    //         result.push(arr[i])
    //     }
    // }
    for (let i = 0; i < arr.length; i++) {
        let res = fn.call(context, arr[i], i, arr)
        if (res) {
            result.push(arr[i])
        }
    }

    return result
}

// 实现数组flat方法
function c_flat(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        let iter = arr[i]
        if (Array.isArray(iter)) {
            result = result.concat(falt(arr[i]))
        } else {
            result.push(iter)
        }
    }

    return result;
}

// 数组去重
let originalArray = [1, 2, 3, 4, 5, 1 ,2 ,4]
const result = Array.from(new Set(originalArray));
console.log(result); // -> [1, 2, 3, 4, 5]


// 数组乱序 / 洗牌
function shuffle(arr) {
    let m  = arr.length;
    while( m > 1) {
        let index = parseInt(Math.random() * m--)
        [arr[index], arr[m]] = [arr[m], arr[index]]
    }

    return arr;
}

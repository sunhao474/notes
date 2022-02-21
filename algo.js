// // 斐波那契数列

// //#region 
// // 1.求单项
// function fib(n) {
//     if (n == 0 || n == 1) {
//         return n
//     }

//     return fib(n - 1) + fib(n - 2)
// }

// //2.记录列表
// function arrFib(n) {
//     let arr = [0, 1]

//     // 内层循环的方案2
//     // let a = 0,
//     //     b = 1;

//     let t = 2;
//     // while(arr.length <= n) {
//     //     arr.push(arr[turn - 1], arr[turn - 2])
//     //     turn++
//     // }
//     if (n == 0) return [0]
//     if (n == 1) return [0, 1]

//     while (arr.length < n) {
//         let newItem = arr[t - 1] + arr[t - 2]
//         arr.push(newItem)
//         t++

//         //内层循环的方案2：使用es6的数组交换语法
//         // [a, b] = [b, a+b]
//         // arr.push(b)
//     }

//     return arr;
// }

// console.log(arrFib(4))

// //#endregion

// // 有一个祖先树状 json 对象，当一个人有一个儿子的时候，其 child 为其儿子对象，如果有多个儿子，child 为儿子对象的数组。

// // 请实现一个函数，找出这个家族中所有有多个儿子的人的名字（name），输出一个数组。

// //#region 
// function findNameInTree(json) {
//     let arr = [json.name];
//     let child = json.child;
//     if (!child) return arr;

//     if (Array.isArray(child)) {
//         // arr = arr.concat(arr, child.map(item => {
//         //     return findNameInTree(item)
//         // }))
//         child.forEach(item => {
//             arr = arr.concat(findNameInTree(item))
//         })
//     }
//     else {
//         arr = arr.concat(findNameInTree(child))
//     }

//     return arr
// }


// let kazoku = {
//     name: 'sunhao',
//     child: [
//         {
//             name: 'sunhao_sun',
//             child: {
//                 name: 'sunhao_sun_hao'
//             },
//         },
//         {
//             name: 'sunhao_hao',
//             child: [
//                 {
//                     name: 'sunhao_hao_sun1',
//                 },
//                 {
//                     name: 'sunhao_hao_sun2',
//                 }
//             ]
//         }
//     ]
// }

// let result = findNameInTree(kazoku)
// console.log(result)


// // 一个非递归的解法：
// function findNameInTree_no_cursion(json) {
//     let stack = [];
//     let nameArr = [];

//     stack.push(json)
//     while(stack.length !== 0) {
//         let current = stack.pop()
//         nameArr.push(current.name)
//         let child = current.child
//         if (!child) continue

//         if (Array.isArray(child)) {
//             child.forEach(item => {
//                 stack.push(item)
//             })
//         } else {
//             stack.push(child)
//         }
//     }

//     return nameArr;
// }

// let result2 = findNameInTree_no_cursion(kazoku)
// console.log(result2)

// //#endregion

// 统计 1 ~ n 整数中出现 x 的次数。
// 只考虑n为js可容纳数字。如果超过，需要使用大数字库
function countNum(x, n) {
    // let current = n % 10;
    // n = n / 10;
    let count = 0;
    let factor = 0;
    let right = 0;
    while (n > 0) {
        let current = n % 10;
        n = parseInt(n / 10, 10);

        if (current > x) {
            count += (n + 1) * Math.pow(10, factor);
        } else if (current < x) {
            count += n * Math.pow(10, factor);
        } else {
            count += n * Math.pow(10, factor) + right + 1;
        }

        console.log('current is', current)
        console.log('left is', n)
        console.log('count is', count)

        right += Math.pow(10, factor) * current
        console.log('right is', right)
        factor++;
    }
    
    return count;
}


console.log(countNum(1, 213));

console.log(JSON.stringify(Object.prototype))

function simplifyNumberStr(arrStr) {
    let arr = arrStr.split(',');
    let res = [];
    let i = 0;
    let cache = [];

    while (i < arr.length) {
        const current = arr[i];
        if (i > 0 && current == Number(arr[i - 1]) + 1) {
            cache.push(current)
        }else if (i == 0) {
            cache.push(current)
        } else {
            res.push([...cache]);
            cache = [];
            cache.push(current)
        }

        i++;
    }

    res.push(cache)

    return res.map(item => {
        if (item.length >= 2) {
            return `${item[0]}-${item[item.length - 1]}`
        } else {
            return item[0];
        }
    }).join(',')
}

console.log(simplifyNumberStr('1,2,3,5,7,8,11,12,15,17,19'))

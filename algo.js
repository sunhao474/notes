// 斐波那契数列

//#region 
// 1.求单项
function fib(n) {
    if (n == 0 || n == 1) {
        return n
    }

    return fib(n - 1) + fib(n - 2)
}

//2.记录列表
function arrFib(n) {
    let arr = [0, 1]

    // 内层循环的方案2
    // let a = 0,
    //     b = 1;

    let t = 2;
    // while(arr.length <= n) {
    //     arr.push(arr[turn - 1], arr[turn - 2])
    //     turn++
    // }
    if (n == 0) return [0]
    if (n == 1) return [0, 1]

    while (arr.length < n) {
        let newItem = arr[t - 1] + arr[t - 2]
        arr.push(newItem)
        t++

        //内层循环的方案2：使用es6的数组交换语法
        // [a, b] = [b, a+b]
        // arr.push(b)
    }

    return arr;
}

console.log(arrFib(4))

//#endregion

// 有一个祖先树状 json 对象，当一个人有一个儿子的时候，其 child 为其儿子对象，如果有多个儿子，child 为儿子对象的数组。

// 请实现一个函数，找出这个家族中所有有多个儿子的人的名字（name），输出一个数组。

//#region 
function findNameInTree(json) {
    let arr = [json.name];
    let child = json.child;
    if (!child) return arr;

    if (Array.isArray(child)) {
        // arr = arr.concat(arr, child.map(item => {
        //     return findNameInTree(item)
        // }))
        child.forEach(item => {
            arr = arr.concat(findNameInTree(item))
        })
    }
    else {
        arr = arr.concat(findNameInTree(child))
    }

    return arr
}


let kazoku = {
    name: 'sunhao',
    child: [
        {
            name: 'sunhao_sun',
            child: {
                name: 'sunhao_sun_hao'
            },
        },
        {
            name: 'sunhao_hao',
            child: [
                {
                    name: 'sunhao_hao_sun1',
                },
                {
                    name: 'sunhao_hao_sun2',
                }
            ]
        }
    ]
}

let result = findNameInTree(kazoku)
console.log(result)


// 一个非递归的解法：
function findNameInTree_no_cursion(json) {
    let stack = [];
    let nameArr = [];

    stack.push(json)
    while(stack.length !== 0) {
        let current = stack.pop()
        nameArr.push(current.name)
        let child = current.child
        if (!child) continue

        if (Array.isArray(child)) {
            child.forEach(item => {
                stack.push(item)
            })
        } else {
            stack.push(child)
        }
    }

    return nameArr;
}

let result2 = findNameInTree_no_cursion(kazoku)
console.log(result2)

//#endregion
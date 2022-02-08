let log = [];

class hd {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(executor) {
        this.status = 'pending';
        this.value = null;

        // 实现异步的关键
        this.callbacks = [];

        try {
            executor(this.resolve, this.reject);

        } catch (err) {
            console.log('executed error')
            this.reject(err)
        }
    }

    resolve = (value) => {
        if (this.status == hd.PENDING) {
            this.status = hd.FULFILLED;
            this.value = value

            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onFulfilled(this.value)
                })
            });
        }
    }

    reject = (reason) => {
        if (this.status == hd.PENDING) {
            this.status = hd.REJECTED;
            this.value = reason;

            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onRejected(this.value)
                })

            });
        }
    }


    then = (onFulfilled, onRejected) => {
        if (typeof onFulfilled !== 'function') {
            onFulfilled = () => {
                return this.value // 穿透
            };
        }

        if (typeof onRejected !== 'function') {
            onRejected = () => {
                return this.value
            };
        }

        let promise = new hd((res, rej) => {
            if (this.status == hd.PENDING) {
                this.callbacks.push({
                    onFulfilled: value => {
                        this.parse(promise, onFulfilled(value), res, rej)
                    },
                    onRejected: value => {
                        this.parse(promise, onRejected(value), res, rej);
                    },
                })

            }

            if (this.status == hd.FULFILLED) {
                setTimeout(() => {
                    this.parse(promise, onFulfilled(this.value), res, rej)
                });
            }

            if (this.status == hd.REJECTED) {
                setTimeout(() => {
                    this.parse(promise, onRejected(this.value), res, rej);
                })
            }
        });

        return promise
    }

    parse(promise, result, resolve, reject) {
        if (promise == result) {
            throw new TypeError('chaining cycle detected')
        }
        try {
            if (result instanceof hd) {
                result.then(resolve, reject)
            } else {
                resolve(result)
            }
        } catch (err) {
            reject(err)
        }
    }

    static resolve(value) {
        return new hd((resovle, reject) => {
            if (value instanceof hd) {
                value.then(resovle, reject)
            } else {
                resovle(value)
            }
        })
    }

    static reject(value) {
        return new hd((resovle, reject) => {
            if (value instanceof hd) {
                value.then(resovle, reject)
            } else {
                reject(value)
            }
        })
    }

    static all(promises) {
        return new hd((resolve, reject) => {
            let list = [];
            promises.forEach(promise => {
                promise.then(value => {
                    list.push(value)
                    if (promises.length == list.length) {
                        resolve(list)
                    }
                }, reason => {
                    reject(reason)
                })
            })
        })
    }
}

let p1 = new hd((res, rej) => {
    res('gan')
})

let p2 = new hd((res, rej) => {
    res('ok')
})

hd.all([
    p1, p2
])
    .then(value => {
        console.log(value)
    }, reason => {
        console.log(reason)
    })

// let hdex = new hd((res, rej) => {
//     setTimeout(() => {
//         res('解决')
//     }, 1000);
// })
//     .then(value => {
//         console.log(value)
//         return new hd(resolve => {
//             resolve('sh3')
//         })
//     })
//     .then(value => {
//         console.log(value)
//     })

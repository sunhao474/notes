let prms1 = new Promise(res => {
    res('prms1')
})

let prms2 = prms1.then(result => {
    let prms2 = new Promise(res => {
        res('prms2' + ' + ' + result)
    })

    return prms2
})

console.log(prms2)

prms2.then(res => {
    console.log(res)
})

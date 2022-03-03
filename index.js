let obj = {
    valueOf: () => {
        return '1'
    }
}

console.log(null + 1)
console.log(1 + null)
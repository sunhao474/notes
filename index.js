function* fib(max) {
    let t,
    a = 0,
    b = 1,
    n = 0;

    while(n < max) {
        yield a;
        [a, b] = [b, a + b]
        n++;
    }

    return
}

let f = fib(5)

// console.log(f.next())
while (true) {
    if (!f.next().value) break
    console.log(f.next())
}

function maxLengthStr(s) {
    let stack = [];
    let i = 0;
    const length = s.length;
    if (length <= 0) return;
    let currentMaxSection = s[0];
    while (i < length) {
        stack.push(s[i]);
        i++;

        while (stack.length - 3 > -1 && stack[stack.length - 1] == stack[stack.length - 3]) {
            const right = stack.pop();
            const center = stack.pop();
            const left = stack.pop();

            const newSection = left + center + right;
            if (newSection.length > currentMaxSection.length) currentMaxSection = newSection
            stack.push(newSection);
        }

        if (stack.length - 2 > -1 && isSameStr(stack[stack.length - 2]) && stack[stack.length - 1] == stack[stack.length - 2].split("")[0]) {
            const right = stack.pop();
            const left = stack.pop();
            const newSection = left + right;
            if (newSection.length > currentMaxSection.length) currentMaxSection = newSection;
            stack.push(newSection);
        }
    }

    // return {
    //     currentMaxSection,
    //     length: currentMaxSection.length
    // }
    return currentMaxSection
}

function isSameStr(s) {
    let arr = s.split('')
    for (let i = 1; i < s.length; i++) {
        if (arr[i] !== arr[0]) return false
    }

    return true
}

let s1 = 'a';
let s2 = 'bb';
let s3 = 'aba';
let s4 = 'asdfsafsdfasfsdfefdffffewfe';
let s5 = 'defecbaabc';
let s6 = 'cccc';

// console.log(maxLengthStr(s1))
// console.log(maxLengthStr(s2))
// console.log(maxLengthStr(s3))
// console.log(maxLengthStr(s4))
// console.log(maxLengthStr(s5))
console.log(maxLengthStr(s6))
// console.log(s1.split(''))

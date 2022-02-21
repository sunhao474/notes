# summary

---

1.[实现一个函数，简写连续的数字](#1)  


---

<a id="1">实现一个函数，简写连续的数字</a>
我的写法：
```javascript
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
```

拾人牙慧：

```javascript
const nums1 = [1, 2, 3, 5, 7, 8, 10];
function simplifyStr(num) {
  var result = [];
  var temp = num[0]
  num.forEach((value, index) => {
    if (value + 1 !== num[index + 1]) {
      if (temp !== value) {
        result.push(`${temp}~${value}`)
      } else {
        result.push(`${value}`)
      }
      temp = num[index + 1]
    }
  })
  return result;
}
console.log(simplifyStr(nums1).join(','))
```
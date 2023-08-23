# Proxy

由于一个对象不能直接引用另一个对象，需要通过代理对象在这两个对象之间起到中介的作用

## 例1: 代理服务器

由于用户相册模块上传的照片量越来越大，导致服务器端需要将图片上传模块重新部署到另一个域（可以理解为另一台服务器）

- 此时前端请求图片的路径发生了变化，这就导致了跨域问题

这就需要一个中间的代理对象来实现他们之间的通信了

## 例2: 站长统计

简单一点的代理对象例如 img 之类的标签通过 src 属性可以向其他域下的服务器发送请求

- 这类请求是 get 请求，且是单向的，不会有数据响应

一些站长平台对页面的统计项原理就是在页面触发一些动作向站长平台发送这类 img 的 get 请求，他们会对请求做统计，然而你并不知道统计的相关信息。

```ts
// 统计代理
const Count = (function() {
    // 缓存图片
    const image = new Image()
    return function(params: string[]) {
        let str = 'http://xxx.xxx'
        for(const i in params) {
            str += `${i}=${params[i]}`
        }
        // 发送统计请求
        image.src = str
    }
})()

// 测试
Count({num: 10})
```

## 例3: 计算乘机的缓存

缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前端存储的结果。

```ts
// 只专注于计算本身
const mult = function(args: number[]) {
    let result = 1
    for(const val of args) {
        result *= val
    }
    return result
}

// 缓存由代理实现
const multProxy = (() => {
    const cache = {}
    return function(args: number[]) {
        const argsStr = args.join(',')

        if(cache[argsStr]) {
            return cache[argsStr]
        }

        return (cache[argsStr] = mult(args))
    }
})()

// 使用
proxyMult(1, 2, 3); // 6
proxyMult(1, 2, 3); // 6

```

## 参考

[参考](https://tsejx.github.io/javascript-guidebook/design-patterns/structual/proxy/)

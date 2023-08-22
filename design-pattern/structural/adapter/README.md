# Adaptor

适配器模式：将一个类(对象)的接口(方法或者属性)转换成另一个接口以满足用户的需求，使得类(对象)之间接口的不兼容性问题通过适配器得以解决。

**什么是适配器？**

1. 生活中两根方向不同的水管通过直角弯道连接起来，这个直角弯道就是适配器，它使得两个不同方向的水管能够疏通流水
2. 三插转两插的充电转换器
3. 数据转换器

## 例1

以下是一个在线购物车功能，其中 Shipping 对象用来计算运输成本

- 将旧对象换成新的 Shipping 对象后更加安全，价格也有所提高

新的对象命名为 AdvancedShipping ，并且有与客户端程序不同的接口

- ShippingAdapter 通过将旧的 Shipping 接口映射到新的 AdvancedShipping 接口，允许客户端程序在没有改变任何 API 的情况下继续运行

```ts
// 旧的计算成本
function Shipping() {
    this,request = function(zipStart: string, zipEnd: string, weight: number) {
        // ...
        return '50元'
    }
}

// 新的计算成本
function AdvancedShipping() {
    this.login = function (credentials: string) { /* ... */}
    this.setStart = function (start: string) { /* ... */}
    this.setDestination = function (destination: string) { /* ... */}
    this.calculate = function (weight: number) {
        // ...
        return '60元'
    }
}

```

适配器

```ts
// 适配器
function ShippingAdapter (credentials: string) {
    const shipping = new AdvancedShipping()
    shipping.login(credentials)

    return {
        request: function(zipStart: string, zipEnd: string, weight: number) {
            shipping.setStart(zipStart)
            shipping.setDestination(zipEnd)
            return shipping.calculate(weight)
        }
    }
}
```

使用适配器

- 只需要把原先的类替换成适配器即可

```ts

function main() {
    const shipping = new Shipping()
    const credentials = {
        token = '2ae2-a322e'
    }
    const adapter = new ShippingAdapter(credentials)

    // 老运费计算
    let cost = shipping.request('11232', '32213' , 5)

    // 新运费计算
    cost = adapter.request('11232', '32213' , 5)

}
```

## 例2
数据处理
- 将**有序**数组转化成对象
```ts
const var = ['张三', 18, '男']

function arrObjAdapter(arr: Array<any>) {
    return {
        name: arr[0],
        age: arr[1],
        sex: arr[2]
    }
}

// 使用
const adapterData = arrObjAdapter(arr)
```
[参考](https://cloud.tencent.com/developer/article/1694172)

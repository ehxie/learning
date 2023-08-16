# singleton
单例模式：只允许初始化一次的对象类

JavaScript 中单例模式常作为命名空间对象来实现，通过单例可以将各个模块代码井井有条的梳理在一起
```ts
function singleton(classObj: class) {
    let instance = null
    return function () {
        if (!instance) {
            instance = new classObj()
        }
        return instance
    }
} 
```

[更多](https://houbb.github.io/2022/08/28/js-singleton)
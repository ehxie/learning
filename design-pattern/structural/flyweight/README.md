# flyweight

享元模式：运用共享技术有效的支持大量的细粒度对象，避免对象间拥有相同内容造成多余的开销

## 定义

享元模式要求将对象的属性划分为内部状态和外部状态（状态在这里通常指属性），其目标是尽量减少共享对象的数量

![Alt text](/design-pattern/structural/flyweight/assets/image.png)

- Flyweight 是抽象享元角色，为具体享元角色规定了必须实现的方法。
- ConcreteFlyweight 是具体享元角色，实现抽象享元角色定义的方法。
- FlyweightFactory 是享元工厂，负责创建和管理享元角色，它用于构造一个池容器，同时提供从池中获得对象的方法。
- Client 是客户端角色：维护对所有享元对象的引用，而且还需要存储对应的外蕴状态

## 例子

服装厂生产了男女服饰各 50 种，现找来男女各 50 个模特拍照，每人拍一套衣服

```ts
// 模特类
class Modal {
    constructor(name: string, gender: string, clothes: string) {
       this.name = name
       this.gender = gender
       this.clothes = clothes 
    }

    takePhoto() {
        console.log(`模特${this.name}(${this.gender})穿${this.clothes}拍照`)
    }
}
```

拍照

```ts
for(let i = 0; i < 50; i++) {
    const manModal = new Modal(`李${i}`, '男', `衣服${i}`)
    manModal.takePhoto()
}
for(let i = 50; i < 100; i++) {
    const manModal = new Modal(`张${i}`, '女', `衣服${i}`)
    manModal.takePhoto()
}
```

以上的实现出现的问题很明显，如果照这个方式继续下去，成本(内存)就太高了

享元模式就可以帮助我们解决这个问题：划分内部状态和外部状态

- 内部状态存储于对象的内部
- 内部状态可以被一些对象共享
- 内部状态独立于具体的场景，通常不会改变
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

其实针对拍照需求，我们其实可以只请男女各一个模特就可以完成

- 对于模特对象来说性别是内部状态，衣服是外部状态

```ts
// 享元对象
class Modal {
    constructor(id: string, gender: string) {
       this.id = id
       this.gender = gender
    }
}

// 享元工厂
class ModalFactory {
    // 单例模式
    static create(id: number, gender: string) {
        if(this[id]) {
            return this[id]
        }
        return this[id] = new Modal(id, gender)
    }
}

// 管理外部状态
class TakeClothesManager {
    // 添加衣服款式
    static addClothes(id: number, gender: string, clothes: string) {
        const modal = new Modal(id, gender)
        this[id] = {
            clothes,
            modal
        }
    }
    static takePhoto(id: number) {
        const obj = this[id]
        console.log(`模特${obj.modal.id}(${obj.modal.gender})穿${obj.clothes}拍照`)
    }
}
```

```ts
// 使用
for(let i = 0; i < 50; i++) {
    TakeClothesManager.addClothes(1, '男', i)
    TakeClothesManager.takePhoto(i)
}
for(let i = 50; i < 100; i++) {
    TakeClothesManager.addClothes(2, '女', i)
    TakeClothesManager.takePhoto(i)

}
```

## 总结

享元模式会带来性能的提升，但是代码复杂度也随之提升了

当能够把大多数状态都变成外部状态，且程序中使用了大量相似的对象时（造成了很大的内存占用）时，使用享元模式是比较好的

- 反之可能由于这种设计模式带来 factory 和 manager 对象的开销可能也没什么优化，反而增加了代码复杂度

## 参考

<https://juejin.cn/post/6844903697990811661>

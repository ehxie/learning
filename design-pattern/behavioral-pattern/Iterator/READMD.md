# Iterator

迭代器模式：在不暴露集合底层表现形式(列表、栈或树等)的情况下遍历集合中所有的元素

## 例子

### 问题

集合是编程中最常使用的数据类型之一，不过集合只是一组对象的容器而已
![Alt text](/design-pattern/behavioral-pattern/Iterator/assets/image.png)

大部分集合使用简单列表存储元素，但有的集合会使用栈，树，图等其他复杂的数据结构

- 无论集合的构成方式如何，它都必须提供某种访问元素的方式，以便于其他代码使用其中的元素
- 如果今天需要用 DFS 来遍历，明天需要 BFS，下周又需要其他方式，这种不断向集合中添加遍历算法会模糊其「高效存储数据」的主要职责
  - 如果算法是根据特定应用定制的，将其加入泛型集合类中又会显得很奇怪
- 用户的客户端代码并不关心数据的存储方式，如果是由于集合提供的不同的访问方式，那客户端的代码不得不与特定集合类进行耦合

### 解决

迭代器模式：将集合的遍历行为抽取为单独的迭代器对象

- 除了实现自身的算法之外，迭代器还封装了遍历操作的所有细节，例如当前位置和末尾剩余元素的数量
  - 多个迭代器可以在互相独立的情况下同时访问集合
- 迭代器必须实现相同的接口，这样依赖客户端就能够兼容任何类型的集合或遍历算法
![Alt text](/design-pattern/behavioral-pattern/Iterator/assets/image1.png)

## 结构

![Alt text](/design-pattern/behavioral-pattern/Iterator/assets/image2.png)

## 代码示例

此示例迭代器模式用于遍历一个封装了访问微信好友关系功能的特殊集合

- 该集合提供使用不同方式遍历档案资料的多个迭代器
![Alt text](/design-pattern/behavioral-pattern/Iterator/assets/image3.png)

「好友(friends)」迭代器可用于遍历指定档案的好友
「同事(colleagues)」迭代器也提供了和好友迭代器一样的功能，但仅包括与目标用户在同一家公司工作的好友
> 以上两个迭代器都实现了同一个通用接口，客户端能在不了解认证和发送 REST 请求等实现细节的情况下获取档案

客户端代码仅通过接口与集合和迭代器交互，也就不会与具体类耦合

- 如果希望将应用连接到全新的社交网络，只要提供新的集合和迭代器类即可，无需修改现有代码

```ts
// 集合接口必须声明一个用于生成迭代器的工厂方法
// 如果程序中有不同类型的迭代器，可以声明多个方法
interface SocialNetwork {
    createFriendsIterator(profileId: string): ProfileIterator
    createCoworkersIterator(profileId: string): ProfileIterator
}

// 每个具体集合都与其返回的一组具体迭代器相耦合
// 但客户端不是这样的，因为这些方法的签名将会返回迭代器接口
class WeChat implements SocialNetwork {
    createFriendsIterator(profileId) {
        return new WeChatIterator(profileId, 'friends')
    },
    createCoworkersIterator(profileId) {
        return new WeChatIterator(profileId, 'coworkers')
    }
}

// 所有迭代器的通用接口
interface ProfileIterator {
    getNext: () => Profile
    hasMore: () => boolean
}

// 具体迭代器类
class WeChatIterator implements ProfileIterator {
    // 迭代器需要一个指向其遍历集合的引用
    private weChat: WeChat
    private profileId: string
    private type: string

    // 迭代器对象会独立于其他迭代器对象来对集合进行遍历，因此它必须保存迭代器的状态
    private currentPosition: number
    private cache: Profile[]
    

    constructor(weChat: WeChat, profileId: string, type: string) {
        this.weChat = weChat
        this.profileId = profileId
        this.type = type
    }

    lazeInit() {
        if(cache === null) {
            cache = this.weChat.socialGraphRequest(this.profileId, this.type)
        }
    }

    getNext() {
        if(this.hasMore()) {
            const result = this.cache[this.currentPosition]
            this.currentPosition++
            return result
        }
    }
    hasMore() {
        lazeInit()
        return this.currentPosition < this.cache.length
    }
}

// 这里还有一个绝招，可以将迭代器传递给客户端类，无需让其拥有访问整个集合的权限，这样一来，就无需将集合暴露给客户端了
// 另外还有一个好处，可以在运行时将不同的迭代器传递给客户端，从而改变客户端与集合互动的方式，这一方法可行的原因是客户端代码并没有和具体迭代器类相耦合
class SocialSpammer {
    send(iterator: ProfileIterator, message: string) {
        while(iterator.hasMore()) {
            profile = iterator.getNExt()
            System.sendEmail(profile.getEmail(), message)
        }
    }
}

```

## 适用场景

当集合背后为复杂的数据结构， 且你希望对客户端隐藏其复杂性时 （出于使用便利性或安全性的考虑）

- 迭代器封装了与复杂数据结构进行交互的细节， 为客户端提供多个访问集合元素的简单方法。 这种方式不仅对客户端来说非常方便， 而且能避免客户端在直接与集合交互时执行错误或有害的操作， 从而起到保护集合的作用。

可以减少程序中重复的遍历代码

- 重要迭代算法的代码往往体积非常庞大。 当这些代码被放置在程序业务逻辑中时， 它会让原始代码的职责模糊不清， 降低其可维护性

希望代码能够遍历不同的甚至是无法预知的数据结构

- 该模式为集合和迭代器提供了一些通用接口。 如果你在代码中使用了这些接口， 那么将其他实现了这些接口的集合和迭代器传递给它时， 它仍将可以正常运行。

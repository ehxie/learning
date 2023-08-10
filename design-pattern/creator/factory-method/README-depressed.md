# Factory method

别名：虚构造器（Virtual Constructor）

## 意图

定义一个用于创建对象的接口，让子类决定实例化哪一个类

- 使一个类的实例化延迟到其子类

## 动机

框架使用抽象类定义和维护对象之间的关系。这些对象的创建通常也由框架负责

考虑这样一个应用框架，它可以向用户显示多个文档。

- 两个主要的抽象类：Application 和 Document，客户必须通过子类来做具体引用相关实现。
- 例如：为创建一个绘图应用，定义了 DrawingApplication 和 DrawingDocument。
  - Application 类负责管理 Document 并根据需要创建它们，例如，用户从菜单中选择 Open 或 New 的时候
  - 因为被实例化的特定子类 Document 是与特定应用相关的，所以 Application 类不可能预测到哪个子类被实例化。Application 类仅知道一个新的文档何时被创建，而不知道哪一种 Document 将被创建。
  - 这就造成了一个尴尬的局面：框架必须实例化类，但是它只知道不能被实例化的抽象类

Factory Method 提供了一个解决方案

- 封装了 Document 子类将被创建的信息从该框架中分离出来
  - Application 的子类重定义 Application 的抽象操作 CreateDocument 以返回适当的 Document 子类对象。
    - 一旦一个 Application 子类实例化后，它就可以实例化与应用相关的文档，而无需知道这些文档的类.我们称 CreateDocument 是一个工厂方法（Factory Method），因为它负责生产一个对象。
![lj](/design-pattern//creator//factoru-method//README.assert/image.png)

## 适用性

1. 一个类不知道它所必须创建的对象的类的时候
2. 当一个类希望由它的子类来指定它所创建的对象时
3. 当类将创建对象的职责委托给多个帮助子类中的某一个，并且你希望将哪一个子类是代理者这一信息局部化的时候。

## 结构

![Alt text](/design-pattern//creator//factoru-method//README.assert/image1.png)

## 参与者

Product

- 定义工厂方法所创建的对象的接口

ConcreteProduct

- 实现 Product 接口

Creator

- 声明工厂方法，该方法返回一个 Product 类型的对象。Creator 也可以定义一个工厂方法的缺省实现，它返回一个缺省的 ConcreteProduct 对象
- 可以调用工厂方法以创建一个 Product 对象

ConcreteCreator

- 重定义工厂方法以返回一个 ConcreteProduct实例

## 协作

Creator 依赖于它的子类来定义一工厂方法，所以它返回一个适当的 ConcreteProduct 示例

## 效果

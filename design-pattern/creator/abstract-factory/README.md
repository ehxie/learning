# Abstract Factory

> 对象创建型模式

## 意图

- 提供一个创建一系列相关或互相依赖对象的接口，而无需指定它们具体的类

## 适用性

- 一个系统要独立于它的产品的创建、组合和表示时

- 一个系统要由多个产品系列中的一个来配置时

- 当你要强调一系列相关的产品对象的设计以便进行联合使用时

- 当你提供一个产品类库，而只想显示它们的接口而不是实现时

## 结构

![Alt text](/design-pattern/README.asserts/image1.png)

## 参与者

- AbstractFactory：声明一个创建抽象产品对象的操作接口
- ConcreteFactory：实现创建具体产品对象的操作
- AbstractProduct：为一类产品对象声明一个接口
- ConcreteProduct：定义一个将被相应的具体工厂创建的产品对象（实现 AbstractProduct 接口）
- Client：仅使用由 AbstractFactory 和 AbstractProduct 类声明的接口

## 协作

- 通常在运行时创建一个 ConcreteFactory 类的实例。这一具体的工厂创建具有特定实现的产品对象。为创建不同的产品对象，客户应使用不同的具体工厂。

- AbstractFactory 将产品对象的创建延迟到它的 ConcreteFactory 子类

# 优缺点

1. 分离了具体的类：AbstractFactory 模式帮助你控制一个应用创建的对象的类。

- 因为一个工厂封装创建产品对象的职责和过程，它将客户与类的实现分离
- 客户通过它们的抽象接口操纵实例
- 产品的类名也在具体的工厂实现中被分离，它们不出现在客户代码中

2. 使得易于交换产品系列

- 一个具体的工厂类在一个应用中仅出现一次（即初始化的时候）。这使得改变一个应用的具体工厂变得很容易，只需改变具体的工厂即可使用不同的产品配置，因为在一个抽象工厂创建了一个完整的产品系列，所以整个产品系列会立即改变

3. 有利于产品一致性

- 当一系列中的产品对象被设计成一起工作时，一个应用一次只能使用同一个系列中的对象

4. 很难支持新种类的产品：难以扩展抽象工厂以生产新的种类的产品

- AbstractFactory 接口确定了可以被创建的产品的集合。支持新种类的产品就需要扩展该工厂接口，这将涉及 AbstractFactory 类及其所有子类的改变

## 实现

1. 将工厂视为单件：一个应用中一般每个产品系列中需一个 ConcreteFactory 的实例

- 工厂的实现最好是一个 Singleton

2. 创建产品：AbstractFactory 仅声明一个创建产品的接口，真正创建产品是由 ConcreteProduct 子类实现的。

- 最通常的一个办法是为每一个产品定义一个工厂方法，一个具体的工厂将为每个产品重新定义该工厂方法以指定产品
  - 虽然这样实现很简单，但它要求每个产品系列都要有一个新的具体工厂子类，即使这些产品系列的差别很小
  - 如果有多个可能的产品系列，具体工厂也可以使用 Prototype 模式实现。具体工厂使用产品系列中每一个产品的原型实例来初始化，且它通过复制它的原型了来创建新的产品（基于原型方法，使得不是每个新的产品系列都需要一个新的具体工厂类）

3. 定义可扩展的工厂

- AbstractFactory 通常为每一种它可以生产的产品定义一个操作。产品的种类被编码在操作型构中，增加一中新的产品要求改变 AbstractFactory 的接口以及所有与它相关的类
  - 一个灵活但不太安全的设计：给创建对象的操作增加一个参数，该参数指定了将被创建的对象的种类（可以是类标识符，一个整数，一个字符串等等）

## 代码示例

[Abstract Factory Maze](/design-pattern//creator//abstract-factory/maze.ts)

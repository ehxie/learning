# Builder(生成器)

## 意图

将一个复杂对象的构件与它的表示分离，使得同样的构件过程可以创建不同的表示

## 适用性

- 在创建复杂对象的算法应独立于该对象的组成部分以及它们的装配方式时

- 当构造过程必须允许被构造的对象有不同的表示时

## 结构

![Alt text](/design-pattern//creator//builder/README.assert/image.png)

## 参与者

- Builder
  - 为创建一个 Product 对象的各个部件指定抽象接口
- ConcreteBuilder
  - 实现 Builder 的接口以构造和装配该产品的各个部件
  - 定义并明确它所创建的表示
  - 提供一个检索产品的接口
- Director
  - 构造一个使用 Builder 接口的对象
- Product
  - 表示被构造的复杂对象。ConcreteBuilder 创建该产品的内部表示并定义它的装配过程
  - 包含定义组成部件的类，包括将这些部件装配成最终产品的接口

## 协作

- 客户创建 Director 对象，并用它所想要的 Builder 对象进行配置
- 一旦产品部件被生成，导向器就会通知生成器
- 客户从生成器中检索产品
![Alt text](/design-pattern//creator//builder/README.assert/image1.png)

## 效果

1. 它使你可以改变一个产品的内部表示：Builder 对象提供给向导器一个构造产品的抽象接口

- 这个接口使得生成器可以隐蔽这个产品的表示和内部结构，同时也隐藏了该产品是如何装配的
- 因为产品是通过抽象接口构造的，在改变产品的内部结构表示时所要做的只是定义一个新的生成器

2. 它将构造代码和表示代码分开：Builder 模式通过封装一个复杂对象的创建和表示方式提高了对象的模块性

- 客户不需要知道定义产品内部结构的类的所有信息，这些类是不出现在 Builder 接口中的
- 每个 ConcreteBuilder 包含了创建和装配一个特定产品的所有代码，这些代码只需要写一次，然后不同的 Director 可以复用它以在相同部件集合的基础上够作不同的 Product

3. 它使你可对构造过程进行更精细的控制：Builder 模式与一下子就生成产品的创建模式不同，它是在向导者的控制下一步一步构造产品的

- 仅当该产品完成时向导者才从生成器中取回它
- 因为 Builder 接口相比其他创建型模式能更好的反映产品的构造过程，使得可以更加爱解析的控制构件过程，从而更加精细的控制所得产品的内部结构

## 实现

通常有一个抽象的 Builder 类为导向者可能要求创建的每一个构件定义一个操作，这些操作缺省情况下什么都不做。一个 ConcreteBuilder 类对它有兴趣的构件重新定义这些操作

其他需要考虑的实现问题

1. 装配和构造接口：生成器逐步的构造它们的产品，因此 Builder 类必须足够普遍，以便于为各种类型的具体生成器构造产品

- 一个关键的设计问题在于构造和装配过程的模型。构造请求的结果只是被添加到产品中
- 有时需要访问前面已经构造的产品部件，例如 MazeBuilder 接口允许你在已经存在房间之间增加一扇门
- 像语法分析树这样自底向上构件的树型结构就是另一个例子，生成器会将子节点返回给向导者，然后向导者将他们回传给生成器请创建父节点

2. 为什么产品没有抽象类

- 通常情况下，由具体生成器生成的产品，它们的表示相差是非常大的，所以给不同产品添加公共父类没有太大意义

3. 在 Builder 中缺省的方法为空

- 客户只重定义他们感兴趣的操作，其他方法是空函数即可

## 代码示例

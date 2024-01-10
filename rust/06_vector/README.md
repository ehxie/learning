# 常用的集合

这里介绍存储在 heap 上的数据（即无需在编译时确定大小）

## Vector

### 基础

定义：Vec<T>

- 由标准库提供
- 可存储多个值
- 只能存储相同类型的数据
- 值在内存中连续存放

创建：

- 方式一：Vec::new 函数
- 方式二：使用初始值创建 Vec<T>，使用 vec! 宏

```rust
fn main() {
  // 方式一：
  let v1: Vec<i32> = Vec::new();

  // 方式二：
  // 会自动推断类型
  let v2 = vec![1, 2, 3];
}
```

更新

- 因为地址是连续的，新增后如果内存不够了就会找一块更大的内存

```rust
fn main() {
  let mut v = Vec::new();

  // 这样上面都不需要写类型了
  v.push(1);
}

```

删除

- 与其他 struct 一样，当 Vector 离开作用域后
  - 它就被清掉了
  - 它所有的元素也被清掉了

读取 Vector 的元素

- 两种方式可以引用 Vector 里的值
  - 索引(超出范围在运行时会 panic)
  - get 方法(返回 Option<T>)

```rust
fn main() {
  let v = vec![1, 2, 3, 4, 5];
  let third: &i32 = &v[2];
  println!("third of v: {}", third);

  match v.get(2) {
    Some(third) => println!("match: {}", third),
    None => println!("no match"),
  }
}

```

遍历

```rust
fn main() {
  let v = vec![1, 2, 3, 4, 5];

  for i in &v {
    println!("{}", i);
  }


  // 也可以修改
  let mut v1 = vec![1, 2, 3, 4, 5];

  for i in &mut v {
    // 需要解引用
    *i += 50;
  }
}
```

### 所有权和借用规则

不能在同一作用域内同时拥有可变和不可变引用

```rust
fn main() {
  let mut v = vec![1, ,2 ,3, 4, 5];
  let first = &v[0];
  v.push(6); // 这一行报错了
  // 为什么不行？
  // Vector 是连续存放的，如果新增了之后内存不够了会找一块更大的，原来的地址就释放了，此时 first 还指向原来的位置，所以就不对了
}
```

### 存储多种数据

使用 Enum 来存储多种数据类型

- Enum 的变体可以附加不同类型的数据
- Enum 的变体定义在同一个 enum 类型下

```rust
enum SpreadSheetCell {
  Int(i32),
  Float(f64),
  Text(String),
}

fn main() {
  let row = vec![
    SpreadSheetCell::Int(3),
    SpreadSheetCell::Text(String::from("blue")),
    SpreadSheetCell::Float(10.12),
  ]
}
```

## String

字符串是什么

- Byte 的集合
- 一些方法
  - 能将 byte 解析为文本
- rust 的**核心语言层面**，只有一个字符串类型：字符串切片(str 或 &str)
  - 字符串切片：对存储在其他地方、UTF-8 编码的字符串的引用
    - 字符串字面值：存储在二进制文件中，也是字符串切片

String 类型

- 来自**标准库**而不是核心语言层面
- 可增长、可修改、可拥有
- UTF-8 编码

rust 中说的字符串通常是指 String 和 &str

> 标准库中还提供了许多其他的字符串类型：OsString、OsStr、CString、CStr
>
> - String 结尾的可获得所有权的
> - Str 结尾的是可借用的
> - 可存储不同编码的文本或在内存中以不同的形式展现

### 基础使用

**创建 String**

- 很多 Vec<T> 的操作都可用于 String
- String::new() 函数
- 使用初始值来创建
  - to_string() 方法，可用于实现了 Display trait 的类型，包括字符串字面值
- String::from()

```rust
fn main() {
  let mut s = String::new();

  let s1 = "initial contents".to_string();
}
```

**更新 String**

- push_str() 方法：把一个字符串切片附加到 String
- push() 方法：添加单个字符
- 拼接字符串：`+`
  - 使用了类似这个签名的方法：fn add(self, s: &str) -> String {}
- format!

```rust
fn main() {
  let mut s = String::from("foo");
  s.push_str("bar");

  s.push('l');

  let s1 = String::from("hello");
  // 第二个参数要求是字符串切片(这里是 String 类型的引用, rust 使用了解引用强制转换(deref coercion), 把 String 的引用转换成了字符串切片)
  let s3 = s1 + &s2

  // println!("{}", s1); 不能继续使用 s1
  println!("{}", s2); // 可以继续使用
}
```

e.g.: format

```rust
fn main() {
  let s1 = String::from("hello");
  let s2 = String::from("world");
  let s3 = String::from("rust");

  // 拼接
  // let s = s1 + "-" + &s2 + "-" + &s3;

  // 等同于: 但不会取得参数的所有权
  let s = format!("{}-{}-{}", s1, s2, s3);

}
```

**访问**

- 不支持按索引访问：即 s[0]
  - String 的内部表示：Vec<u8> 的包装
    - 正常一个英文单词是一个字节(UTF-8)，但是中文是三个字节(Unicode 标量值)，中文的"好"的编码是 [229, 165, 189](可以调用 bytes() 方法转换后输出)，那么 s[0] 拿到的值就是 208，这就有问题了
  - 索引操作消耗一个常量时间 O(1)
    - String 无法保证：需要遍历所有内容，来确定有多少个合法的字符

rust 看待字符串的方式：

- 字节(bytes)
- 标量值(Scalar Values)
- 字形簇(Grapheme Clusters): 最接近所谓的"字母"

```rust
fn main() {
  let s = String::("好好好");

  s.bytes(); // 字节码
  s.chars(); // unicode 标量值
  // 获取字形簇比较复杂，标准库没有提供，可以找第三方库
}
```

**切割 String**

使用 [] 和一个范围来创建字符串的切片

```rust
fn main() {
  let s = String::("好好好");

  let r = &s[0..4]; // 好
  // let r = &s[0..3]; // panic 了，因为一个中文三个字节，这里切了两
}
```

> String 比较复杂
>
> - rust 选择将正确处理 String 数据作为所有 Rust 程序的默认行为
> - 程序员必须在处理 UTF-8 数据之前投入更多的精力
> - 可以防止在开发后期处理涉及非 ASCII 字符的错误

## HashMap

HashMap\<K, V\>

- 键值对的形式存储数据，一个 Key 对应一个 Value
- 使用 Hash 函数，决定了如何在内存中存放 K 和 V

适用场景

- 通过 K (任何类型)来寻找数据，而不是通过索引

**创建 HashMap**

方式一：

- 创建空的 HashMap: new() 函数
- 添加数据：insert() 方法

> 用的比较少，所以不在 Prelude 中
> 标准库对其支持比较少，没有内置的宏来创建 HashMap
> 数据存储在 heap 上
> 同构的：即在一个 HashMap 中，key 必须是同一种类型，value 也必须是同一种类型

```rust
use std::collections::HashMap;

fn main() {
  let mut scores<String, i32> = HashMap::new();

  scores.insert(String::from("Blue"), 10);
}
```

方式二：

- collect 方法

在元素类型为 Tuple 的 Vector 上使用 collect 方法，可以组件一个 HashMap

- 要求 Tuple 有两个值：一个作为 K，一个作为 V
- collect 方法可以把数据整合成很多种集合类型，包括 HashMap
  - 返回值需要显示指明类型

```rust
use std::collections::HashMap;

fn main() {
  let teams = vec![String::from("blue"), String::from("Yellow")];
  let initial_scores = vec![10, 50];

  // 使用 zip 创建元组
  // 因为能够推到类型，所以这里可以使用下划线
  // 由于 collect 返回类型很多必须明确声明，所以这里必须写
  let scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();
}
```

**访问**

- get 方法
  - 参数：K
  - 返回：Option<&V>

```rust
use std::collections::HashMap;

fn main() {
  let mut scores = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);

  let team_name = String::from("Blue");
  let score = scores.get(&team_name);

  match score {
    Some(s) => println!("{}", s),
    None => println("team not exist"),
  }

}
```

**遍历**

- for 循环

```rust
use std::collections::HashMap;

fn main() {
  let mut scores = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);

  for (k, v) in &scores {
    println!("{}: {}", k, v);
  }
}
```

**更新**

- 如果两个 k 相同，后面插入的会覆盖前面的
- 可以使用 entry() 判断 k 是否已经存在
  - 返回 enum Entry
- Entry 的 or_insert() 方法
  - 返回
    - k 存在，返回 v 的可变引用
    - k 不存在，插入后返回可变引用

```rust
use std::collections::HashMap;

fn main() {
  let mut scores = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);

  // 如果 key 为空则会插入
  scores.entry(String::from("Blue")).or_insert(20);
}
```

```rust
use std::collections::HashMap;

fn main() {
  let text = "hello world wonderful world";

  let mut map = HashMap::new();

  for word in text.split_whitespace() {
    let count = map.entry(word).or_insert(0);
    // 因为返回的是可变引用，所以可以解引用后修改值
    *count += 1;
  }

  // 打印单词出现的次数
  println!("{:#?}", map);
}
```

### 所有权

- 对应实现了 Copy trait 的类型(例如 i32)，值会被复制到 HashMap 中
- 对于拥有所有权的值(例如 String)，值会被移动，所有权会转移给 HashMap
  - 如果将值的引用插入到 HashMap，值本身不会移动(HashMap 有效的期间内，被引用的值必须保持有效)

### hash 函数

默认情况下，HashMap 使用加密功能强大的 Hash 函数，可以抵抗拒绝服务(DDos)攻击

- 不是可用的最快的 Hash 算法
- 但具有更好安全性

可以指定不同的 hasher 来切换到另一种函数

- hasher 是实现 BuildHasher trait 的类型

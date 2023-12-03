# Introduction

Flutter 使用 Widgets 来构建用户界面(Flutter 的 Widgets 受到了 React 的启发 UI=f(state, context))。Widgets 长什么样就和此刻的 configuration 和 state 有关，当 state 改变时，就会重新构建 Widgets，而 framework 就会将新旧 Widgets 进行 diff，找到最小差异，然后进行最小差异的更新。

## Hello World

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    const Center(
      child: Text(
        'Hello World',
        textDirection: TextDirection.ltr,
      )
    )
  )
}
```

- runApp 函数是 Flutter 的入口函数，它接收一个 Widget 作为参数（Widget 树的根节点）。
- framework 会强制将 Widget 根节点覆盖整个屏幕，即上面的的 `Hello World` 会在屏幕中间居中显示。

在写 Flutter 时通常都会创建自己的 Widget，这个 Widget 通常继承自 StatelessWidget 或者 StatefulWidget，它们分别代表无状态和有状态的 Widget。（这取决于是否需要维护 state）

- Widget 的主要工作是实现 build，该函数从其他低级别的 Widget 的角度描述该 Widget。framework 会依次构建这些 Widget 直到结束，最终会得到 RenderObject (描述了 Widget 的几何形状和位置)

## Basic Widgets

Text

- 用于显示文本

Row, Column

- 这些是 Flex 布局的 Widget(基于 Web 的 FlexBox 设计的)，它们会根据主轴和交叉轴来布局子 Widget

Stack

- 用 stack 包起来的组件不会按照线性方向进行布局，而是会根据 z-index 进行布局，在下面的元素高度就越高

Container

- 容器小部件允许您创建矩形视觉元素。容器可以用 BoxDecoration 装饰，例如背景、边框或阴影。容器还可以对其大小应用边距、填充和约束。此外，容器可以使用矩阵在三维空间中进行变换。

## Material Widgets

Flutter 提供了`Materials`库，它提供了 Material Design 风格的组件。

- Material 的 Widget 都需要在 MaterialApp 中使用

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(
    const MaterialApp(
      title: 'Flutter Tutorial',
      home: TutorialHome(),
    ),
  );
}

class TutorialHome extends StatelessWidget {
  const TutorialHome({super.key});

  @override
  Widget build(BuildContext context) {
    // Scaffold is a layout for
    // the major Material Components.
    return Scaffold(
      appBar: AppBar(
        leading: const IconButton(
          icon: Icon(Icons.menu),
          tooltip: 'Navigation menu',
          onPressed: null,
        ),
        title: const Text('Example title'),
        actions: const [
          IconButton(
            icon: Icon(Icons.search),
            tooltip: 'Search',
            onPressed: null,
          ),
        ],
      ),
      // body is the majority of the screen.
      body: const Center(
        child: Text('Hello, world!'),
      ),
      floatingActionButton: const FloatingActionButton(
        tooltip: 'Add', // used by assistive technologies
        onPressed: null,
        child: Icon(Icons.add),
      ),
    );
  }
}

```

需要将 `pubspec.yaml` 中设置一个属性，才能使用 Material 库的 icon

```yaml
flutter:
  uses-material-design: true
```

## Gesture

处理手势事件就需要使用 GestureDetector

## 管理 state

```dart
import 'package:flutter/material.dart';

class Counter extends StatefulWidget {
  // This class is the configuration for the state.
  // It holds the values (in this case nothing) provided
  // by the parent and used by the build  method of the
  // State. Fields in a Widget subclass are always marked
  // "final".

  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      // This call to setState tells the Flutter framework
      // that something has changed in this State, which
      // causes it to rerun the build method below so that
      // the display can reflect the updated values. If you
      // change _counter without calling setState(), then
      // the build method won't be called again, and so
      // nothing would appear to happen.
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called,
    // for instance, as done by the _increment method above.
    // The Flutter framework has been optimized to make
    // rerunning build methods fast, so that you can just
    // rebuild anything that needs updating rather than
    // having to individually changes instances of widgets.
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        ElevatedButton(
          onPressed: _increment,
          child: const Text('Increment'),
        ),
        const SizedBox(width: 16),
        Text('Count: $_counter'),
      ],
    );
  }
}

void main() {
  runApp(
    const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Counter(),
        ),
      ),
    ),
  );
}
```

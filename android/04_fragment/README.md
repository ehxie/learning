# Fragment

为了能够兼容手机和平板，Android 在 3.0 版本引入了 Fragment

- Fragment 是一种可以嵌套在 Activity 中的 UI 片段，可以理解为一个迷你的 Activity

## 使用

> 首先需要在 Android Studio 中创建一个平板模拟器(Pixel C)

### 简单使用

1.先创建两个 fragment 布局文件

`left_fragment.xml`

- 只有一个按钮，并且水平居中

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <Button
        android:id="@+id/button"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:text="Button"/>
</LinearLayout>
```

`right_fragment.xml`

- 布局的背景色为绿色，并且有一个文本

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:background="#00ff00"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:textSize="24sp"
        android:text="This is right fragment"/>
</LinearLayout>
```

2.创建两个 fragment 类

注意：这里继承的是 AndroidX 库中的 Fragment，而不是 Android 原生的 Fragment(这里在 9.0 版本中已经废弃了)，AndroidX 中的 Fragment 在所有 Android 版本中保持一致

`LeftFragment.kotlin`

```kotlin
class LeftFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.left_fragment, container, false)
    }
}
```

`RightFragment.kotlin`

```kotlin
class RightFragment : Fragment(){
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.right_fragment, container, false)
    }
}
```

3.修改 activity_main.xml 文件

- 需要用 name 属性来指定 fragment 的类名

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <fragment
        android:id="@+id/leftFrag"
        android:name="com.example.fragmenttest.LeftFragment"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"/>
    <fragment
        android:id="@+id/rightFrag"
        android:name="com.example.fragmenttest.RightFragment"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"/>
</LinearLayout>
```

运行

![Alt text](/android/04_fragment/assets/image1.png)

以上只是最简单的使用还看不出 Fragment 有什么实际的作用

### 动态添加 Fragment

fragment 的强大之处在于可以动态添加

新建 `another_right_fragment.xml` 文件

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:background="#ffff00"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal"
        android:textSize="24sp"
        android:text="This is anther right fragment"/>
</LinearLayout>
```

新建 `AnotherRightFragment.kotlin` 文件

```kotlin
class AnotherRightFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.another_right_fragment, container, false)
    }
}
```

修改 `activity_main.xml` 文件

- 右侧的 Fragment 改为 FrameLayout(Android 中最简单的布局，控件默认都放在左上角)

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <fragment
        android:id="@+id/leftFrag"
        android:name="com.example.fragmenttest.LeftFragment"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"/>
    <FrameLayout
        android:id="@+id/rightLayout"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"/>
</LinearLayout>
```

修改 `MainActivity.kt` 文件，实现动态添加 Fragment

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.button)
        button.setOnClickListener {
           replaceFragment(AnotherRightFragment())
        }
        replaceFragment(RightFragment())
    }

    private fun replaceFragment(fragment: Fragment) {
        val fragmentManager = supportFragmentManager
        val transaction = fragmentManager.beginTransaction()
        transaction.replace(R.id.rightLayout, fragment)
        transaction.commit()
    }
}
```

动态添加 Fragment 分为 5 步

- 创建待添加的 Fragment 实例
- 获取 FragmentManager（Activity 中可以直接通过 getSupportFragmentManager() 获取）
- 开启一个事务，通过调用 beginTransaction() 方法开启
- 向容器内添加或替换 Fragment，一般使用 replace() 方法实现，需要传入容器的 id 和待添加的 Fragment
- 提交事务，调用 commit() 方法

### 在 Fragment 中实现返回栈

在上面的动态添加 Fragment 例子中，点击按钮后，会替换掉原来的 Fragment，但是当点击返回键时，会直接退出应用

- 如果要实现类似于返回栈的效果，该如何实现？

其实很简单，FragmentTransaction 提供了 `addToBackStack()` 方法，可以将一个事务添加到返回栈中

修改 `MainActivity.kt` 文件

```kotlin
class MainActivity : AppCompatActivity() {
    // ...
    private fun replaceFragment(fragment: Fragment) {
        val fragmentManager = supportFragmentManager
        val transaction = fragmentManager.beginTransaction()
        transaction.replace(R.id.rightLayout, fragment)
        // 添加到返回栈中，需要传入一个名字用于描述返回栈状态，一般传入 null
        transaction.addToBackStack(null)
        transaction.commit()
    }
}
```

再次运行就可以发现点击返回键时，会回到上一个 Fragment

### Fragment 和 Activity 交互

虽然 Fragment 是嵌套在 Activity 中的，但是两个都是各自的一个类，它们之间也并没有直接交互的的方法

#### Activity 中调用 Fragment 的方法

- 为了方便交互，FragmentManager 提供了一个类似于 findViewById 的方法专门用于在父布局中获取 Fragment 实例，即 `findFragmentById()`

```kotlin
val fragment = supportFragmentManager.findFragmentById(R.id.leftFrag)
```

可以使用 `kotlin-android-extensions` 插件简化代码，允许我们直接使用 fragmentId 名称自动获取 Fragment 实例，即 `leftFrag`

```kotlin
val fragment = leftFrag as LeftFragment
```

#### Fragment 中调用 Activity 的方法

- Fragment 中调用 Activity 的方法，可以使用 `getActivity()` 方法获取 Activity 实例

```kotlin
// 有可能是 null
if(activity != null) {
    val mainActivity = activity as MainActivity
}
```

#### 不同 Fragment 之间通信

- 可以通过 Activity 实现通信

## Fragment 生命周期

Fragment 的生命周期和 Activity 类似

### Fragment 的状态和回调

1.运行状态：Fragment 所关联的 Activity 处于运行状态，Fragment 也处在运行状态

2.暂停状态：当一个 Activity 处于暂停状态时(由于另一个未占满屏幕的 Activity 被添加到了栈顶)，与它相关联的 Fragment 也会进入暂停状态

3.停止状态：当一个 Activity 处于停止状态时，与它相关联的 Fragment 也进入停止状态；或者通过调用 FragmentTransaction 的 `remove()`、`replace`方法将 Fragment 从 Activity 中移除，但在事务提交前调用了 addToBackStack() 方法，Fragment 也会进入停止状态

- 进入暂停状态的 Fragment 是不可见的，有可能会被系统回收剖

  4.销毁状态：当相关联的 Activity 被销毁时，Fragment 进入销毁状态；或者通过调用 FragmentTransaction 的 `remove()`、`replace()` 方法将 Fragment 从 Activity 中移除，但在事务提交前没有调用 addToBackStack 方法，这时的 Fragment 也会进入销毁状态

Fragment 生命周期相关的回调

- onAttach()：当 Fragment 和 Activity 建立关联时调用
- onCreateView(): 为 Fragment 创建视图(加载布局)时调用
- onActivityCreated()：确保与 Fragment 相关联的 Activity 已经创建完毕时调用
- onDestroyView()：确保与 Fragment 相关联的视图已经销毁时调用
- onDetach()：当 Fragment 和 Activity 解除关联时调用
  ![G](/android/04_fragment/assets/image2.png)

Fragment 中可以通过 onSavaInstanceState() 方法保存状态，因为进入暂停状态的 Fragment 可能会被系统回收，保存下来的状态在 onCrate、onCreateView 和 onActivityCreated 回调中可以获取到

## 动态加载布局的技巧

动态添加 Fragment 的功能很强大，可以解决实际开发中的很多问题，但毕竟只是在一个布局文件中进行一些添加和替换操作。如果程序能够根据设备的分辨率或屏幕大小在运行时决定加载哪个布局，那么可以发挥的空间就更多了

### 使用限定符

如果经常使用平板，那么会发现很多应用都是双页模式（程序会在左侧的面板上显示一个包含子项的列表，在右侧的面板上显示内容），但手机屏幕比较小，就只能显示一页的内容，那么怎样来判断该使用单页还是双页呢，这个时候就需要使用限定符

- 限定符(qualifier)：限定符是 Android 系统根据设备配置信息，自动加载不同分辨率的布局文件

在 `activity_main.xml` 中添加一个 fragment（单页），在 res 目录下新建一个 layout-large 文件夹，将 `activity_main.xml` 复制一份，并新增一个 fragment（双页）

此时运行程序，选择平板时就会显示双页，选择手机时就会显示单页

这里的 large 就是限定符，那些屏幕被认为是 large 的就会自动加载 layout-large 目录下的布局文件

[更多限定符](https://developer.android.com/guide/topics/resources/providing-resources#AlternativeResources)

### 最小宽度限定符

上面的 large 不够具体，我们还可以使用最小宽度限定符，比如在 layout-sw600dp 目录下新建一个 `activity_main.xml` 文件

- 最小宽度限定符：当屏幕的最小宽度大于等于 600dp 时，就会加载 layout-sw600dp 目录，否则加载 layout 目录

## 最佳实践

需求：写一个简易版的新闻应用

我们的开发程序需要提供一个手机版和一个平板版的，如果开发的程序也需要提供两个版本的，那么新增功能和修复 bug 都需要改两个地方

TODO: 后续将源码传到一个仓库中

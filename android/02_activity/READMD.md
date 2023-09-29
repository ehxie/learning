# Activity

## 是什么？

Activity 是安卓的四大组件之一，它是一个可以包含用户界面的组件，主要用于和用户进行交互。

* 一个应用程序可以有零个或者多个 Activity

## 创建一个 Activity

### 初始化

右键包名并创建 Empty Activity

* Generate Layout File 选项：自动为 Activity 创建一个对应的布局文件
* Launcher Activity 选项：设置当前创建的 Activity 为项目的注 Activity
* 语言选择 kotlin

![Alt text](/android/02_activity/assets/image.png)

每个 Activity 都需要重写 onCreate方法，Android Studio 已经帮我们生成了

```kotlin
package com.example.activitylearn

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

class FirstActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }
}
```

### 创建和加载布局

Android 的设计注重逻辑和视图的分离

* 每一个 Activity 都能对应一个布局
  * 布局用来显示界面的内容
1.创建布局
创建 layout目录：右击 app/src/res目录 ---> New ---> Directory，创建一个名为 layout 的目录
* 右键 layout 目录，New ---> Layout resource file，命名为 first_layout，根元素默认选择 LinearLayout
编辑器会创建一个可视化布局编辑器
* 右上角有 Code 和 Design 可以切换编辑模式：XML 或者可视化窗口
![Alt text](/android/02_activity/assets/image1.png)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

拖一个按钮进去后
![Alt text](/android/02_activity/assets/image2.png)

* android:id：给当前元素增加唯一标识符
* android:layout_width="match_parent"：指定元素宽度，这里和父元素一样
* android:layout_height="wrap_content"：指定元素高度，这里是高度刚好能够包含里面内容就好
* android:text：指定元素中显示的内容

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/button1"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Button" />
</LinearLayout>
```

2.在 activity 中加载布局
在 FirstActivity 中新增 setContentView

* 用于加载一个布局，需要传入布局 id
  * 在项目中添加的任何资源文件都会在 R 文件中生成一个相应的资源 id
    * R 文件是由 Android 构建工具自动生成的，用于引用应用程序资源

```kotlin
// ...
class FirstActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // 新增以下代码
        setContentView(R.layout.first_layout)
    }
}
```

### 注册 Activity

所有的 Activity 需要在 AndroidManifest.xml中进行注册才能生效

* 在创建 Activity 时其实编辑器已经帮我们注册了
app/src/main/AndroidManifest.xml中
* 这里 Activity 的 name 为什么是 .FirstActivity，而不是 com.example.activitylean.FirstActivity
  * manifest 标签中已经声明了程序的包名是com.example.activitylean，所以可以省略使用.

![Alt text](/android/02_activity/assets/image3.png)

此时只是注册了 Activity，但是此时程序还是不能运行，因为程序不知道要要启动哪个 Activity
配置主 Activity

* 在 \<activity\> 标签内部加入一下内容
  * 此外，还使用了 android:label 指定了 Activity 中标题栏的内容，标题栏显示在 Activity 的最外部
    * 给主 Activity 指定的 label 还会成为启动器(Launcher)中应用程序显示的名称

![Alt text](/android/02_activity/assets/image4.png)
> 没有声明主 Activity 的程序也是可以正常安装和打开的，只是无法在启动器中看到或者打开这个应用程序，这种程序一般是作为第三方供其他应用在内部进行调用的
确保 SDK 版本和 Java 版本相兼容

* Android、SDK 和 Java 版本兼容情况：<https://juejin.cn/post/7107609858655911949>
* 配置项目 SDK 版本：<https://developer.android.com/studio/publish/versioning?hl=zh-cn#minsdk>
  * 修改 build.gradle中的配置
![Alt text](/android/02_activity/assets/image5.png)
或者使用 cmd + ;
![Alt text](/android/02_activity/assets/image6.png)
运行
![Alt text](/android/02_activity/assets/image7.png)

#### 使用 Toast

```kotlin
// ...
class FirstActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.first_activity)

        // 返回的是继承自 View 的型对象，Kotlin 无法自动推到，所以需要声明
        val button: Button = findViewById(R.id.button1)
        button.setOnClickListener {
            // makeText 创建 Toast 对象，第一个参数的上下文，第二个参数是文本内容，第三个参数是显示时间
            Toast.makeText(this, "You Click Button1", Toast.LENGTH_LONG).show()
        }
    }
}
```

#### 使用 menu

ctrl + o重写方法

```kotlin
class FirstActivity : AppCompatActivity() {
    // ...

    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
//        给当前 Activity 创建菜单，第一个参数是指定资源文件，第二个参数是要把菜单项添加到那个 menu 对象
        menuInflater.inflate(R.menu.main, menu)
//        返回 true 则会显示出来
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when(item.itemId) {
            R.id.add_item -> Toast.makeText(this, "You Click Add", Toast.LENGTH_LONG).show()
            R.id.remove_item -> Toast.makeText(this, "You Click Remove", Toast.LENGTH_LONG).show()
        }
        return true
    }
}
```

#### 销毁 Activity

* 方式一：点击 back
* 方式二：调用 finish

```kotlin
class FirstActivity : AppCompatActivity() {
    // ...
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        button.setOnClickListener {
            finish()
        }
    }
}
```

## Intent

使用 Intent 在 Activity 间穿梭
Intent 是Android 程序中各组件之间进行交互的一种重要方式，它不仅可以指名当前组件想要执行的动作，还可以在不同组件之间传递数据

* Intent 一般可用于启动 Activity、启动 service 以及发送广播等场景
* Intent 大致可分为两种：显式 Intent 和隐式 Intent

### 使用显式 Intent

在上面的基础上新建一个SecondActivity(选择 Empty Activity，勾选 layout 但不要选 launch)
Intent 有多个构造函数的重载

* 其中一个是 Intent(Context packageContext, Class<?> cls)，通过这个构造函数就可以构建出 Intent 的意图
  * 第一个参数：一个启动 Activity 的上下文
  * 第二个参数 Class 用于指定想要启动的目标 Activity
如何使用 Intent
* Activity 类提供了一个 startActivity() 方法，用于启动 Activity，它接收一个 Intent 参数
  * 将我们构建好的 Intent 参数传递给它即可启动目标 Activity

```kotlin
class FirstActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        val button: Button = findViewById(R.id.button1)
        button.setOnClickListener{
            // 意图：在 FirstActivity 的基础上打开 SecondActivity
            val intent = Intent(this, SecondActivity::class.java)
            // 启动 Activity
            startActivity(intent)
        }
    }
}
```

### 使用隐式 Intent

隐式 Intent 并不指名要启动哪一个 Activity，而是指定了一系列更为抽象的 action 和 category 等信息，然后等系统去分析这个 Intent，并找出合适的 Activity 去执行

* 合适的 Activity：可以响应这个 Intent 的 Activity
怎么配置 Activity 去响应隐式的 Intent
* 通过在 \<activity>标签下配置\<intent-filtet>，可以指定当前 Activity 能够相应的 action 和 category
  * action 指明了当前 Activity 可以响应 com.example.activitylearn.ACTION_START 这个 action
  * category 包含一些附加信息，更精确的指明了当前 Activity 能够响应的 Intent 中还可能带有的 category
  * 只有 action 和 category 中的内容都匹配时才会响应

```xml
<!-- 省略 -->
    <activity android:name=".SecondActivity">
        <intent-filter>
            <action android:name="com.example.activitylearn.ACTION_START"/>
            <category android:name="android.intent.category.DEFAULT"/>
        </intent-filter>
    </activity>
<!-- 省略 -->

```kotlin
// ...
button.setOnClickListener{
    val intent = Intent("com.example.activitylearn.ACTION_START")
    startActivity(intent)
}
```

上面代码我们使用了 Intent 的另一个构造函数，将 action 的字符串传进去

* startActivity 默认传了 android.intent.category.DEFAULT
此时运行后点击按键还是可以跳转到 SecondActivity
每个 Intent 只能指定一个 action，但可以指定多个 category

```kotlin
// ...
button.setOnClickListener{
    val intent = Intent("com.example.activitylearn.ACTION_START")
    intent.addCategory("com.example.activitylearn.MY_ACTIVITY")
    startActivity(intent)
}
```

此时重新运行后点击按钮会发现程序崩溃了
![1](/android/02_activity/assets/image8.png)
查看 logcat 错误日志，可以发现没有任何一个 Activity 可以响应我们的 Intent
解决：可以在 SecondActivity 中多声明一个 category 标签

```xml
<!-- 省略 -->
    <activity android:name=".SecondActivity">
        <intent-filter>
            <action android:name="com.example.activitylearn.ACTION_START"/>
            <category android:name="android.intent.category.DEFAULT"/>
            <!-- 新增 category -->
            <category android:name="android.intent.category.My_ACTIVITY"/>
        </intent-filter>
    </activity>
<!-- 省略 -->
```

重新运行后发现一切正常了

### 更多隐式 Intent 的用法

Intent 不仅可以启动我们自己程序的 Activity，也可以启动其他应用程序的 Activity，使得多个应用程序之间共享数据成为可能

* 例如应用程序中想要打开网页，这时候没有必要去实现一个浏览器，只需要调用系统的浏览器来打开这个网页就行了

```kotlin
button.setOnClickListener{
    // 安卓的内置动作
    val intent = Intent(Intent.ACTION_VIEW)
    intent.data = Uri.parse("https://baidu.com")
    startActivity(intent)
}
```

重新运行后点击按钮，可以看到跳转到了浏览器并打开百度首页
可以在 \<intent-filter> 中配置一个 \<data> 标签，用于更加精确的匹配 ACTION

* android: scheme：用于指定协议的部分，例如 htttps
* android: host：用于指定数据的主机部分，例如 <www.baidu.com>
* android: port：用于指定端口号
* android: path：用于指定主机名和端口号之后的部分
* android: miniType：用于指定可以处理的数据类型，允许使用通配符进行指定
只有当 Intent 中的数据与 \<data> 中的一致时才会响应
安卓还内置了许多 ACTION
* 例如打电话：Intent.ACTION_DIAL
  * intent.data = Uri.parse("tel: 10086")

### 向下一个 Activity 传递数据

Intent 提供了一系列 putExtra 的重载

* 可以将数据暂存到 Intent 中，在启动另一个 Activity 后取出即可
`发送数据`

```kotlin
button1.setOnClickListener {
    val data = "Hello SecondActivity"
    val intent = Intent(this, SecondActivity::class.java)
    // key: value
    intent.putExtra("extra_data", data)
    startActivity(intent)
}
```

`接收数据`

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.second_layout)
    val extraData = intent.getStringExtra("extra_data")
    Log.d("SecondActivity", "extra data is $extraData")
}
```

### 返回数据给上一个 Activity

返回上一个 Activity 只需要点击 back，这里并没有可以用于启动 Activity 的 Intent 来传递数据

* Activity 还有一个 startActivityForResult 的方法，期望在 Activity 销毁时能够返回一个结果给上一个 Activity
  * 第一个参数是 Intent，第二个参数是请求码，用于判断在之后的回调中判断数据的来源
    * 请求码只要是个唯一的值就可以了

```kotlin
class FirstActivity : AppCompatActivity() {
    // ...
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        button.setOnClickListener {
            val intent = Intent(this, SecondActivity::class.java)
            startActivityForResult(intent, 1)
        }
    }
    
    // 在 FirstActivity 启动的 Activity 销毁时会调用这个回调函数
    // 第一个参数是启动 Activity 时的请求码用于区分不同的 Activity 的返回值，resultCode 用于判断处理结果是否成功
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
       super.onActivityResult(requestCode, resultCode, data)
       when(requestCode) {
           1 -> if (resultCode === RESULT_OK) {
               val returnedData = data?.getStringExtra("data_return")
               Log.d("FirstActivity", "returned data is $returnedData")
           }
       }
    }
 }
```

```kotlin
class SecondActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_second)
        val button2: Button = findViewById(R.id.button2)
        button2.setOnClickListener {
            // 这个 Intent 只用于传递数据
            val intent = Intent()
            intent.putExtra("data_return", "Hello FirstActivity")
            setResult(RESULT_OK, intent)
            finish()
        }
    }

    // 用于点击返回按钮    
    override fun onBackPressed() {
        super.onBackPressed()
        val intent = Intent()
        intent.putExtra("data_return", "Hello FirstActivity(from back)")
        setResult(RESULT_OK,intent)
        finish()
    }
}
```

## 生命周期

经过上面的学习可以知道 Activity 是可以层叠的，Android 是使用任务(task)来管理 Activity 的，一个任务就是一组存在在栈里的 Action 的集合，这个栈也被称为返回栈(back stack)

* 启动一个新的 Activity 时，就会在 back stack 中入栈，位于栈顶位置
* 使用 finish 或者 back 请销毁一个 Activity 时，处于栈顶的 Activity 就会出栈
`系统总会显示处于栈顶的 Activity 给用户`

### Activity 状态

#### 运行状态

Activity 位于栈顶时就是运行状态

> 系统最不愿意收回这种状态的 Activity ，因为会带来非常差的用户体验

#### 暂停状态

当 Activity 不在处于栈顶，但仍然是可见的时，就进入了暂停状态

* 不在栈顶，仍然可见？并不是所有 Activity 都是全屏的，例如弹框 Activity 只会占用屏幕中间的部分，而在它下面的 Activity 就进入了暂停状态

> 系统也不愿意回收这种状态的 Activity，因为它还是可见的，回收对用户体验不好
>
> * 只有在内存极低的情况下，系统才会考虑去回收这种 Activity

#### 停止状态

当 Activity 不在处于栈顶，且是完全不可见时，就进入了停止状态

* 系统仍然需要为其保存相应的状态和成员变量，但这并不是完全可靠的，当其他地方需要内存时，处于停止状态的 Activity 有可能就会系统回收了

#### 销毁状态

当 Activity 从 back stack 移出后就变成了销毁状态
> 系统倾向于回收处于这种状态的 Activity，以保证手机的内存充足

### Activity 生存期

Activity 类定义了七个回调方法，覆盖了 Activity 寿命周期的每一个环节

* onCreate：在 Activity 第一次创建时调用
  * 在这个方法中完成 Activity 的初始化，例如加载布局、绑定事件
* onStart：在 Activity 由不可见变成可见时调用
* onResume：在 Activity 准备好和用户进行交互时调用
  * 此时 Activity 一定位于栈顶，且处于运行状态
* onPause：在系统准备去启动或者恢复另一个 Activity 时调用
  * 通常会在这里把 CPU 资源释放掉，以及保存一些关键数据
  * 这个方法执行一定要快，否则会影响到新的 Activity 的使用
* onStop：在 Activity 完全不可见时调用
  * 和 onPause 的区别是，如果启动的新 Activity 是一个对话框形式的 Activity，那么 onPause 会被执行，而 onStop 不会
* onDestroy：在 Activity 被销毁前调用，之后 Activity 的状态变为销毁
* onRestart：在 Activity 由停止状态变为原来的运行状态之前调用
可以将 Activity 分为 3 种生存期
* 完整生存期：从 onCreate 到 onDestroy 之间所经历的就是完整的生存期
  * 一般会在 onCreate 中完成各种初始化操作，在 onDestroy 中完成释放内存的操作
* 可见生存期：从 onStart 方法和 onStop 方法之间
  * 在可见生存期内都是可见的，但有可能是不可交互的
  * 可以在 onStart 对资源进行加载，onStop 对资源进行释放，保证处于停止状态的 Activity 不会占用过多内存
* 前台生存期：从 onResume 方法和 onPause 方法之间
  * 这个时期的 Activity 总是处于运行状态，可以与用户进行交互

![Alt text](/android/02_activity/assets/image9.png)

### 体验生命周期

新建一个项目ActivityLifeCycleTest，使用 Android Studio 自动新建 Activity 和布局（选 Empty Activity）

* 同时新建两个子 Activity：NormalActivity、DialogActivity

> java1.8 跑不起来可以把 sdk 改一下

修改 layout

* activity_normal.xml

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/this_is_normal_activity" />
</LinearLayout>
```

activity_dialog.xml

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/this_is_normal_dialog" />
</LinearLayout>
```

 修改 AndroidManifest.xml 的 \<activity> 将 DialogActivity 设置为对话框

* 增加主题设置 android:theme="@style/Theme.AppCompat.Dialog"

```xml
<activity android:name=".DialogActivity" android:theme="@style/Theme.AppCompat.Dialog"/>
```

修改 activity_main.xml

* 加入两个按钮，一个用于启动 normal activity，另一个用于启动 dialog activity

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/startNormalActivity"
        android:text="Start Normal Activity"/>

    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/startDialogActivity"
        android:text="Start Dialog Activity"/>

</LinearLayout>
```

修改 MainActivity

```kotlin
class MainActivity : AppCompatActivity() {
    private val tag = "MainActivity"
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Log.d(tag, "onCreate")

        val startNormalActivity = findViewById<Button>(R.id.startNormalActivity)
        startNormalActivity.setOnClickListener {
            val intent = Intent(this, NormalActivity::class.java)
            startActivity(intent)
        }

        val startDialogActivity = findViewById<Button>(R.id.startDialogActivity)
        startDialogActivity.setOnClickListener {
            val intent = Intent(this, DialogActivity::class.java)
            startActivity(intent)
        }
    }

    override fun onStart() {
        super.onStart()
        Log.d(tag, "onStart")
    }

    override fun onResume() {
        super.onResume()
        Log.d(tag, "onResume")
    }

    override fun onPause() {
        super.onPause()
        Log.d(tag, "onPause")
    }

    override fun onStop() {
        super.onStop()
        Log.d(tag, "onStop")
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.d(tag, "onDestroy")
    }

    override fun onRestart() {
        super.onRestart()
        Log.d(tag, "onRestart")
    }
}
```

运行代码后即可看到结果了

* 初始化
  * onCreate ---> onStart ---> onResume
* 打开 NormalActivity ---> 点击 back 关闭
  * onPause ---> onStop ---> 关闭  ---> onRestart ---> onStart ---> onResume
* 打开 DialogActivity ---> 点击 back 关闭
  * onPause ---> 关闭 ---> onResume
* 从 MainActivity 点击 back 返回到桌面
  * onPause ---> onStop ---> onDestroy

### Activity 被回收了怎么办

Activity 进入停止状态后很有可能会被回收
e.g. 用户在 A Activity 的基础上启动了 B Activity，此时 A Activity 进入停止状态，由于系统内存不足，将 Activity A 回收掉了，此时从 B 点击 back 回到 A Acitivity

* A 还是会正常显示的，只不过此时并不会执行 onRestart 方法，而是执行 Activity A 的 onCreate 方法，因为 Activity A 在这种情况下会被重新创建一次
那么被回收的 Activity 的临时变量和状态（例如用户在输入框中输入的内容）该怎么恢复？
* Activity 提供了一个 onSaveInstanceState 的回调方法，保证在 Activity 被回收之前一定会被调用
  * 该方法会携带一个 Bundle 类型的参数，提供了一系列的方法用于保存数据

```kotlin
// 保存数据
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState()
    val tempDate = "Something you juest typed"
    outState.putString("data_key", tempData)
}

override fun onCreate(saveInstanceState: Bundle?) {
    super.onCreate()
    // ...
    
    // 恢复数据
    if(saveInstanceState !== null){
        val tempData = savedInstanceState.getString("data_key")
        Log.d("MainActivity", tempData)
    }
}
```

`屏幕旋转`时 Activity 也会经历一个重新创建的过程，也可以通过这种方式解决，不过有更优雅的解决方案（ViewModel）

## Activity 的启动模式

在项目中应该根据特定的需求为每个 Activity 指定恰当的启动模式

* 启动模式共有四种
  * standard、singleTop、singleTask、singleInstance
* 可以在 AndroidManifest.xml 中通过 \<activity> 标签指定 android: launchMode 属性来选择启动模式

### standard

standard 是 Activity 默认的启动模式，若不显示指定都是这种启动模式
standard 模式下每当启动一个新的 Activity 都会在 back stack 入栈，并处于栈顶位置

* standard 模式不会在乎这个 Activity 是否已经在 back stack 中，每次启动都是新建一个新的 Activity 并入栈
e.g. 在 FirstActivity 的基础上启动 FirstActivity(本身)

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    Log.d("FirstActivity", this.toString())
    setContentView(R.layout.first_layout)
    button1.setOnClickListener {
        val intent = Intent(this, FirstActivity::class.java)
        startActivity(intent)
    }
}
```

### singleTop

如果发现返回栈的栈顶已经是该 Activity，则任务可以直接使用，不会再创建新的 Activity

* 为 activity 添加属性android:launchMode="singleTop"
* 当不处于栈顶时则会新建

```xml
<activity
    android:name=".FirstActivity"
    android:exported="true"
    android:label="This is FirstActivity"
    android:launchMode="singleTop">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

### singleTask

在 singleTop 的基础上解决了 singleTop 在同一个栈中可能会创建多个相同 Activity 的问题

* 让某个 Activity 在整个应用程序的上下文中只存在一个实例
  * 每次启动该 Activity 时都会检查栈中是否有该 Activity 的实例，如果已存在则会直接使用该实例，并将这个 Activity 之上的实例统统出栈，如果没有则会新建
如果指定了不同的 taskAffinity 则会启动一个新的 back stack

### singleInstance

这种模式会启动一个新的 back stack 来管理这个 Activity
有什么用？

* 我们程序中有一个 Activity 是允许其他程序调用的，如果想实现其他应用程序和我们的应用程序共享这个 Activity 实例应该如何实现呢？
  * 前三种模式是做不到的，因为每个应用程序都有自己的 back stack，同一个 Activity 在不同的 back stack 中入栈时必然创建新的实例，而 singleInstance 就可以解决这个问题
singleInstance 模式会有一个单独的 back stack 来管理这个 Activity，不管哪个应用程序访问这个 Activity，都共用一个返回栈，也就解决了共享 Activity 实例的问题
e.g.: 有三个 activity，A 启动 B，B 启动 C，而 B 使用 singleInstance，打印出各自的 back stack

```kotlin
class FirstActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.first_activity)
        val button: Button = findViewById(R.id.button1)
        Log.d("FirstActivity", "FirstActivity taskId is $taskId")
        button.setOnClickListener {
            val intent = Intent(this, SecondActivity::class.java)
            startActivity(intent)
        }
    }
}
```

```kotlin
class SecondActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_second)
        
        val button2: Button = findViewById(R.id.button2)
        Log.d("SecondActivity", "SecondActivity taskId is $taskId")
        button2.setOnClickListener {
            val intent = Intent(this, ThirdActivity::class.java)
            startActivity(intent)
        }
    }
}
```

```kotlin
class ThirdActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_third)
        Log.d("ThirdActivity", "ThirdActivity taskId is $taskId")
    }
}
```

需要修改 activity B

```xml
<activity android:name=".SecondActivity" android:launchMode="singleInstance">
```

运行结果
![w](/android/02_activity/assets/image10.png)

此时点击 back 会发现返回到 First Activity 中（因为他们两个在同一个栈，把 C 弹出就显示 A 了），此时再点击 back 则显示 B，再点击一次就退出程序了（所有栈都空了

### 最佳实践

怎么知道当前是哪个 Activity？

* 在接手新项目时需要在某个界面去修改一些东西，阅读别人的代码效率并不高

1.新建一个 BaseActivity，但不需要在 AndroidManifest.xml 中注册，所以新建一个普通的 Kotlin 类即可，然后让该类继承于 AppCompatActivity

```kotlin
open class BaseActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // javaClass 获取当前实例的 Class 对象，相当于在 java 中调用 getClass()
        Log.d("BaseActivity", javaClass.simpleName)
    }
}
```

> BaseActivity::class.java 获取的是 BaseActivity 类的 Class 对象
>
> * 相当于 java 中调用 BaseActivity.class

2.让 BaseActivity 成为项目中所有 Activity 的父类

3.重新运行程序，会发现 logcat 打印出了当前 Activity 的名称

### 随时随地退出程序

当我们有三个 Activity 时，需要按 3 次 back 键才能退出程序，而 home 键只是挂起，并没有退出程序，要怎么一次性退出呢？
可以使用一个专门的集合对所有 Activity 进行管理

```kotlin
object ActivityController {
    private val activities = ArrayList<Activity>()

    fun addActivity(activity: Activity) {
        activities.add(activity)
    }

    fun removeActivity(activity: Activity) {
        activities.remove(activity)
    }

    fun finishAll() {
        for (activity in activities) {
            if (!activity.isFinishing) {
                activity.finish()
            }
        }
        activities.clear()
    }
}
```

修改 BaseActivity

```kotlin
open class BaseActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // javaClass 获取当前实例的 Class 对象，相当于在 java 中调用 getClass()
        Log.d("BaseActivity", javaClass.simpleName)
        // 将 Activity 添加进去
        ActivityController.addActivity(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        ActivityController.removeActivity(this)
    }
}
```

现在不管在什么地方，只要想退出程序，只需要调用 ActivityController.finishAll() 即可，当然也可以在销毁掉所有 Activity 代码后再加上杀死当前进程的代码，以保证程序完全退出

* android.os.Process.killProcess(android.os.Process.myPid())
  * killProcess 只能用于杀掉当前程序的进程，不能杀掉其他程序的进程

### 启动 Activity 的最佳写法

当你在 FirstActivity 需要启动 SecondActivity 时，而 SecondActivity 是你的同事写的，此时你并不知道要传什么参数才能启动，此时一般就两个办法：一是自己看代码，二是找同事问

* 这样都挺麻烦的
但是如果换一种写法，就可以轻松解决上面的问题

```kotlin
class SecondActivity: BaseActivity() {
    // ...
    
    companion object {
        fun actionStart(context: Context, data1: String, data2: String) {
            val intent = Intent(context, SecondActivity::class.java)
            intent.putExtra("param1", data1)
            intent.putExtra("param2", data2)
            context.startActivity(intent)
        }
    }
}
```

> Kotlin 规定所有在companion object中定义的方法都可以使用类似于 Java 静态方法的形式调用
我们在 actionStart 完成了 Intent 的构建，所有 SecondActiviy 需要的数据都是通过 actionStart 的参数传递进来的，然后存储到 Intent 中，最后调用 startActivity 启动 SecondActivity

* 这样可以清晰的知道需要什么参数，且只需要一行代码即可启动

```kotlin
button1.setOnClickListener {
    SecondActivity.actionStart(this, "data1", "data2")
}
```

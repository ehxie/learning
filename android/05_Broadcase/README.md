# Broadcast

Android 为了便于系统级别的消息通知，引入了一套类似的广播消息机制

## 简介

Android 的广播机制会更加灵活，可以对自己感兴趣的广播进行注册，只接受自己感兴趣的广播，而不用关心其他应用发送的广播。

- 广播可能来自系统也可能来自其他应用

Android 提供了一套完整的 API 允许应用程序自由地发送和接收广播

- 接收广播需要引入一个新的概念：BroadcastReceiver

Android 中的广播分为两种：

- 标准广播(Normal Broadcast): 完全异步的广播，在广播发出之后，所有的 BroadcastReceiver 都会几乎在同一时刻接收到这条广播消息，并且它们接收到的顺序是不确定的。这种广播的效率会比较高，同时也意味着它是无法被截断的。

- 有序广播(Ordered Broadcast): 同步的广播，在广播发出之后，同一时刻只会有一个 BroadcastReceiver 接收这条广播消息。当这个 BroadcastReceiver 中的逻辑执行完后广播才会继续传递给下一个接收者。
- 此时的 Broadcast 是有优先级的，优先级高的先接收到广播

## 接收系统广播

Android 内置了很多系统级别的广播，我们可以在应用程序中监听这些广播来得到各种系统的状态信息。

- 比如开机完成后发送一条广播，电池电量变化发送一条广播，系统时间发生改变也发送一条广播等等

注册 BroadcastReceiver 的方式一般有两种：

- 动态注册：在代码中注册
- 静态注册：在 AndroidManifest.xml 中注册

> 完整的广播列表：\<Android SDK>/platforms/<任意 Android API 版本>/data/broadcast_actions.txt

### 动态注册监听时间变化

怎么注册？只需要写一个类继承 BroadcastReceiver，重写 onReceive 方法即可

- 当有广播来时，系统会自动调用 onReceive 方法

> 动态注册的广播需要手动注销

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var timeChangeReceiver: TimeChangeReceiver

    // 继承 BroadcastReceiver
    inner class TimeChangeReceiver : BroadcastReceiver(){
        override fun onReceive(p0: Context?, p1: Intent?) {
            Toast.makeText(this@MainActivity, "Time has changed", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 过滤想要监听的广播
        val intentFilter = IntentFilter()
        intentFilter.addAction("android.intent.action.TIME_TICK")

        timeChangeReceiver = TimeChangeReceiver()
        // 注册广播
        registerReceiver(timeChangeReceiver, intentFilter)
    }

    override fun onDestroy() {
        super.onDestroy()
        // 动态注册的广播需要手动注销
        unregisterReceiver(timeChangeReceiver)
    }
}

```

[完整代码](https://github.com/ehxie/Android-Practice/tree/main/broadcast/BroadcastTest)

### 静态注册实现开机启动

动态注册的 BroadcastReceiver 会自由的进行注册与注销，灵活性很大。但是必须是在程序启动之后才能接收广播，因为注册的逻辑写在了 onCreate 中。而静态注册的广播在程序未启动的时候就已经注册好了

- 理论上来说是这样的，但是由于大量恶意的应用程序利用这个机制在程序未启动的情况下监听了系统广播，从而任意应用都可以频繁的从后台被唤醒，严重影响系统的电量和性能，因此 Android 几乎在每个版本都在削弱静态注册 BroadcastReceiver 的功能

在 Android 8.0 之后，所有隐式广播都不允许使用静态的方式来接收了

- 隐式广播：没有指定接收者的广播
  - 大多数系统广播都是隐式广播，但少数系统广播仍然允许使用静态注册([详情](https://developer.android.com/guide/components/broadcast-exceptions))

e.g. 监听开机广播

> 在上面动态注册的项目的基础上进行改造

新增一个 `BootCompleteReceiver` 广播：右键 com.example.broadcasttest -> New -> Other -> Broadcast Receiver

- Exported 属性表示是否允许这个 Broadcast 接收本程序以外的广播
- Enabled 属性表示是否启用这个 BroadcastReceiver

1. 修改 `BootCompleteReceiver`

```kotlin
class BootCompleteReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Toast.makeText(context, "Boot Complete", Toast.LENGTH_LONG).show()
    }
}
```

2. 修改 AndroidManifest.xml

- 省略不必要的代码

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.broadcasttest">

    <!-- 由于 Android 为了保护用户设备的安全和隐私，所以规定程序如果要做一些敏感操作必须在 Manifest 文件中进行权限声明，否则程序会直接崩溃 -->
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />

    <application>
        <!-- 静态注册, name 指定具体的 Broadcast Receiver -->
        <receiver
            android:name=".BootCompleteReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <!-- 指定要接收的广播 -->
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>


    </application>

</manifest>
```

注意不要在 onReceive 中做耗时操作

- 不允许开启线程，onReceive 方法运行了较长时间而没有结束时，程序就会崩溃

完整代码：[git commit](https://github.com/ehxie/Android-Practice/commit/e2b012f143f01eaf4a8d870694dfb8fe1fea547d)

## 发送自定义广播

1. 上面了解到广播分为两种；标准广播和有序广播

### 发送标准广播

需要先定义一个接收的广播

- 创建一个类继承 BroadcastReceiver，重写 onReceive 方法（）弹出一个 Toast，这一步代码省略
- 注册静态广播，修改 `AndroidManifest.xml`

```xml
<!-- 省略 -->
<receiver
    android:name=".MyBroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="com.example.broadcasttest.My_BROADCAST" />
    </intent-filter>
</receiver>
<!-- 省略 -->
```

2. 发送广播

先在 `activity_main.xml` 中添加一个按钮(省略)，然后绑定点击事件进行广播

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.button)
        button.setOnClickListener {
            val intent = Intent("com.example.broadcasttest.My_BROADCAST")
            // 由于 Android 8.0 之后无法使用静态注册的 BroadReceiver 接收隐式广播
            // 所以这里传入当前程序的包名，指定要发送给的应用程序（显示广播）
            intent.setPackage(packageName)
            sendBroadcast(intent)
        }
    }
}
```

运行代码后点击按钮，可以看到 Toast 弹窗

完整代码：[git commit](https://github.com/ehxie/Android-Practice/commit/d7ca9f71e810db9a7dcfa41d1e633cc73d4c4c51)

### 发送有序广播

1. 在上面标准广播的基础上增加一个 `AnotherBroadcastReceiver` 广播，并修改 `AndroidManifest.xml`(与上面一致，这里省略)

2. 发送有序广播

```kotlin

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val orderButton = findViewById<Button>(R.id.orderButton)
        orderButton.setOnClickListener {
            val intent = Intent("com.example.broadcasttest.My_BROADCAST")
            intent.setPackage(packageName)
            // 第二个参数是权限相关的
            sendBroadcast(intent, null)
        }
    }
}
```

点击按钮后，可以看到 Toast 弹窗依次弹出

- 都没写优先级时，会按 `AndroidManifest.xml` 中注册的顺序从上到下

设置优先级，让 MyBroadcastReceiver 优先于 AnotherBroadcastReceiver

- 设置：android:priority="100"

```xml
<receiver
    android:name=".AnotherBroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="com.example.broadcasttest.MY_BROADCAST" />
    </intent-filter>
</receiver>
<receiver
    android:name=".MyBroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter android:priority="100">
        <action android:name="com.example.broadcasttest.MY_BROADCAST" />
    </intent-filter>
</receiver>
```

在 MyBroadcastReceiver 中截断广播

```kotlin
class MyBroadcastReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        Toast.makeText(context, "received in MyBroadcastReceiver", Toast.LENGTH_LONG).show()
        // 截断广播
        abortBroadcast()
    }
}
```

完整代码：[git commit](https://github.com/ehxie/Android-Practice/commit/ab681784e4beade0995c787667cbd037e696bf5b)

## 最佳实践

实现一个强制下线功能：例如你的 QQ 号在别处登录时就会将你强制挤下线

- 强制下线功能：只需要在界面上弹出一个对话框，让用户无法进行其他操作，必须点击对话框的确定按钮，然后退回到登录界面

- 强制下线功能需要关闭所有的 Activity，然后返回登录界面
  - 借助 ActivityController 实现管理所有的 Activity

在 app 下的 build.gradle 扩展以下 plugin，可以不需要写 findViewByID，直接使用 id 变量名

```gradle
plugins {
    id 'kotlin-android-extensions'
}
```

1. 写一个 BaseActivity，用于管理所有的 Activity（存在 ActivityController）

- onCreate 时 add，onDestroy 时 remove

2. 写一个 LoginActivity，用于登录(程序启动时启动该页面)

- 登录成功后打开 MainActivity，并关闭 LoginActivity

  3.MainActivity 中只写一个按钮，点击后强制下线

- 点击按钮后会发送广播

4. 写一个接收广播的类，在 onReceive 中弹出对话框

- 静态 Broadcast 是无法在 onReceive 中弹出 Toast 的，所以只能写动态的 Broadcast
  - 那么也只能在基类写

接收到后，关闭所有的 Activity，然后返回（打开）登录界面

完整代码：[git commit](https://github.com/ehxie/Android-Practice/commit/c6435730aab0a3346edfcc9d55a867d438ec031e)

# Multi Media

这一节使用手机多媒体来丰富我们的应用程序

之前我们都是使用 Android 模拟器来运行我们的应用程序，现在需要有一台 Android 真机来运行我们的应用程序。

前期准备：(不同机型设置路径不同，自行搜索)

- 手机连接到电脑并开启 `USB 调试`(设置 -> 系统 -> 开发者选项 -> 打开 USB 调试)
  - Android 4 开始开发者选项是隐藏的，需要连续点击"关于本机"
- 第一次将手机连接到电脑时还会提示是否允许 `USB 调试`，点击允许

## 通知功能

通知(notification) 是 Android 中比较有特色的一个功能，当某个应用程序希望向用户发送一些提示信息，而该应用程序又不在前台运行时，可以借助通知来实现

- iOS 在 5.0 版本后也加入了类似的功能

### 创建通知渠道

这个设计的初衷是好的，但是被开发者玩坏了。每发出一条通知都意味着应用程序被打开的概率会更大，因此很多应用会想尽一切办法发送通知，但是这对用户来说就很不好，状态栏会被一大堆信息堆满

- 虽然应用允许我们将某个应用程序的通知完全屏蔽，但是这样也会把我们想要的通知屏蔽了

所以 Android 在 8.0 引入了通知渠道的概念

**通知渠道**：每条通知都需要属于一个对应渠道。

- 每个应用都可以自由的创建当前应用拥有哪些渠道，但是是否打开取决于用户

- 对于每个应用来说，通知渠道的划分是非常考究的，因为通知渠道一旦创建之后就不能再修改了，所以开发者需要仔细考虑

#### 创建渠道的详细步骤

1、需要一个 `NotificationManager` 对通知进行管理，可以使用 Context 的 getSystemService() 方法获取

- getSystemService() 方法接收一个字符串参数用于确定获取系统的哪个服务，这里传入 `Context.NOTIFICATION_SERVICE` 即可。

```kotlin
val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

```

2、使用 `NotificationChannel` 类构建一个通知渠道，并调用 `NotificationManager` 的 `createNotificationChannel()` 方法创建

- 由于 `NotificationChannel` 和 `createNotificationChannel` 是 Android 8.0 新增的，所以需要进行版本判断

```kotlin
if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  // id 保证全局唯一就行了
  // channelName 渠道名称，这是给用户看的
  // importance 重要程度，分为四个等级(这里只是最初状态下的重要等级，用户可以随时更改通知渠道的主要等级)
  val channel = NotificationChannel(channelId, channelName, importance)
  notificationManager.createNotificationChannel(channel)
}
```

### 基本用法

通知的使用还是比较灵活的，可以在 Activity 中使用也可以在 BroadcastReceiver 里创建，甚至可以在 Service 中创建。相比于 BroadcastReceiver 和 Service 来说，Activity 创建的场景较少，因为一般只有当应用程序在后台的时候才会需要使用通知。

首先需要 Builder 构造器来创建 Notification 对象，但问题在于 Android 系统每个版本或多或少对通知功能进行修改，API 不稳定的问题在通知上凸现得尤其严重。

- 所以需要使用 AndroidX 库中提供的兼容 API。AndroidX 库中提供了一个 NotificationCompat 类，使用这个类的构造器创建 Notification 可以保证我们在程序在所有 Android 版本上都可以正常运行。

```kotlin
val notification = NotificationCompat.Builder(context, channelId)
  .setContentTitle("This is content title") // 在 build 之前可以对 Notification 进行设置，这里是下拉通知栏时显示的标题
  .setContentText("This is content text") // 这里是下拉通知栏时显示的文本内容
  .setSmallIcon(R.drawable.small_icon) // 系统状态栏的小图标，只能使用纯 alpha 图层的图片进行设置
  .setLargeIcon(BitmapFactory.decodeResource(resources, R.drawable.large_icon)) // 这里是下拉通知栏时显示的图标
  .build()
```

创建完成后只需要调用 notify() 方法将通知发送出去即可

```kotlin
// 第一个参数是 id，要保证每个通知的 id 都是不同的
// 第二个参数是上面创建的 Notification 对象
manager.notify(notificationId, notification)
```

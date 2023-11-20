# ContentProvider

学习[数据存储](/android/06_storage/README.md)时知道 SharedPreferences 存储中提供了 MODE_WORLD_READABLE 和 MODE_WORLD_WRITEABLE 两中操作模式，用于给其他应用程序访问当前应用的数据，但这两种模式在 Android 4.2 之后被废弃了，官方更加推荐使用更加安全可靠的 ContentProvider 技术

## ContentProvider 简介

ContentProvider 主要用于在不同的应用程序之间实现数据共享的功能，提供了一整套完整的机制，允许一个应用程序访问另一个应用程序中的数据，同事还能保证被访问数据的安全性

- 不同于文件存储和 SharedPreferences 存储中的两种全局可读写操作模式，ContentProvider 可以选择只对哪一部分数据进行共享，从而保证我们程序中的隐私数据不会有泄露的风险

在学习 ContentProvider 之前，需要先掌握 Android 运行时权限，因为 ContentProvider 访问数据需要申请权限

## 运行时权限

Android 的权限从第一个版本就存在了，但一开始的权限机制在保护用户安全和隐私等方面起到的作用比较有限，尤其是一些大家都离不开的常用软件，容易「店大欺客」。因此，Android 从 6.0 开始引入了运行时权限这个功能，从而更好的保护了用户的安全和隐私

### Android 权限机制详解

在学习[广播](/android/05_Broadcase/README.md)功能时，为了要监听开机广播，需要在 `AndroidManifest.xml` 中配置权限

```xml
<manifest ... >
  <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
</manifest>
```

- 因为监听开机广播涉及了用户设备的安全，因此必须在 `AndroidManifest.xml` 中加入权限声明，否则我们的程序就会崩溃

加入权限后对用户来说有什么影响呢？为什么这样就能够保护用户的安全呢？

- 一方面，如果用户在**低于 6.0**的设备上安装该程序，会在安装界面给出提示，用户就清楚的知晓程序都申请了哪些权限，从而决定是否安装该程序
- 另一方面，用户可以随时在应用程序管理界面查看任意一个程序的权限申请情况

以上的设计思路很简单，就是用户如果认可你所申请的权限机会安装你的程序，如果不认可，就不会安装

但是现实是很多常用的软件都存在滥用权限的情况，不管用不用得到反正先申请了再说。而这些软件又是我们日常使用频率最高的，比如微信、QQ、支付宝等。

Android 团队意识到了这个问题，所以在 6.0 之后，Android 引入了运行时权限机制，也就是说用户不需要在安装软件时一次性授权所有申请的权限，而是可以在软件的使用过程中再对某一项权限的申请进行授权

- 例如相机应用在运行时申请了地理位置定位的权限，就算我拒绝了这个权限，也应该可以使用这个应用的其他功能，而不是像之前一样无法安装它

当然并不是所有的权限都需要在运行时申请，频繁的进行授权用户也会很烦的。因此，Android 团队又对权限进行了分类，分为**危险权限**和**普通权限**（其实还有一些特殊的权限，不过使用的少就不讨论了）

- 普通权限：那些不会直接威胁用户安全和隐私的权限，这部分权限系统会自动帮我们授权而不需要手动授权
- 危险权限：那些可能会直接威胁用户安全和隐私的权限，例如获取设备联系人信息，定位设备的地理位置，这些必须用户手动授权才可以，否则无法使用相应的功能

> Android 有上百种权限，怎么区分普通和危险权限？
>
> - 危险权限总共就那么一些，其他大多数都是普通权限了
> - [Android 权限列表](https://developer.android.com/reference/android/Manifest.permission)，危险权限会有：Protection level: dangerous
> - 安卓有些权限是权限组，也就是说授权了某个权限后同组的其它的权限也会被授权，但别基于这个规则去实现功能，因为安卓随时有可能调整权限的分组

### 运行时权限申请

创建一个 `RuntimePermissionTest` 项目来练习运行时权限

- 为了简单起见，我们就申请 `CALL_PHONE` 权限，这个权限是编写拨打电话功能的时候需要声明的，因为拨打电话会涉及到用户手机的资费问题，因而被列为危险权限

#### 6.0 之前

在 Android 6.0 之前，我们只需要在 `AndroidManifest.xml` 中配置权限即可

1、修改`activity_main.xml`

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <Button
        android:id="@+id/makeCall"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Make Call" />
</LinearLayout>

```

2、修改`MainActivity.kt`

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val makeCall = findViewById<Button>(R.id.makeCall)
        makeCall.setOnClickListener {
            try {
                // 这是系统内置的打电话的动作
                val intent = Intent(Intent.ACTION_CALL)
                // 指定协议是 tel，号码是 10086
                intent.data = Uri.parse("tel:10086")
                startActivity(intent)
            } catch (e: SecurityException) {
                e.printStackTrace()
            }
        }
    }
}

```

3.修改 `AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.CALL_PHONE" />

    <!-- ... -->

</manifest>

```

在 Android 6.0 之前的系统是可以运行的

#### 6.0 之后

上面的代码在 Android 6.0 之后运行会报错，因为系统不允许我们直接使用拨打电话功能，在 Logcat 中会打印以下日志

- Permission Denial

```log
java.lang.SecurityException: Permission Denial: starting Intent { act=android.intent.action.CALL dat=tel:xxxxx cmp=com.android.server.telecom/.components.UserCallActivity } from ProcessRecord{270fd0a 12472:com.example.runtimepermissiontest/u0a190} (pid=12472, uid=10190) with revoked permission android.permission.CALL_PHONE
```

使用危险权限需要进行运行时权限处理

修改`MainActivity.kt`

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val makeCall = findViewById<Button>(R.id.makeCall)
        makeCall.setOnClickListener {
            // 检查是否有权限，没有则进行申请
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.CALL_PHONE
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                // 第三个参数是请求码，要求是唯一值就行了
                ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CALL_PHONE), 1)
            } else {
                call()
            }
        }
    }

    // 处理申请权限结果
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            1 -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    call()
                } else {
                    Toast.makeText(this, "You denied the permission", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun call() {
        try {
            // 这是系统内置的打电话的动作
            val intent = Intent(Intent.ACTION_CALL)
            // 指定协议是 tel，号码是 10086
            intent.data = Uri.parse("tel:10086")
            startActivity(intent)
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }
}

```

现在点击按钮后就会弹出授权的弹窗了

- 点击了拒绝后下次点击还是会弹出询问
- 点击了允许后也可以随时在系统设置中进行关闭

[完整代码](https://github.com/ehxie/Android-Practice/tree/main/content-provider/RuntimePermissionTest)

- [Commit](https://github.com/ehxie/Android-Practice/commit/27ed458a1b69c0c9819cf9e1501fa17b8610e8b4)

## 访问其他应用程序中的数据

ContentProvider 有两种用法

- 使用现有的 ContentProvider 读取和操作相应程序中的数据
- 创建自己的 ContentProvider，给程序的数据提供外部访问接口

先学习第一种用法，如果一个应用程序通过 ContentProvider 对其数据提供了外部访问接口，那么任何其他的应用程序都可以对这部分数据进行访问

- Android 中自带的通讯录、短信、媒体库等程序都提供了类似的访问接口

### ContentResolver 的基本用法

对于每一个应用程序来说，要访问 ContentProvider 中的数据，都需要使用 ContentResolver

- 通过 Context 中的 getContentResolver() 方法获取该类的实例

ContentResolver 中提供了一系列的方法对数据进行增删改查操作

- insert()、update()、delete()、query()
- 这些方法都和 SQLiteDatabase 很类似，但有一些区别，ContentResolver 中都不是接收表名参数的，而是使用 Uri 参数代替(这部分称为内容 Uri)
  - 内容 Uri 给 ContentResolver 提供了访问数据源的唯一标识，由两部分组成：authority 和 path。authority 是用于对不同应用程序做区分的，一般为了避免冲突都会使用包名的方式进行命名，例如包名是 `com.example.app` 那么 authority 就可以命名为 `com.example.app.provider`，path 则是对同一应用程序中不同表做区分的，通常会加到 authority 后面，例如 `com.example.app.provider/table1`。不过这种方式还很难辨认出这个字符串就是内容 Uri，所以还需要在字符串头部加上协议声明，即 `content: com.example.app.provider/table1`

可以看出 Uri 可以很清晰的表达出我们想要访问哪个应用程序的哪张表的内容，而正因如此，ContentResolver 才使用了 Uri 而不是表名

得到字符串 Uri 后还需要将其解析为 Uri 对象，可以使用 Uri.parse() 方法

```kotlin
val uri = Uri.parse("content:com.example.app.provider/table1")

// 查询表中数据
val cursor = contentResolver.query(url, projection, selection, selectionArgs, sortOrder)
```

query 方法的参数

- 第一个参数是 Uri，即内容 Uri
- 第二个参数是查询的列名，如果为 null 则表示查询所有列(select column1, column2)
- 第三个参数是查询条件，即 where 后面的部分(where column = value)
- 第四个参数是 where 中的占位符提供具体的值
- 第五个参数是排序方式，即 order by 后面的部分(order by column1, column2)

返回结果仍然是 Cursor 对象，我们对对象进行遍历即可拿到数据

```kotlin
while(cursor.moveToNext()) {
    val column1 = cursor.getString(cursor.getColumnIndex("column1"))
    val column2 = cursor.getInt(cursor.getColumnIndex("column2"))
}
```

其他操作

```kotlin
// 插入数据
val values = contentValuesOf("column1" to "value1", "column2" to 1)
contentResolver.insert(uri, values)

// 更新数据把声明插入数据的 column1 删掉
val values1 = contentValuesOf("column1" to "")
contentResolver.update(uri, values1, "column1 = ? and column2 = ?", arrayOf("value1", 1))")

// 删除数据
contentResolver.delete(url, "column1 = ?", arrayOf("value1"))
```

### 读取系统联系人

需要在模拟器中手动添加几个联系人，车间 ContactsTest 项目

修改 `activity_main.xml` 文件

- 读取出来的数据显示在 ListView 中

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <ListView
        android:id="@+id/contactsView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</LinearLayout>
```

修改 `MainActivity.kt` 文件

- 在启动时就去读取联系人并渲染出来

```kotlin
class MainActivity : ComponentActivity() {
    private val contactsList = ArrayList<String>()
    private lateinit var adapter: ArrayAdapter<String>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, contactsList)
        val contactsView = findViewById<ListView>(R.id.contactsView)
        contactsView.adapter = adapter

        if (ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CALL_PHONE
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.READ_CONTACTS), 1)
        } else {
            readContacts()
        }

    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            1 -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    readContacts()
                } else {
                    Toast.makeText(this, "You denied the permission", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    @SuppressLint("Range")
    private fun readContacts() {
        contentResolver.query(
            ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
            null,
            null,
            null,
            null
        )
            ?.apply {
                while (moveToNext()) {
                    // 联系人姓名
                    val displayName =
                        getString(getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME))
                    // 联系人手机号
                    val number = getString(getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER))
                    contactsList.add("$displayName\n$number")
                }
                adapter.notifyDataSetChanged()
                close()
            }
    }
}

```

修改 `AndroidManifest.xml` 文件

- 需要添加权限声明

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <!-- ... -->
</manifest>

```

[完整代码](https://github.com/ehxie/Android-Practice/tree/main/content-provider/ContactsTest)

- [commit](https://github.com/ehxie/Android-Practice/commit/0a4ad55ca8e78c292413242de80fe145a56d476b)

## 创建自己的 ContentProvider

如何提供外部访问接口？如何保证数据安全，使得隐私数据不会泄露出去？

### 创建 ContentProvider

要实现跨应用程序数据共享的功能，可以通过新建一个类继承于 ContentProvider 类来实现

- 需要重写 6 个方法

```kotlin
class MyProvider : ContentProvider() {
    // 在初始化时调用，通常会完成对数据库的创建和升级等操作
    override fun onCreate(): Boolean {
        return false
    }

    override fun query(uri: Uri, projection: Array<String>?, selection: String?,
            selectionArgs: Array<String>?, sortOrder: String?): Cursor? {
        return null
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return null
    }

    override fun update(uri: Uri, values: ContentValues?, selection: String?,
            selectionArgs: Array<String>?): Int {
        return 0
    }

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int {
        return 0
    }

    // 根据传入的 Uri 返回对应的 MIME 类型
    override fun getType(uri: Uri): String? {
        return null
    }
}
```

- 可以发现很多方法都带有 Uri 参数，这些参数正是在调用 ContentResolver 进行增删改查时传递的

现在我们需要对传入的 Uri 参数进行解析，从中分析出调用方法期望访问的表和数据

- 标准的 Uri：`content://com.example.provider/table_name`
  - 也可以在后面加一个 id：`content://com.example.provider/table_name/id`，表示期望访问 com.example.provider 这个应用程序中的 table_name 表中的 id 数据

可以使用通配符匹配这两种格式的 Uri

- `*` 表示匹配任意长度的任意字符
- `#` 表示匹配任意长度的数字

可以借助 UriMatcher 来实现内容 Uri 匹配

- addURI() 方法接收三个参数：authority、path 和 code

```kotlin
class MyProvider : ContentProvider() {
    // tips: 可以使用密封类
    private val table1Dir = 0
    private val table1Item = 1
    private val table2Dir = 2
    private val table2Item = 3

    private val uriMatcher = UriMatcher(UriMatcher.NO_MATCH)

    init {
        uriMatcher.addURI("com.example.app.provider", "table1", table1Dir)
        uriMatcher.addURI("com.example.app.provider", "table1/#", table1Item)
        uriMatcher.addURI("com.example.app.provider", "table2", table2Dir)
        uriMatcher.addURI("com.example.app.provider", "table2/#", table2Item)
    }

    // ...

    override fun query(uri: Uri, projection: Array<String>?, selection: String?,
            selectionArgs: Array<String>?, sortOrder: String?): Cursor? {
        when(uriMatcher.match(uri)) {
            table1Dir -> {
                // 查询 table1 表中所有数据
            }
            table1Item -> {
                // 查询 table1 表中单条数据
            }
            table2Dir -> {
                // 查询 table2 表中所有数据
            }
            table2Item -> {
                // 查询 table2 表中单条数据
            }
        }

    }
}
```

getType() 方法说明

- 这是所有 ContentProvider 必须实现的方法。用于获取 Uri 所对应的 MIME 类型
- 一个内容 Uri 所对应的 MIME 字符串主要由三部分组成
  - 必须以 `vnd` 开头
  - 如果内容 URI 以路径结尾，则后接 `android.cursor.dir/`; 如果内容 URI 以 id 结尾，则后接 `android.cursor.item/`
  - 最后接上 `vnd.<authority>.<path>`

e.g.:

- 对于 `content://com.example.provider/table1`，其 MIME 类型为：`vnd.android.cursor.dir/vnd.com.example.provider.table1`
- 对于 `content://com.example.provider/table1/1`，其 MIME 类型为：`vnd.android.cursor.item/vnd.com.example.provider.table1`

完善 `MyProvider` 类中的 getType() 方法

```kotlin
class MyProvider : ContentProvider() {
    // ...
    override fun getType(uri: Uri): String? {
        when(uriMatcher.match(uri)) {
            table1Dir -> "vnd.android.cursor.dir/vnd.com.example.provider.table1"
            table1Item -> "vnd.android.cursor.item/vnd.com.example.provider.table1"
            table2Dir -> "vnd.android.cursor.dir/vnd.com.example.provider.table2"
            table2Item -> "vnd.android.cursor.item/vnd.com.example.provider.table2"
            else -> null
        }
    }
}
```

如何保证隐私数不会泄露的问题也在不知不觉中已经解决了

- 所有的增删改查操作都一定要匹配到相应的内容 URI 格式才能够进行，而我们不可能想 UriMatcher 中添加隐私数据的 URI，所以这部分数据就不会被外部访问

### 实现跨程序数据共享

简单起见，基于之前的 [DatabaseTest](https://github.com/ehxie/Android-Practice/tree/main/storage/DatabaseTest) 的基础上复制了一份[Database](https://github.com/ehxie/Android-Practice/tree/main/content-provider/DatabaseTest)进行开发，通过 ContentProvider 给它加入外部访问接口

- 由于跨程序访问时不能直接使用 Toast，所以要在代码中把其去掉

创建一个 `ContentProvider`(在 `com.example.databasetest` 包右键 --> new --> other --> content provider)

![Alt text](/android/07_ContentProvider/assets/image.png)

- authority 指定为 `com.example.databasetest.provider`
- Exported 表示是否允许外界程序访问
- Enabled 表示是否启用这个 ContentProvider

修改 `DatabaseProvider` 中的代码

```kotlin
class DatabaseProvider : ContentProvider() {

    private val bookDir = 0
    private val bookItem = 1
    private val categoryDir = 2
    private val categoryItem = 3

    private val authority = "com.example.databasetest.provider"
    private var dbHelper: MyDatabaseHelper? = null

    // 在 uriMatcher 首次调用时才会被初始化
    private val uriMatcher by lazy {
        val matcher = UriMatcher(UriMatcher.NO_MATCH)
        matcher.addURI(authority, "book", bookDir)
        matcher.addURI(authority, "book/#", bookItem)
        matcher.addURI(authority, "category", categoryDir)
        matcher.addURI(authority, "category/#", categoryItem)
        matcher
    }

    override fun onCreate() = context?.let {
        dbHelper = MyDatabaseHelper(it, "BookStore.db", 2)
        true
    } ?: false

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ) = dbHelper?.let {
        val db = it.readableDatabase
        val cursor = when (uriMatcher.match(uri)) {
            bookDir -> db.query("Book", projection, selection, selectionArgs, null, null, sortOrder)
            bookItem -> {
                // pathSegments 会将内容 URI 权限之后的部分以 `/` 符号进行分割，第 0 个位置就是 path，第 1 个位置就是 id
                val bookId = uri.pathSegments[1]
                db.query("Book", projection, "id = ?", arrayOf(bookId), null, null, sortOrder)
            }

            categoryDir -> db.query(
                "Category",
                projection,
                selection,
                selectionArgs,
                null,
                null,
                sortOrder
            )

            categoryItem -> {
                val categoryId = uri.pathSegments[1]
                db.query(
                    "Category",
                    projection,
                    "id = ?",
                    arrayOf(categoryId),
                    null,
                    null,
                    sortOrder
                )
            }

            else -> null
        }
        cursor
    }

    override fun insert(uri: Uri, values: ContentValues?) = dbHelper?.let {
        val db = it.writableDatabase
        val uriReturn = when (uriMatcher.match(uri)) {
            bookDir, bookItem -> {
                val newBookId = db.insert("Book", null, values)
                Uri.parse("content://$authority/book/$newBookId")
            }

            categoryDir, categoryItem -> {
                val newCategoryId = db.insert("Category", null, values)
                Uri.parse("content://$authority/book/$newCategoryId")
            }

            else -> null
        }
        uriReturn
    }

    override fun update(
        uri: Uri,
        values: ContentValues?,
        selection: String?,
        selectionArgs: Array<out String>?
    ) = dbHelper?.let {
        val db = it.writableDatabase
        val updatedRows = when (uriMatcher.match(uri)) {
            bookDir -> db.update("Book", values, selection, selectionArgs)
            bookItem -> {
                val bookId = uri.pathSegments[1]
                db.update("Book", values, "id = ?", arrayOf(bookId))
            }

            categoryDir -> db.update("Category", values, selection, selectionArgs)
            categoryItem -> {
                val categoryId = uri.pathSegments[1]
                db.update("Category", values, "id = ?", arrayOf(categoryId))
            }

            else -> 0
        }
        updatedRows
    } ?: 0

    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<out String>?) =
        dbHelper?.let {
            val db = it.writableDatabase
            val deleteRows = when (uriMatcher.match(uri)) {
                bookDir -> db.delete("Book", selection, selectionArgs)
                bookItem -> {
                    val bookId = uri.pathSegments[1]
                    db.delete("Book", "id = ?", arrayOf(bookId))
                }

                categoryDir -> db.delete("Category", selection, selectionArgs)
                categoryItem -> {
                    val categoryId = uri.pathSegments[1]
                    db.delete("Category", "id = ?", arrayOf(categoryId))
                }

                else -> 0
            }
            deleteRows
        } ?: 0

    override fun getType(uri: Uri) = when (uriMatcher.match(uri)) {
        bookDir -> "vnd.android.cursor.dir/vnd.${authority}.book"
        bookItem -> "vnd.android.cursor.item/vnd.${authority}.book"
        categoryDir -> "vnd.android.cursor.dir/vnd.${authority}.category"
        categoryItem -> "vnd.android.cursor.item/vnd.${authority}.category"
        else -> null
    }
}

```

需要在 `AndroidManifest.xml` 中进行注册，不过由于我们使用 Android Studio 自动生成，所以不需要手动注册了。

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <application ...>
        <provider
            android:name=".DatabaseProvider"
            android:authorities="com.example.databasetest.provider"
            android:enabled="true"
            android:exported="true">
        </provider>
    </application>
</manifest>
```

新建一个 `ProviderTest` 来访问 `DatabaseTest` 中的数据。

1、修改 `activity_main.xml`，添加四个 `Button` 用于增删改查(这里省略)

2、修改 `MainActivity`，添加四个 `Button` 的点击事件

```kotlin
class MainActivity : ComponentActivity() {
    private var bookId: String? = null
    private val tag = "MainActivity"

    @SuppressLint("Range")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val addData = findViewById<Button>(R.id.addData)
        addData.setOnClickListener {
            val uri = Uri.parse("content://com.example.databasetest.provider/book")
            val values = contentValuesOf(
                "name" to "A Clash of Kings",
                "author" to "George Martin",
                "pages" to 1040,
                "price" to 22.85
            )
            val newUri = contentResolver.insert(uri, values)
            bookId = newUri?.pathSegments?.get(1)
        }

        val queryData = findViewById<Button>(R.id.queryData)
        queryData.setOnClickListener {
            val uri = Uri.parse("content://com.example.databasetest.provider/book")
            contentResolver.query(uri, null, null, null, null)?.apply {
                while (moveToNext()) {
                    val name = getString(getColumnIndex("name"))
                    val author = getString(getColumnIndex("author"))
                    val pages = getInt(getColumnIndex("pages"))
                    val price = getDouble(getColumnIndex("price"))
                    Log.d(tag, "book name is $name")
                    Log.d(tag, "book author is $author")
                    Log.d(tag, "book pages is $pages")
                    Log.d(tag, "book price is $price")
                }
                close()
            }
        }

        val updateData = findViewById<Button>(R.id.updateData)
        updateData.setOnClickListener {
            bookId?.let {
                val uri = Uri.parse("content://com.example.databasetest.provider/book/$it")
                val values = contentValuesOf(
                    "name" to "A Storm of Swords",
                    "pages" to 1216,
                    "price" to 16.66
                )
                contentResolver.update(uri, values, null, null)
            }
        }

        val deleteData = findViewById<Button>(R.id.deleteData)
        deleteData.setOnClickListener {
            bookId?.let {
                val uri = Uri.parse("content://com.example.databasetest.provider/book/$it")
                contentResolver.delete(uri, null, null)
            }
        }
    }
}

```

3、修改 `AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <queries>
        <package android:name="com.example.databasetest" />
    </queries>

</manifest>

```
> Android 11 之后需要使用 <queries> 元素，应用可以定义一组自身可访问的其他软件包
>  - 设置了这个才能访问到 databasetest 提供的接口
> 参考：
>  - [Android 11 更新日志](https://developer.android.google.cn/about/versions/11)
>  - [包可见性](https://developer.android.google.cn/about/versions/11)

完整代码
 - https://github.com/ehxie/Android-Practice/tree/main/content-provider/ProviderTest
 - https://github.com/ehxie/Android-Practice/tree/main/content-provider/DatabaseTest
 - [commit](https://github.com/ehxie/Android-Practice/commit/32ebb5a5ae319757a0d00bad255cb858e1192fb8)
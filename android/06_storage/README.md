# 数据存储

持久化存储指的是将那些在内存中的瞬时数据保存到存储设备中，保证即使在手机或者计算机关机的情况下，这些数据仍然不会丢失。

Android 中提供了三种数据持久化的功能：文件存储、SharedPreferences、以及数据库存储

## 文件存储

文件存储不对存储的内容进行任何格式化处理，所有的数据都是原封不动的保存到文件当中

- 适合存储一些简单的文本数据或二进制数据

### 将数据存储到文件中

Context 类提供了一个 openFileOutput() 方法，可以用于将数据存储到指定的文件中

- 该方法包含两个参数：
  - 第一个是文件名（不能包含路径，因为所有的文件都默认存储到 /data/data/\<package name>/files 目录下）
  - 第二个参数是文件的操作模式，主要有 MODE_PRIVATE (默认值，同名文件会直接覆盖)和 MODE_APPEND (有同名文件则追加，没有则新建)两种
- 返回一个 FileOutputStream 对象，该对象用于将数据写入文件，得到这个对象后就可以用 Java 流的方式将数据写入文件中了

e.g.

```kotlin
fun save(inputText: String) {
    try {
        val output = openFileOutput("data", Context.MODE_PRIVATE)
        val writer = BufferedWriter(OutputStreamWriter(output))
        // use 是一个扩展函数，保证在 lambda 表达式中的代码全部执行完成后自动将外层的流关闭，这样就不需要手动写一个 finally 去关闭流
        writer.use {
            it.write(inputText)
        }
    } catch (e: IOException) {
        e.printStackTrace()
    }
}
```

新建项目：`FilePersistenceTest`

- 实现在退出程序时保存数据

  1.修改 activity_main.xml 文件，添加一个 EditText

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <EditText
        android:id="@+id/editText"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Type Something Here" />

</LinearLayout>

```

2.修改 MainActivity.kt 文件

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }

    override fun onDestroy() {
        super.onDestroy()
        val editText = findViewById<EditText>(R.id.editText)
        val inputText = editText.text.toString()
        save(inputText)
    }

    private fun save(inputText: String) {
        try {
            val output = openFileOutput("data", Context.MODE_PRIVATE)
            val writer = BufferedWriter(OutputStreamWriter(output))
            writer.use {
                it.write(inputText)
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
}

```

3.打开应用程序，输入 `hello world`，退出程序

4.在 `Android Studio` 的右下角点击 `Device File Explorer` 按钮，在 `data/data/com.example.filepersistencetest/files` 目录下找到 `data` 文件，打开该文件，可以看到文件内容为 `hello world`

![Alt text](/android/06_storage/assets/image.png)

### 从文件中读取数据

Context 类还提供了一个 `openFileOutput()` 方法，可以用于从文件中读取数据

- 只接收一个参数，即文件名，系统会自动到 /data/data/\<package name>/files 目录下查找该文件，并返回一个 FileInputStream 对象，得到该对象后就可以通过流的方式读取了

```kotlin
fun load(): String {
    val content = StringBuilder()
    try {
        val input = openFileInput("data")
        val reader = BufferedReader(InputStreamReader(input))
        reader.use {
            reader.forEachLine {
                content.append(it)
            }
        }
    } catch (e: IOException) {
        e.printStackTrace()
    }
    return content.toString()
}
```

修改 onCreate

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    // ...

    val inputText = load()
    if(inputText.isNotEmpty()){
        val editText = findViewById<EditText>(R.id.editText)
        editText.setText(inputText)
        // 将光标移动到行尾
        editText.setSelection(inputText.length)
        Toast.makeText(this, "Restoring succeeded", Toast.LENGTH_LONG).show()
    }
}

```

[完整代码](https://github.com/ehxie/Android-Practice/tree/main/storage/FilePersistenceTest)

- [commit](https://github.com/ehxie/Android-Practice/commit/d3ba8e45c9a3392699821edd48abbe435b9f4c47#diff-7f4f5f6ccb6616c4447a4936e34b7a1353e0c824eb62e7c5cf7c94c4d247ff09)

## SharedPreferences

不同于文件存储，SharedPreferences 是使用键值对的方式来存储数据的

- 当要存储数据时需要给这条数据提供一个对应的键，这样在读取数据时就可以通过这个键把相应的值读出来
- 支持多种数据类型的存储

### 存储数据

要使用 SharedPreferences 存储数据，首先需要获取 SharedPreferences 对象，有两种方法：

- Context 类中的 `getSharedPreferences()` 方法

  - 此方法接收两个参数
    - 第一个参数是 `SharedPreferences` 文件名，如果指定文件不存在则会创建一个，文件都存在 `data/data/<package name>/shared_prefs` 目录下
    - 第二个参数是操作模式，目前只有默认的 `MODE_PRIVATE` 一种，表示只有当前应用程序才可以对这个文件进行读写操作

- Activity 类中的 `getPreferences()` 方法
  - 只接收一个操作模式参数，因为使用这个方法会自动将当前 `Activity` 的类名作为 `SharedPreference` 文件名

得到了 `SharedPreferences` 对象后，就可以进行存储了，主要可以分为三步

1.调用 `SharedPreferences` 的 `edit()` 方法获取一个 `SharedPreferences.Editor` 对象

2.向 `SharedPreferences.Editor` 对象中添加数据，比如添加一个 boolean 值就使用 `putBoolean()` 方法，添加一个字符串就使用 `putString()` 方法

3.调用 `apply()` 方法将数据提交，从而完成数据存储操作

e.g.：存储数据

- 新建一个 `SharedPreferencesTest` 项目

- 写一个按钮，在点击时将数据存储到 SharedPreferences 中

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val saveButton = findViewById<Button>(R.id.saveButton)
        saveButton.setOnClickListener{
            val editor = getSharedPreferences("data", Context.MODE_PRIVATE).edit()
            editor.run {
                putString("name", "Tom")
                putInt("age", 28)
                putBoolean("married", false)
                apply()
            }
        }
    }
}

```

运行项目后点击按钮，打开 `data/data/com.example.sharedpreferencestest/shared_prefs` 会看到有一个 `data.xml` 文件

![Alt text](/android/06_storage/assets/image1.png)

### 读取数据

SharedPreferences 对象中提供了一系列的 `get` 方法用于获取存储数据，与 `put` 方法一一对应

- 第一个参数是键，第二个参数是默认值（当找不到对应值就会返回默认值）

e.g.：添加一个按钮，点击后将上面存储的数据读取并打印出来

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...

        val restoreButton = findViewById<Button>(R.id.restoreButton)
        restoreButton.setOnClickListener {
            val prefs = getSharedPreferences("data", Context.MODE_PRIVATE)
            val name = prefs.getString("name", "")
            val age = prefs.getInt("age", 0)
            val married = prefs.getBoolean("married", false)

            Log.d("MainActivity", "name is $name")
            Log.d("MainActivity", "age is $age")
            Log.d("MainActivity", "married is $married")
        }
    }
}

```

![Alt text](/android/06_storage/assets/image2.png)

## SQLite

SQLite 是一种轻量级的数据库，运算速度特别快，占用资源少，通常只需要几百 KB 就足够了，特别适合在移动端设备上使用。

- 遵循数据库的 ACID 事务
- 可以用于存储大量复杂的关系型数据
  - 例如手机短信的应用程序中可能会有很多个会话，每个会话中又会有很多条短信，大部分会话还可能各自对应通讯录中的某个联系人

### 创建数据库

Android 提供了一个 SQLiteOpenHelper 帮助类，借助这个类我们可以很简单的对数据库进行创建和升级

- SQLiteOpenHelper 是一个抽象类，意味着要使用它必须继承它

  - 两个抽象方法
    - onCreate() 和 onUpgrade()
  - 两个重要的实例方法
    - getReadableDatabase() 和 getWritableDatabase() 两者用于创建或打开已有的数据库（不存在则会进行新建），不同的是当数据库不能写入时(可能磁盘满了) getReadableDatabase() 会返回一个可读的数据库，而 getWritableDatabase() 会抛出异常

- SQLiteOpenHelper 有两个构造方法可以重写

  - 一般使用参数少的那个构造方法即可
    - 构造方法接收 4 个参数：第一个是 Context，第二个是数据库名，第三个参数是允许我们在查询数据的时候返回一个自定义的 Cursor，一般传入 null 即可，第四个参数是当前数据库的版本号，可用于对数据库进行升级

- 构建出 SQLiteOpenHelper 的实例之后，就可以调用它的 getReadableDatabase() 或 getWritableDatabase() 方法来创建或打开数据库了，数据库文件会存放在 `data/data/<package name>/databases` 目录下
  - onCreate 方法也会被执行，通常用于创建数据库表

e.g.：新建一个 `DatabaseTest` 项目

1.新建一个名为 `MyDatabaseHelper` 的文件

```kotlin
class MyDatabaseHelper(private val context: Context, name: String, version: Int) :
    SQLiteOpenHelper(context, name, null, version) {
    private val createBook = "create table book(" +
            "id integer primary key autoincrement," +
            "author text," +
            "price real," +
            "pages integer," +
            "name text)"

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(createBook)
        Toast.makeText(context, "Create Succeed", Toast.LENGTH_LONG).show()
    }

    // ...
}
```

2.修改 `MainActivity`

- 添加一个按钮，点击后创建数据库(布局文件省略)

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val dbHelper = MyDatabaseHelper(this, "BookStore.db", 1)
        val createDatabase = findViewById<Button>(R.id.createDataBase)

        createDatabase.setOnClickListener {
            dbHelper.writableDatabase
        }
    }
}

```

此时运行程序后打开会弹出 Toast，再次点后就什么都不会弹出了（onCreate 只执行一次—）

怎么证实已经创建成功了？

- 打开 Device File Explorer，能找到找到 `data/data/<package name>/databases/BookStore.db` 文件
  - 但无法查看表内容，需要借助插件 `Database Navigator`，安装后重启 Android Studio 即可

将 `DatabaseStore.db` 文件导出到本地，然后观察 Android Studio 左侧会发现多了应该 DB Browser 工具（MAC 快捷键：Ctrl + Shift + A）

- 点击左上角的 `+` 按钮，选择 `SQLite`，修改 Database file 为刚才导出的 `BookStore.db` 文件路径

![Alt text](/android/06_storage/assets/image3.png)

点击 `OK` 后，就能看到刚才创建的表了(看不到表的可以重启一下 Android Studio)

![Alt text](/android/06_storage/assets/image4.png)

### 升级数据库

可以发现上面的 `MyDatabaseHelper` 中还有一个空方法 `onUpgrade()`，这个方法是用于升级数据库

e.g.：目前数据库中已有一张表，如果要新增一张 `Category` 表，该如何做呢？

- 添加到 onCreate 方法中，会发现再次执行后不会弹出 Toast，因为数据库已经创建过了，所以 onCreate 方法不会执行
  - 可以通过卸载应用程序再重新安装，这样就会执行 onCreate 方法了（但是未免有些太极端了）

可以尝试在 `onUpgrade()` 中添加一条语句，然后卸载再安装

- 如果表已经存在了还去创建就会报错，所以需要先判断表
- 怎么让 onUpgrade() 执行呢？
  - 修改数据库版本号即可（即之前在构造方法中传入的第四个参数，之前传 1，现在只要大于 1 即可）

```kotlin
class MyDatabaseHelper(private val context: Context, name: String, version: Int) :
    SQLiteOpenHelper(context, name, null, version) {
    private val createBook = "create table book(" +
            "id integer primary key autoincrement," +
            "author text," +
            "price real," +
            "pages integer," +
            "name text)"

    private val createCategory = "create table Category(" +
            "id integer primary key autoincrement," +
            "category_name text," +
            "category_code integer)"

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(createBook)
        db.execSQL(createCategory)
        Toast.makeText(context, "Create Succeed", Toast.LENGTH_LONG).show()
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("drop table if exists Book")
        db.execSQL("drop table if exists Category")
        onCreate(db)
    }
}

```

```kotlin

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        //...
        val dbHelper = MyDatabaseHelper(this, "BookStore.db", 2)
        // ...
    }
}
```

运行后点击按钮，会发现 Toast 弹出来了，说明数据库已经升级成功了

- 导出数据库表，可以看到已经多了 Category 表（可能需要重启 IDE）

### CRUD

Android 提供了一些 API，可以不用写 SQL 语句就能直接 CRUD

- 添加数据：`insert()`
- 删除数据：`delete()`
- 修改数据：`update()`
- 查询数据：`query()`

> 如果想写 SQL 语句，则直接使用 `db.execSQL(sql String)`

#### 新增数据

修改 `activity_main.xml` 文件，添加一个按钮 `Add Data`

修改 `MainActivity`

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        val addData = findViewById<Button>(R.id.addData)
        addData.setOnClickListener {
            val db = dbHelper.writableDatabase

            val values1 = ContentValues().apply {
                // id 会自动生成
                put("name", "The Da Vinci Code")
                put("author", "Dan")
                put("pages", 454)
                put("price", 16.96)
            }
            db.insert("Book", null, values1)

            val values2 = ContentValues().apply {
                // id 会自动生成
                put("name", "The Da Vinci Code")
                put("author", "Dan")
                put("pages", 550)
                put("price", 16.96)
            }
            db.insert("Book", null, values2)
        }
    }
}

```

双击打开 table 表可以看到已经有数据了

![data](/android/06_storage/assets/image5.png)

#### 更新数据

还是老步骤，先修改 `activity_main.xml` 文件，添加一个按钮 `Update Data`，再修改 `MainActivity`

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        val updateData = findViewById<Button>(R.id.updateData)
        updateData.setOnClickListener {
            val db = dbHelper.writableDatabase
            val values = ContentValues()
            // 只需要设置需要修改的字段即可
            values.put("price", 10.00)
            // 第三四个参数用来指定修改哪些行
            db.update("Book", values, "name = ?", arrayOf("The Da Vinci Code"))
        }
    }
}
```

#### 删除数据

还是老步骤，先修改 `activity_main.xml` 文件，添加一个按钮 `Delete Data`，再修改 `MainActivity`

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        val deleteData = findViewById<Button>(R.id.deleteData)
        deleteData.setOnClickListener {
            val db = dbHelper.writableDatabase
            db.delete("Book", "pages > ?", arrayOf("500"))
        }
    }
}
```

#### 查询数据

还是老步骤，先修改 `activity_main.xml` 文件，添加一个按钮 `Query Data`，再修改 `MainActivity`

- 查询是最复杂的，最短的重载都需要传入 7 个参数
  - 第一个参数(table)：表名
  - 第二个参数(columns)：指定哪几列，如果为空，则查询所有列
  - 第三、四个参数(selection, selectionArgs)：用于约束查询某一行或某几行的数据，不指定默认查询所有行
  - 第五个参数(groupBy)：用于对查询出来的数据进行分组，不指定就不使用分组
  - 第六个参数(having)：对分组后的数据进行过滤，不指定就不使用过滤
  - 第七个参数(orderBy)：对查询出来的数据进行排序，不指定就使用默认排序

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        val queryData = findViewById<Button>(R.id.queryData)
        queryData.setOnClickListener {
            val db = dbHelper.writableDatabase
            // 查询 Book 中所有的数据
            val cursor = db.query("Book", null, null, null, null, null, null)
            if(cursor.moveToFirst()){
                do {
                    // 遍历 cursor 对象，取出数据并打印
                    val name = cursor.getString(cursor.getColumnIndex("name"))
                    val author = cursor.getString(cursor.getColumnIndex("author"))
                    val pages = cursor.getString(cursor.getColumnIndex("pages"))
                    val price = cursor.getString(cursor.getColumnIndex("price"))

                    Log.d("MainActivity", "book name is $name")
                    Log.d("MainActivity", "book author is $author")
                    Log.d("MainActivity", "book pages is $pages")
                    Log.d("MainActivity", "book price is $price")
                } while (cursor.moveToNext())
                cursor.close()
            }
        }
    }
}
```

[完整代码](https://github.com/ehxie/Android-Practice/tree/main/storage/DatabaseTest)

- [commit](https://github.com/ehxie/Android-Practice/commit/aa8a0caf9390e8e85673f9c985d6008f0a89435c)

## 最佳实践

### 事务

事务可以保证一系列操作要么成功要么失败

- 例如转账操作；A 给 B 转账分为两步，A 扣钱，B 加钱。如果这两步中间失败了，会导致只有 A 扣钱，而 B 钱没有加，所以需要事务来保证一致性

e.g.：数据库中的 `Book` 表中的数据已经很老了，现在准备全部废弃，换成新的数据

- 先使用 `delete()` 将 `Book` 表中的数据全部删除，再使用 `insert()` 插入新的数据

先在 Activity 中添加一个按钮 `Replace Data`，再修改 `MainActivity`

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val dbHelper = MyDatabase(this, "Book", 1)

        // 创建数据库和添加数据省略

        val replaceData = findViewById<Button>(R.id.replaceData)
        replaceData.setOnClickListener {
            val db = dbHelper.writableDatabase
            // 开始事务
            db.beginTransaction()
            try {
                db.delete("Book", null, null)
                if (true) {
                    // 手动抛出异常
                    throw NullPointerException()
                    val value = ContentValues().apply {
                        put("name", "Game of Thrones")
                        put("author", "hh")
                        put("pages", 720)
                        put("price", 20.82)
                    }
                }
            } catch (e: Exception) {
                db.endTransaction()
            }
        }
    }
}

```

- 点击创建数据库，再点击添加数据，此时数据库中有一条数据了
- 点击 `Replace Data`，由于事务失败了，所以数据还没有被删除

### 升级数据库的最佳写法

在之前学习的时候，直接在 `onUpgrade()` 中直接删除表，再重新执行 `onCreate` 创建新表，这种方式在开发阶段确实可以用，但是当产品真正上线后就绝对不能用了，会导致数据都丢失了

可以通过一些合理的控制，保证在升级数据库的时候数据并不会丢失

- 我们都知道数据库会有一个版本号，当指定数据库的版本号大于当前的版本号就会执行 `onUpgrade()` 方法

我们需要做的就是为每一个版本号赋予其对应的数据库变动，然后在 `onUpgrade()` 方法中对当前数据库版本好进行判断，执行相应的变动即可

e.g.：目前我们数据库很简单只有 `Book` 表，现在需要添加一个 `Category` 表

- 当用于直接安装第二版程序时就会进入 `onCreate` 方法，而老用于在使用第二版程序覆盖第一版时，就会进入 `onUpgrade()` 方法

```kotlin
class MyDatabase(private val context: Context, name: String, version: Int) :
    SQLiteOpenHelper(context, name, null, version) {

    // ...

    private val createCategory = "create table Category(" +
            "id integer primary key autoincrement," +
            "category_name text," +
            "category_code integer)"

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(createBook)
        db.execSQL(createCategory)
        Toast.makeText(context, "Create succeed", Toast.LENGTH_LONG).show()
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        if(oldVersion <= 1) {
            db.execSQL(createCategory)
        }
    }

}

```

e.g.：要给 `Book` 和 `Category` 表之间建立关联，需要在 `Book` 表添加 `category_id` 字段

```kotlin
class MyDatabase(private val context: Context, name: String, version: Int) :
    SQLiteOpenHelper(context, name, null, version) {

    private val createBook = "create table Book(" +
            "id integer primary key autoincrement," +
            "author text," +
            "price real," +
            "pages integer," +
            "name text," +
            "category_id integer)"

    // ...

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(createBook)
        db.execSQL(createCategory)
        Toast.makeText(context, "Create succeed", Toast.LENGTH_LONG).show()
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // ...
        if(oldVersion <=2) {
            db.execSQL("alter table Book add column category_id integer")
        }
    }

}
```

[完整代码](https://github.com/ehxie/Android-Practice/tree/main/storage/DatabaseBestPractice)

- [commit](https://github.com/ehxie/Android-Practice/commit/ece26c00951783b040c354b74aad6816e1868792)

本节学习的还是 Android 最传统的操作数据库的方式，Google 推出了数据库框架 `Room`

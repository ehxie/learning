# UI

新建一个 UIWidgetTest 项目

## 常用控件的使用方法

需要设置 id、layout_width、layout_height

### TextView

Android 最简单的一个控件了，用于在界面上显示一段文本信息

修改 activity_main.xml

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:id="@+id/textView"
        android:text="This is TextView"/>
</LinearLayout>
```

- TextView 相关属性修改都在这里进行修改

### Button

```xml
<--! 省略 -->
<Button
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/button"
    android:text="Button"/>
<--! 省略 -->
```

- 会发现 text 属性写的是 Button 而到了界面上显示的却是 BUTTON，这是由于 Android 的 Button 默认都会将内容的字母转换为大写，不需要可以设置属性 `android:textAllCaps=false`

绑定按钮点击事件(修改 MainActivity.kt)

- 方式一：使用函数式 API

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.button)
        // 实际上调用的是 Java 的方法，这里利用了 Java 单抽象方法接口的特效，所以直接传 lambda 表达式
        button.setOnClickListener {
            Log.d("Button", "click button")
        }
    }
}
```

方式二：实现接口

```kotlin
class MainActivity : AppCompatActivity(), View.OnClickListener {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

       val button = findViewById<Button>(R.id.button)
        button.setOnClickListener(this)
    }

    override fun onClick(v: View?) {
        when(v?.id) {
            R.id.button -> {
                Log.d("Button", "click button")
            }
        }
    }
}
```

### EditText

相当于 HTML 中的 input

- placeholder 在这里就是 `android:hint=""`

### ImageView

用于展示图片的控件

- 图片资源通常放在 `res` 中以 drawable 开头的目录下，并且要带上具体的分辨率，现在主流手机屏幕分辨率大多是 xxhdpi，所以在 res 下新建一个目录 drawable-xxhdpi，将图片放进去
- 文件名应该只包含小写字母、数字、下划线和点号，并且不得以数字开头

这里放了 img_1.png 和 img_2.png 进去

```xml
<ImageView
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/imageView"
    android:src="@drawable/img_1"/>
```

修改图片，在点击按钮时切换到 img_2

```kotlin
class MainActivityCopy : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val button = findViewById<Button>(R.id.button)
        button.setOnClickListener {
            Log.d("Button", "click button")
            val imageView = findViewById<ImageView>(R.id.imageView)
            imageView.setImageResource(R.drawable.img_2)
        }
    }
}
```

### ProcessBar

用于在界面上显示一个进度条，表示我们的程序正在加载一些数据

- 其实就是 loading

```xml
<ProgressBar
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:id="@+id/processBar"/>
```

关闭 loading 效果：设置控件的可见性(所有控件通用)

- android:visibility
  - visible：（默认值）可见的
  - invisible：不可见，但仍然占据原来的位置(点击事件无效)
  - gone：不可见且不占原来的位置了

在程序中控制可见性

```kotlin
val progressBar = findViewById<ProcessBar>(R.id.processBar)
progressBar.visibility = View.VISIBLE
```

设置为`水平进度条`

```xml
<ProgressBar
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    style="?android:attr/processBarStyleHorizontal"
    android:max="100"
    android:id="@+id/processBar"/>
```

修改进度

```kotlin
val progressBar = findViewById<ProcessBar>(R.id.processBar)
processBar.process = processBar.process + 10
```

### AlertDialog

对话框

## 3 种基本布局

布局中可以嵌套布局或者控件

### LinearLayout

线性布局，会让其所包含的控件在线性方向上排列，默认是垂直方向

- 水平方向：android:orientation="horizontal"
  - 子控件的宽度不能是 match_parent，否则就占满一行了

`android:layout_gravity`：指定控件在布局中的对齐方式

- 当排列方向是 horizontal 时，只有垂直方向上的对齐方式才会生效，因为此时水平方向上的长度是不固定的，每添加一个控件水平方向上的长度都会改变
  - vertical 同理，只有水平方向会生效

> android:gravity：指定文字在控件中的对齐方式

`layout_weight`：使用*比例*指定控件的大小

- 在手机屏幕适配方面很重要

例如写一个文本框和一个发送按钮，他们在同一行

- 宽度设置为 0dp，比例为 1:1

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="horizontal"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <EditText
        android:id="@+id/input_message"
        android:layout_width="0dp"
        android:layout_height="match_content"
        android:layout_weight="1"
        android:hint="Type something"
        />
    <Button
        android:id="@+id/send"
        android:layout_width="0dp"
        android:layout_height="match_content"
        android:layout_weight="1"
        android:text="Send"
        />
</LinearLayout>
```

这里的计算是通过把所有子控件的 layout_weight 加起来，然后分一个都去算所占的比例，然后用剩余的空间去分配

- 上面的代码总的是 2，每一个都是 1/2，而总的空间又是一整个宽度(因为他们的宽度都是0dp)

所以可以把 button 的宽度改为 match_content，把 layout_weight 去掉，就可以设置成只有 EditText 动态适应宽度了

### RelativeLayout

相对布局，可以通过相对定位的方式让控件出现在布局中的任何位置

- 可以设置在布局中的任意位置
  - 右上角：
    - android:layout_alignParentRight="true"
    - android:layout_alignParentTop="true"
- 相对布局中某个控件的位置
  - 在按钮3(@+id/button3)的右上
    - android:layout_above="@id/button3"
    - android:layout_toRightOf="@id/button3"

### FrameLayout

帧布局：默认都摆放在布局的左上角（会叠起来

## 自定义控件

Android 中所有的控件都是直接或者间接的继承 View，所有布局都是直接或者间接的继承 ViewGroup

View 是 Android 中最基本的一种 UI 控件，可以在屏幕上绘制一块区域，并能响应这块区域的各种事件

ViewGroup 是一种特殊的 View 。可以包含各种 View 或者 ViewGroup，是一个用于放置控件和布局的容器

### 引入布局

iPhone 应用的顶部都会有一个标题栏，标题栏上会有一到两个按钮，用于返回和其他操作（因为 iPhone 没有返回按钮），而 Android 也喜欢模仿 iPhone 的风格

虽然 Android 给每个 Activity 提供了标题栏的功能，但我们这里还是先不使用，而是自己自定义一个

- 如果每个 Activity 都需要标题栏，那么我们如果都重写一遍显然不太现实。我们可以引入布局的方式来解决这个问题

在 layout 中创建一个 title.xml

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@color/black"
    >
    <Button
        android:id="@+id/titleBack"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:textColor="#fff"
        android:text="back"/>

    <TextView
        android:id="@+id/titleText"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:gravity="center"
        android:layout_weight="1"
        android:text="Title Text"
        android:textColor="#fff"
        android:textSize="24sp"
        />

    <Button
        android:id="@+id/titleEdit"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:layout_margin="5dp"
        android:text="Edit"
        android:textColor="#fff"
        />
</LinearLayout>
```

在 main_activity.xml 中引入

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <include layout="@layout/title"/>
</LinearLayout>
```

把自带的标题栏隐藏掉

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // 隐藏原生标题栏
        supportActionBar?.hide()
    }
}
```

### 创建自定义控件

引入布局确实能够解决重复编写布局代码的问题，但是如果布局中的一些控件要求能够响应事件，我们还是需要在每个 Activity 中为这些控件单独编写一次事件注册的代码

- 例如返回按钮，不管是哪个 Activity 功能都是一样的

新建 `TitleLayout` 继承自 `LinearLayout` ，让其成为我们自定义的标题栏控件

```kotlin
class TitleLayout(context:Context, attrs: AttributeSet): LinearLayout(context, attrs) {
    init {
        LayoutInflater.from(context).inflate(R.layout.title, this)
        
        val titleBack = findViewById<Button>(R.id.titleBack)
        titleBack.setOnClickListener {
            val activity = context as Activity
            activity.finish()
        }
        
        val titleEdit = findViewById<Button>(R.id.titleEdit)
        titleEdit.setOnClickListener {
            // ...
        }
    }
}
```

在布局文件中添加这个自定义控件

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <com.example.uiwidgettest.TitleLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"/>
    <!--...-->
</LinearLayout>
```

## ListView

> 相当于 HTML 中的 div 加了滚动条

ListView 是最常用且最难用的控件。由于手机屏幕有限，能够一次性在屏幕上显示的内容并不多，当我们有很多数据需要展示时，就可以借助 ListView 来实现

- ListView 允许用户通过手指上下滑动的方式将屏幕外的数据滑动至屏幕内

### 简单使用

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ListView
        android:id="@+id/listView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</LinearLayout>
```

```kotlin
class MainActivity : AppCompatActivity() {
    private val data = listOf("Apple", "Banana", "Orange", "Watermelon", "Pear", "Grape", "Pineapple", "Strawberry", "Cherry", "Mango", "Apple", "Banana", "Orange", "Watermelon", "Pear", "Grape", "Pineapple", "Strawberry", "Cherry", "Mango")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 集合中的数据无法直接传递给 ListView 的，需要一个适配器来完成
        // 这个布局是 Android 的内置布局，只有一个 TextView
        val adapter = ArrayAdapter(this, android.R.layout.simple_expandable_list_item_1, data)
        val listView = findViewById<ListView>(R.id.listView)
        listView.adapter = adapter
    }
}
```

### 定制 ListView 的界面

只能显示文本就太单调了，我们希望每一项都能够自定义

需求：水果前面显示一张水果的图片

1.定义一个实体类，作为 ListView 适配器的适配类型

```kotlin
data class Fruit(val name: String, val imageId: Int)
```

2.定义一个布局，用于显示每一项的内容

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ImageView
        android:id="@+id/fruitImage"
        android:layout_width="40dp"
        android:layout_height="40dp"
        android:layout_gravity="center_vertical"
        android:layout_marginLeft="10dp"/>
    <TextView
        android:id="@+id/fruitName"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_vertical"
        android:layout_marginLeft="10dp"/>
</LinearLayout>
```

3.定义一个适配器

```kotlin
class FruitAdapter(activity: Activity, val resourceId: Int, data: List<Fruit>): ArrayAdapter<Fruit>(activity, resourceId, data) {
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = LayoutInflater.from(context).inflate(resourceId, parent, false)
        val fruitImage = view.findViewById<ImageView>(R.id.fruitImage)
        val fruitName = view.findViewById<TextView>(R.id.fruitName)
        // 获取当前 Fruit 实例
        val fruit = getItem(position)
        fruit?.let{
            fruitImage.setImageResource(it.imageId)
            fruitName.text = it.name
        }
        return view

    }
}
```

4.在 Activity 中使用

```kotlin
class MainActivity : AppCompatActivity() {
    private val data = listOf("Apple", "Banana", "Orange", "Watermelon", "Pear", "Grape", "Pineapple", "Strawberry", "Cherry", "Mango", "Apple", "Banana", "Orange", "Watermelon", "Pear", "Grape", "Pineapple", "Strawberry", "Cherry", "Mango")
    private val fruitList = ArrayList<Fruit>()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 自定义
        initFruits()
        val adapter = FruitAdapter(this, R.layout.fruit_item, fruitList)
        val listView = findViewById<ListView>(R.id.listView)
        listView.adapter = adapter
    }

    private fun initFruits() {
        repeat(2) {
            fruitList.add(Fruit("Apple", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Banana", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Orange", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Watermelon", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Pear", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Grape", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Pineapple", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Strawberry", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Cherry", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Mango", R.drawable.ic_launcher_background))
        }

    }
}
```

> ListView 需要一个 ArrayAdapter，我们只需要去构造一个就可以了，写一个 FruitAdapter 继承 ArrayAdapter，重写 getView 方法即可

### 提升 ListView 的运行效率

在 getView 方法中，每次都将布局文件重新加载，当 ListView 快速滚动时，就会导致卡顿

- getView 方法的第二个参数 convertView 就是缓存的 View，如果它不为空，那么就直接使用它，否则就重新加载布局

```kotlin
val view: View = convertView ?: LayoutInflater.from(context).inflate(resourceId, parent, false)
```

虽然不会重复加载布局了，但是在每次 getView 中仍然会调用 View 的findViewByID 方法来获取一次控件

- 可以借助 ViewHolder 来优化这一部分

> 定义了一个 ViewHolder 内部类，将 ImageView 和 TextView 的实例进行缓存

```kotlin
class FruitAdapter(activity: Activity, val resourceId: Int, data: List<Fruit>): ArrayAdapter<Fruit>(activity, resourceId, data) {
    inner class ViewHolder(val fruitImage: ImageView, val fruitName: TextView)
    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view: View
        val viewHolder: ViewHolder
        if(convertView == null){
            view = LayoutInflater.from(context).inflate(resourceId, parent, false)
            val fruitImage = view.findViewById<ImageView>(R.id.fruitImage)
            val fruitName = view.findViewById<TextView>(R.id.fruitName)
            viewHolder = ViewHolder(fruitImage, fruitName)
            view.tag = viewHolder
        } else {
            view = convertView
            viewHolder = view.tag as ViewHolder
        }
        val fruit = getItem(position)
        fruit?.let{
            viewHolder.fruitImage.setImageResource(it.imageId)
            viewHolder.fruitName.text = it.name
        }
        return view
    }
}
```

### 点击事件

```kotlin
class MainActivity : AppCompatActivity() {
    // ...
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        val listView = findViewById<ListView>(R.id.listView)
        // ...
        // 绑定点击事件
        listView.setOnItemClickListener{parent, view, position, id->
            val fruit = fruitList[position]
            Toast.makeText(this, fruit.name,Toast.LENGTH_SHORT).show()
        }
    }
}
```

## RecyclerView 更强大的滚动控件

ListView 还是存在一些问题的，例如需要一些技巧来提升它的运行效率，扩展也十分有限，只能实现垂直滚动

RecyclerView 是一个更强大的滚动控件，它不仅可以实现垂直滚动，还可以实现水平滚动，官方也更加推荐使用该控件

RecyclerView 属于新增控件，怎样才能在所有 Android 版本中使用呢？Google 将 RecyclerView 控件定义在了 AndroidX 库中，因此需要先在 build.gradle 中添加依赖

修改 `app/build.gradle`

```groovy
dependencies {
    // ...
    implementation 'androidx.recyclerview:recyclerview:1.0.0'
}
```

修改完成后需要同步一下项目，点击 `Snyc Now`

修改 `main_activity.xml`

- RecyclerView 控件不是内置在 Android SDK 中的，所以需要写完整的包路径

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recyclerView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</LinearLayout>
```

写一个适配器

```kotlin
class FruitRecyclerAdapter(private val fruitList: List<Fruit>) :
    RecyclerView.Adapter<FruitRecyclerAdapter.ViewHolder>() {
    
    // 定义一个内部类，继承 RecyclerView.ViewHolder，主构造函数中需要传入一个 View 对象
    // 这个参数通常是 RecyclerView 子项的最外层布局，可以通过 findViewById 方法来获取子项中的控件
    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val fruitImage: ImageView = view.findViewById(R.id.fruitImage)
        val fruitName: TextView = view.findViewById(R.id.fruitName)
    }

    // 创建 ViewHolder 对象，将布局文件加载进来
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.activity_main, parent, false)
        return ViewHolder(view)
    }

    // 对子项进行赋值
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val fruit = fruitList[position]
        holder.fruitImage.setImageResource(fruit.imageId)
        holder.fruitName.text = fruit.name
    }

    // 告诉 RecyclerView 当前列表有多少个子项
    override fun getItemCount() = fruitList.size
}
```

修改 `MainActivity`

```kotlin
class MainActivity : AppCompatActivity() {
    private val fruitList = ArrayList<Fruit>()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initFruits()
        // 用于指定 RecyclerView 的布局，这里使用线性布局
        val layoutManager = LinearLayoutManager(this)
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerView)
        recyclerView.layoutManager = layoutManager
        val adapter = FruitRecyclerAdapter(fruitList)
        recyclerView.adapter = adapter
   }

    private fun initFruits() {
        repeat(2) {
            fruitList.add(Fruit("Apple", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Banana", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Orange", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Watermelon", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Pear", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Grape", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Pineapple", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Strawberry", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Cherry", R.drawable.ic_launcher_background))
            fruitList.add(Fruit("Mango", R.drawable.ic_launcher_background))
        }
    }
}
```

### 横向滚动和瀑布流布局

横向滚动只需要在上面代码的基础上修改一行代码即可

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // ...
        // 新增一行代码
        layoutManager.orientation = LinearLayoutManager.HORIZONTAL
        // ...
   }
}
```

ListView 很难实现这种效果，原因是 ListView 布局是自身去管理的，而 RecyclerView 的布局是 LayoutManager 管理的

- LayoutManager 指定了一套可扩展的布局排列接口，子类只需要按照这个接口的规范来实现，就可以实现不同的布局效果

- 官方提供了很多 LayoutManager，例如 LinearLayoutManager、GridLayoutManager、StaggeredGridLayoutManager 等
  - GirdLayoutManager 用于实现网格布局
  - StaggeredGridLayoutManager 用于实现瀑布流布局

瀑布流可以实现多列，每一项高度都可以不一样

### 事件监听

RecyclerView 和 ListView 不同，RecyclerView 没有 setOnItemClickListener 方法

- 这个方法只能是子项的点击事件，而不能细化到子项中某个按钮的事件，要实现这种会比较复杂

RecyclerView 让所有的点击事件都由具体的 View 去注册

```kotlin
class FruitRecyclerAdapter(private val fruitList: List<Fruit>) :
    RecyclerView.Adapter<FruitRecyclerAdapter.ViewHolder>() {
    // ...

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view =
            LayoutInflater.from(parent.context).inflate(R.layout.activity_main, parent, false)
        val viewHolder = ViewHolder(view)

        viewHolder.apply {
            // itemView 是最外层布局，RecyclerView 的强大之处在于，可以轻松实现子项中任意控件或者布局的点击事件
            itemView.setOnClickListener {
                val position = adapterPosition
                val fruit = fruitList[position]
                Toast.makeText(parent.context, "you click view ${fruit.name}", Toast.LENGTH_SHORT).show()
            }

            fruitImage.setOnClickListener {
                val position = adapterPosition
                val fruit = fruitList[position]
                Toast.makeText(parent.context, "you click image ${fruit.name}", Toast.LENGTH_SHORT).show()
            }
        }
        return viewHolder
    }
    // ...
}
```

## 最佳实践

写一个聊天页面

### 准备气泡框背景图 9-patch

消息框是的背景是一张 9-patch 图片，在 Android Studio 中右键图片，选择`Create 9-Patch file`即可创建一张 9-patch 图片

- 9-patch 图片是可调整大小的位图，不会在拉伸时将图片均匀拉伸，而是可以指定图片的拉伸区域
- 9-patch 图片的格式是 .9.png，后缀名中包含一个点

> 记得把原图删了，因为 Android 项目中不允许同一个文件夹下有两张相同名称的图片，即使后缀名不同也不行

打开图片后可以在 4 个边框中任意拖动，调整图片的拉伸区域

![Alt text](/android/03_UI/assets/image1.png)

运行程序可以看到以下效果

![1](/android/03_UI/assets/image2.png)

### 编写精美的聊天界面

聊天界面必然有发送和接收消息，上面的只是接收消息的，我们还需要同理准备一张发送的 9-patch 图片（自己解决）

这里会使用到 RecyclerView，所以需要在 app/build.gradle 中添加依赖

```groovy
dependencies {
    // ...
    implementation 'androidx.recyclerview:recyclerview:1.0.0'
    // ...
}
```

编写主界面

修改 activity_main.xml

- RecyclerView 用于显示聊天记录
- EditText 用于输入文字，Button 用于发送消息

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:orientation="vertical"
    android:layout_height="match_parent"
    android:layout_width="match_parent"
    android:background="#d8e0e8"
    >
    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recyclerView"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"/>
    
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">
        <EditText
            android:id="@+id/inputText"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:hint="Type Something"
            android:maxLines="2"/>
        <Button
            android:id="@+id/send"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"/>
    </LinearLayout>
</LinearLayout>
```

定义消息的实体类

```kotlin
class Msg(val content: String, val type: Int) {
    companion object {
        const val TYPE_RECEIVED = 0
        const val TYPE_SENT = 1
    }
}
```

编写 ReCyclerView 的子项布局

接收消息 `msg_left_item.xml`

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:padding="10dp">
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="left"
        android:background="@drawable/message_left">
        <TextView
            android:id="@+id/leftMsg"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_margin="10dp"
            android:textColor="#fff"/>
    </LinearLayout>
</FrameLayout>
```

发送消息 `msg_right_item.xml`

```xml
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:padding="10dp">
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right"
        android:background="@drawable/message_right">
        <TextView
            android:id="@+id/rightMsg"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_margin="10dp"
            android:textColor="#000"/>
    </LinearLayout>
</FrameLayout>
```

创建一个 RecyclerView 的适配器，命名为 MsgAdapter

```kotlin
class MsgAdapter(private val msgList: List<Msg>) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    inner class LeftViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val leftMsg: TextView = view.findViewById(R.id.leftMsg)
    }

    inner class RightViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val rightMsg: TextView = view.findViewById(R.id.rightMsg)
    }

    // 返回当前 position 对应的消息类型
    override fun getItemViewType(position: Int): Int {
        return msgList[position].type
    }

    // 根据不同的 viewType 创建不同的界面，所以我们需要重写 getItemViewType 方法
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder =
        if (viewType == Msg.TYPE_RECEIVED) {
            val view =
                LayoutInflater.from(parent.context).inflate(R.layout.msg_left_item, parent, false)
            LeftViewHolder(view)
        } else {
            val view =
                LayoutInflater.from(parent.context).inflate(R.layout.msg_right_item, parent, false)
            RightViewHolder(view)
        }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val msg = msgList[position]
        when(holder) {
            is LeftViewHolder -> holder.leftMsg.text = msg.content
            is RightViewHolder -> holder.rightMsg.text = msg.content
            else -> throw IllegalArgumentException()
        }
    }

    override fun getItemCount(): Int = msgList.size
}
```

修改 MainActivity，为 RecyclerView 添加数据，并给发送按钮添加点击事件

```kotlin
class MainActivity : AppCompatActivity() {
    private val TAG = this::class.java.toString()
    private val msgList = ArrayList<Msg>()
    private lateinit var msgAdapter: MsgAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 初始化数据
        initMsg()

        // 初始化布局
        val layoutManager = LinearLayoutManager(this)
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerView)
        recyclerView.layoutManager = layoutManager

        // 绑定适配器
        // 如果是全局变量还可以使用 isInitialized 判断是否初始化，这样可以有效避免对一个变量重复初始化
        if(!::msgAdapter.isInitialized) {
            msgAdapter = MsgAdapter(msgList)
        }
        recyclerView.adapter = msgAdapter


        // 绑定点击事件
        val send = findViewById<Button>(R.id.send)
        val inputText = findViewById<EditText>(R.id.inputText)
        send.setOnClickListener {
            Log.d(TAG, "click sent ${msgList.size}")
            val content = inputText.text.toString()
            if (content.isNotEmpty()) {
                val msg = Msg(content, Msg.TYPE_SENT)
                msgList.add(msg)
                /// 当有新消息时刷新 RecyclerView 中的显示
                msgAdapter.notifyItemInserted(msgList.size - 1)
                // 将 RecyclerView 定位到最后一行
                recyclerView.scrollToPosition(msgList.size - 1)
                // 清空输入框内容
                inputText.setText("")
            }
        }
    }


    private fun initMsg() {
        val msg1 = Msg("Hello guy", Msg.TYPE_RECEIVED)
        msgList.add(msg1)
        val msg2 = Msg("Hello. Who is that?", Msg.TYPE_SENT)
        msgList.add(msg2)
        val msg3 = Msg("This is Tom. Nice talking to you.", Msg.TYPE_RECEIVED)
        msgList.add(msg3)
    }
}
```

运行结果
![123](/android/03_UI/assets/image3.png)

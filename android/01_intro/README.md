# intro

## 系统架构

Android 大致分为四层：Linux 内核层、系统运行库层、应用框架层和应用层

* Linux 内核层
  * Android 基于 Linux 内核，这一层为 Android 设备提供了底层的驱动，如显示驱动、音频驱动、照相机驱动、蓝牙驱动、Wi-Fi 驱动、电源管理等
* 系统运行库层
  * 这一层通过 C/C++ 库为 Android 系统提供了主要的特性支持，如 SQLite 提供了数据库的支持，OpenGL/ES 库提供了 3D 支持，Webkit 库提供了浏览器内核的支持等
  * 还有运行时库，主要提供了一些核心库，允许开发中使用 Java 来写 Android 程序。运行时库中还有 Dalvik 虚拟机(5.0 后改为 ART 运行环境)，使得每一个 Android 应用都能运行在独立的进程中，并且拥有一个自己的虚拟机实例
* 系统应用层
  * 提供了构建应用程序时可能会用到的各种 API
* 应用层
  * 所有安装在手机上的应用都属于这一层

## Android 应用开发特色

四大组件

* Activity、Service、BroadcastReceiver 和 ContentProvider
丰富的系统控件
* Android 提供了很多系统控件使得我们能够轻松的写出漂亮的界面
SQLite 数据库
* 轻量级、运算速度极快的嵌入式关系型数据库，不仅支持 SQL 语法，还支持通过 Android 封装好的 API 进行操作
强大的多媒体
* Android 提供了丰富的多媒体服务，例如音乐、视频、录音和拍照等

## 开发环境

JDK：Java 语言的软件开发包
Android SDK：Andorid 开发工具包
Android Studio：代码编辑器
但是现在一般都使用 kotlin 进行开发了

## 目录详解

创建一个项目

### 根目录下

build：编译时自动收藏的代码
app：项目中的代码、资源等内容都放在这
gradle：包含 gradle wrapper 的配置文件
build.gradle：全局的 gradle 构建脚本
gradle.propertier：全局的 gradle 配置文件，这里的修改会影响到项目中所有的 gradle 编译脚本
gradlew 和 gradlew.bat：用来在命令行界面执行 gradle 命令，gradlew 是 Linux 或 Mac 系统用的，而 gradlew.bat 是 Windows 系统用的
HelloWorld.iml：用于标识是一个 IntelliJ IDEA 项目
local.properties：指定本机中 Android SDK 版本，通常是自动生成的
setting.gradle：用于指定项目中所有引入的模块，通常是自动生成的无需手动修改

### app 目录中

build：和外层的 build 类似，也是编译时生成的文件，这里的内容会更加复杂
libs：项目中使用到了第三方 jar 包都放在这里，放在这里的 jar 包会自动添加到项目的构建路径里
androidTest：编写 Android Test 测试用例的，可以对项目进行一些自动化测试
java：所有 java 代码存放的地方(kotlin 也一样)
res：放资源

* drawble 开头的目录用来放图片
* mipmap 开头的目录用来放应用图标
* values 开头的目录用来放字符串、样式和颜色等配置
* layout 开头的目录用来放布局文件
AndroidManifest.xml：整个 Android 项目的配置文件，包括四大组件的注册，权限等
test：编写 Unit Test 的地方
build.gradle：app 模块的 gradle 构建脚本
proguard-rules.pro：指定项目代码的混淆规则

## build.gradle

Android 使用 gradle 来构建项目，Gradle 使用一种基于 Groovy 的领域特定语言(DSL)来进行项目设置，抛弃了传统基于 XML 的各种繁琐配置

### 最外层的 build.gradle

* repositories 的闭包都声明了 google()、jcenter()
  * 分别都对应一个代码库，google 是 Google 自家的扩展依赖库；jcenter 包含的大多是一些第三方的开源库，声明这两行后就可以在项目中引用任何 google 和 jcenter 仓库中的依赖库了
* dependencies 的闭包中使用了 classpath 声明了两个插件
  * gradle 插件：gradle 并不是为 Android 项目而开发的，所以想使用需要去声明
  * kotlin 插件：表示该项目使用 kotlin 进行开发
// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    ext.kotlin_version = "1.3.61"
    repositories {
        google()
        jcenter()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:3.5.2"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        jcenter()
    }
}

### 内层的 build.gradle

plugins {
    // 这里一般二选一，要么 'com.android.application'(应用程序模块) 要么 'com.android.library'(库模块)
    // 应用程序模块可以直接运行，而库模块需要依赖应用程序模块才能运行
    id 'com.android.application'
    // 想使用 kotlin 开发就必须声明
    id 'kotlin-android'
}

android {
    // 项目的编译版本
    compileSdkVersion 29

    defaultConfig {
        // 应用的唯一标识符，绝对不能重复
        applicationId "com.example.activitylifecycletest"
        // 项目最低兼容的 Android 系统版本
        minSdkVersion 16
        // 表示在目标版本已做过充分的测试，则会启动一些新的功能和特效
        targetSdkVersion 29
        // 项目版本号
        versionCode 1
        // 项目banbenming
        versionName "1.0"
        // 启动 JUnit 测试
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    // 用于生成安装文件的相关配置
    buildTypes {
        // 还可以配置一个 debug 用于指定生成测试版安装文件的配置，可以忽略不写
        // 指定生成正式版安装文件的配置
        release {
            // 是否进行混淆
            minifyEnabled false
            // 混淆规则文件
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}
// 指定当前项目所有的依赖关系（Android 项目一般有三种依赖关系：本地依赖、库依赖和远程依赖）
// 本地依赖对本地 jar 包或者目录添加依赖关系，库依赖对项目中的库模块添加依赖关系，远程依赖对 jcenter 仓库上的开源项目添加依赖关系
dependencies {
    // implementation fileTree 是本地依赖声明
    // implementation 是远程依赖库格式
    implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
    implementation 'androidx.core:core-ktx:1.3.1'
    implementation 'androidx.appcompat:appcompat:1.2.0'
    implementation 'com.google.android.material:material:1.2.1'
    implementation 'androidx.constraintlayout:constraintlayout:2.0.1'
    // 声明测试用例库
    testImplementation 'junit:junit:4.+'
    androidTestImplementation 'androidx.test.ext:junit:1.1.2'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
}

## 日志工具

日志工具类 Log(Android.util.log)提供了 5 个方法

* Log.v()：打印最琐碎、意义最小的日志信息
  * 级别：verbose，最低
* Log.d()：打印一些调试信息
  * 级别：debug，比 verbose 高一级
* Log.i()：打印一些比较重要的数据，这些数据是比较想看到的、可以帮助分析用户行为的
  * 级别：info，比 debug 高一级
* Log.w()：打印警告信息，提示程序这个地方可能会有潜在风险，最好去修复一下
  * 级别：warn，比 info 高一级
* Log.e()：打印程序中的错误信息
  * 级别：error，比 warn 高一级
使用 Log 而不使用 println
* println 日志开关不可控制、不能添加日志标签、日志没有级别区分
* Android Studio 中可以添加过滤器，支持自定义
  * 自定义可以设置 TAG，这就是上面 Log 打印时的第一个参数

* 也能通过日志的级别进行过滤

// 实现一个有很多焦点的图（图片轮播，有切换效果）

// 图片轮播类
const LoopImage = function (imgArr: string[], container: HTMLElement) {
    this.imgArr = imgArr;
    this.container = container;
    this.createImage = function () { } //创建轮播图片
    this.changeImage = function () { } //切换轮播图片
}

// 切换动画是多样的
// 1，上下滑动
const SlideLoopImg = function (imgArr: string[], container: HTMLElement) {
    // 构造函数继承
    LoopImage.call(this, imgArr, container);
    // 重写继承的切换下一张图片的方法
    this.changeImage = function () {
        console.log('SlideLoopImg changeImage function');
    }
}

// 2.渐隐切换类
const FadeLoopImg = function (imgArr: string[], container: HTMLElement, arrow: string[]) {
    // 构造函数继承
    LoopImage.call(this, imgArr, container);
    // 切换箭头私有变量
    this.arrow = arrow
    // 重写继承的切换下一张图片的方法
    this.changeImage = function () {
        console.log('FadeLoopImg changeImage function');
    }
}

// 实例化一个渐隐切换类
const fadeImage = new FadeLoopImg(['1.jpg', '2.jpg', '3.jpg'], document.getElementById('slide')!, ['left']);
fadeImage.changeImage()


// 以上代码有点问题，子类继承都要创建一次父类，假如父类构造函数中有很多耗时很长的逻辑，或者说每次初始化都是做一些重复性的东西，这样对性能消耗还是蛮大的
// - 为了提高性能，我们需要有一种共享机制，每当创建父类时，对于每次创建的一些简单而又差异化的属性可以放在构造函数中，而将一些消耗资源比较大的方法放在基类的原型中，这样就会避免很多不必要的消耗，这就是原型模式的一个雏形
const LoopImagePrototype = function (imgArr: string[], container: HTMLElement) {
    this.imgArr = imgArr;
    this.container = container;
}
LoopImagePrototype.prototype = {
    createImage: function () { }, //创建轮播图片
    changeImage: function () { } //切换轮播图片
}

const SlideLoopImg1 = function (imgArr: string[], container: HTMLElement) {
    // 构造函数继承
    LoopImage.call(this, imgArr, container);
}
// 原型继承
SlideLoopImg1.prototype = LoopImagePrototype.prototype
// 重写继承的切换下一张图片的方法
SlideLoopImg1.prototype.changeImage = function () {
    console.log('SlideLoopImg changeImage function');
}

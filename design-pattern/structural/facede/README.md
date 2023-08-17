# Facede

外观模式：为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口使得对子系统接口的访问更容易。

- 在 JavaScript 中有时也会用于底层结构兼容性做统一封装来简化用户使用

## 添加一个点击事件

为页面文档 document 对象绑定了一个 click 事件来实现隐藏提示框的交互功能

```js
document.onclick = function(e) {
    e.preventDefault()
    if(e.target !== document.getElementById("myInput")){
        hidePageAlert()
    }
}
function hidePageAlert() {
    // 隐藏提示框‘
}
```

上面的写法是很有问题的。因为 onclick 是 DOM [0级事件](http://www.webzsky.com/?p=731)，即这样的绑定方式相当于为元素绑定一个事件方法，如果有其他人再次通过这种方式为 document 绑定 click 事件时，就相当于重复定义了一个方法，原有的方法就会被覆盖掉，例如

```js
document.onclick = function () {
    // 其他人再次绑定
}
```

以上的方式时很危险的，需要用 DOM 2级事件处理程序提供的方法 addEventListener 来实现，但是老版本的 IE (低于9)是不支持这个方法的，所以要用 attachEvent，当然如果有不支持 DOM 2级的浏览器，就只能用上面的方法绑定了。

为元素绑定一个事件太不容易了，要做那么多兼容逻辑，所以我们可以用一种新的设计模式（外观模式）来封装他们

- 为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口使得对子系统接口的访问更容易。

```js
// 外观模式
function addEvent(dom, type, fn) {
    // 支持 DOM 2级事件的浏览器
    if(document.addEventListener) {
        dom.addEventListener(type, fn, false)
    // 对于不支持 addEventListener 但支持 attachEvent 的浏览器
    } else if(dom.attachEvent){
        dom.attachEvent(`on${type}`, fn)
    // 都不支持，但支持 on + 事件名的浏览器
    }else {
        dom[`on${type}`] = fn
    }
}
```

外观模式不仅能简化底层接口复杂性，也能解决浏览器兼容性问题。上面代码中还有两处问题，即 IE 低版本不支持 e.preventDefault() 和 e.target，这同样可以通过外观模式来解决

```js
// 获取事件对象
const getEvent = function(event){
    // 标准浏览器放回 event，IE 下 window.event
    return event || window.event
}

// 获取元素
const getTarget = function(event) {
    const event = getEvent(event)
    // 标准浏览器下 event.target，IE 下 event.srcElement
    return event.target || event.srcElement
}

// 阻止默认行为
const preventDefault = function(event) {
    const event = getEvent(event)
    // 标准浏览器
    if(event.preventDefault) {
        event.preventDefault()
    // IE
    } else {
        event.returnValue = false
    }
}
```

于是我们可以将绑定的事件改为

```js
addEvent(document, 'click', function(e) {
    preventDefault(e)
    if(getTarget(e) !== document.getElementById('myInput')) {
        hideInputAlert()
    }
})
```

降低接口复杂度和解决兼容性问题只是外观模式的一部分应用，很多代码库中都是通过外观模式来封装多个功能，简化底层操作方法

例如：我们简单实现获取元素的属性样式的简单方法库

```js
const A = {
    // 获取元素
    g: function(id) {
        return document.getElementById(id)
    },
    // 修改元素样式
    css: function(id, key, value) {
        document.getElementById(id).style[key] = value
    },
    // 修改元素属性
    attr: function(id, key, value) {
        document.getElementById(id)[key] = value
    },
    // 修改元素内容
    html: function(id, html) {
        document.getElementById(id).innerHTML = html
    },
    // 绑定事件
    on: function(id, type, fn) {
        // 这里用到了上面封装的代码
        addEvent(document.getElementById(id), type, fn)
    },
}
```

通过上面的代码库，我们操作元素的属性样式时变得更简单了

```js
A.css('box', 'background', 'red') // 设置 css 样式
A.attr('box', 'className', 'box') //设置 class
// ...
```

open class BaseView {
    fun show() {
        println(javaClass.simpleName)
    }
}

class FirstTimeView : BaseView() {}
class NormalView : BaseView() {}


fun main() {
    val isFirstTime = true
    runWithRun(isFirstTime)
    runWithoutRun(isFirstTime)
}

// 不使用 run
fun runWithoutRun(isFirstTime: Boolean) {
    if (isFirstTime) {
        FirstTimeView().show()
    } else {
        NormalView().show()
    }
}

// 使用 run
fun runWithRun(isFirstTime: Boolean) {
    run {
        if (isFirstTime) {
            FirstTimeView()
        } else {
            NormalView()
        }
    }.show()
}
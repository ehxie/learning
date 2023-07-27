import { Direction } from '../const'
import { Door, Maze, Room, Wall } from '../maze'

/**
 * 实现继承该类的类可以重新定义这些操作，返回所创建的迷宫
 *  - 不重写时就什么都不做，可以让派生类只重定义它所感兴趣的方法
 * 
 */
class MazeBuilder {
    // 创建迷宫
    buildMaze() { }
    // 有一个特定房间号的房间
    buildRoom(room: number) { }
    // 在有号码的房间之间的门
    buildDoor(roomForm: number, roomTo: number) { }
    // 返回迷宫
    getMaze() { }
}

function createMaze(builder: MazeBuilder) {
    // 生成器隐藏了迷宫的内部表示，即定义房间、门、墙壁那些类，以及这些部件是如何组装成最终的迷宫的
    builder.buildMaze()

    builder.buildRoom(1)
    builder.buildRoom(2)
    builder.buildDoor(1, 2)

    return builder.getMaze()
}

// builder 模式封装了对象是如何被创建的，意味着可以复用来创建不同种类的迷宫
function createMazeType1(builder: MazeBuilder) {
    // 生成器隐藏了迷宫的内部表示，即定义房间、门、墙壁那些类，以及这些部件是如何组装成最终的迷宫的
    builder.buildMaze()

    builder.buildRoom(1)
    // ...
    builder.buildRoom(1001)

    return builder.getMaze()
}

// MazeBuilder 自己并不创建迷宫，其作用只是用于创建迷宫定义一个接口，为了方便起见定义了一些空实现
// 子类 StandardMazeBuilder 是创建简单迷宫的实现。正在创建的迷宫放在变量 _currentMaze 中
class StandardMazeBuilder extends MazeBuilder {
    buildMaze() {
        this._currentMaze = new Maze()
    }
    buildRoom(n: number) {
        if (!this._currentMaze.roomNo(n)) {
            const room = new Room(n)
            this._currentMaze.addRoom(room)

            room.setSite(Direction.North, new Wall())
            room.setSite(Direction.South, new Wall())
            room.setSite(Direction.East, new Wall())
            room.setSite(Direction.West, new Wall())

        }
    }
    buildDoor(roomForm: number, roomTo: number) {
        const r1 = this._currentMaze.roomNo(roomForm)
        const r2 = this._currentMaze.roomNo(roomTo)
        const d = new Door(r1, r2)

        r1.setSite(this.commonWall(r1, r2), d)
        r1.setSite(this.commonWall(r2, r1), d)
    }
    getMaze() {
        return this._currentMaze
    }

    // private
    commonWall(room1: Room, room2: Room) {
        // 决定两个房间之间的公共墙壁的方位
        return Direction.East
    }
    _currentMaze: Maze
}

// 客户现在用 CreateMaze 和 StandardMazeBuilder 来创建迷宫
const main = () => {
    const builder = new StandardMazeBuilder()
    const maze = createMaze(builder)
}

// 一个特殊的 MazeBuilder 是 CountingMazeBuilder，这个生成器不创建迷宫，仅仅是对已被创建的不同种类的构件进行计数
class CountingMazeBuilder extends MazeBuilder {
    _doors
    _rooms
    constructor() {
        super()
        this._rooms = this._doors = 0
    }

    buildRoom(room: number): void {
        this._rooms++
    }

    buildDoor(roomForm: number, roomTo: number): void {
        this._doors++
    }

    getCount() {
        return {
            rooms: this._rooms,
            doors: this._doors
        }
    }
}

const main1 = () => {
    const builder = new CountingMazeBuilder()
    createMaze(builder)
    const { rooms, doors } = builder.getCount()
}
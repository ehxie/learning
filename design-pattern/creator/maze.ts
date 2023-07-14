import { Direction } from './const'

// 定义了迷宫中构件之间的主要关系
export interface MapSite {
    enter: () => void
}

// MapSite 的一个具体子类
export class Room implements MapSite {
    _sides: Array<MapSite>
    _rootNumber: number
    constructor(roomNo: number) {
        this._rootNumber = roomNo
    }
    enter: () => void
    getSite(direction: Direction): MapSite {
        return this._sides[direction]
    }
    setSite(direction: Direction, site: MapSite) {
        this._sides[direction] = site
    }
}

// 描述了一个房间的每一面所出现的墙壁
export class Wall implements MapSite {
    constructor() { }
    enter: () => void
}

// 门
export class Door implements MapSite {
    _room1: Room
    _room2: Room
    _isOpen: boolean
    constructor(room1: Room, room2: Room) {
        this._room1 = room1
        this._room2 = room2
    }
    enter: () => void
    otherSideFrom(room: Room): Room {
        return room
    }
}

// 表示房间集合
export class Maze {
    constructor() { }
    addRoom(room: Room) { }
    roomNo(roomNo: number): Room {
        return new Room(-1)
    }
}

// 创建迷宫类
/**
     * 这只是创建一个有两个房间的迷宫，但这个函数看起来已经相当复杂了
     * 虽然有办法变得更简单，即在 Room 构造函数中把四周都用墙壁初始化，但这个函数的问题不在于长度而在于不灵活
     * - 对迷宫布局进行了硬编码。改变布局意味着改变这个成员函数，或者重新定义它（即重新实现整个过程，或者对部分进行改变），这都容易产生错误且不利于重用
     */
function createMaze() {
    const aMaze = new Maze()
    const r1 = new Room(1)
    const r2 = new Room(2)
    const theDoor = new Door(r1, r2)

    aMaze.addRoom(r1)
    aMaze.addRoom(r2)

    r1.setSite(Direction.North, new Wall())
    r1.setSite(Direction.East, theDoor)
    r1.setSite(Direction.South, new Wall())
    r1.setSite(Direction.West, new Wall())

    r2.setSite(Direction.North, new Wall())
    r2.setSite(Direction.East, new Wall())
    r2.setSite(Direction.South, new Wall())
    r2.setSite(Direction.West, theDoor)
}
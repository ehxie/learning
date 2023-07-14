import { Direction } from '../const'
import { Room, Wall, Door, Maze } from '../maze'

class MazeFactory {
    makeMaze(): Maze {
        return new Maze()
    }

    makeWall(): Wall {
        return new Wall()
    }

    makeRoom(roomNo: number): Room {
        return new Room(roomNo)
    }

    makeDoor(room1: Room, room2: Room): Door {
        return new Door(room1, room2)
    }
}

function createMaze(factory: MazeFactory): Maze {
    const aMaze = factory.makeMaze()

    const r1 = factory.makeRoom(1)
    const r2 = factory.makeRoom(2)
    const aDoor = factory.makeDoor(r1, r2)

    aMaze.addRoom(r1)
    aMaze.addRoom(r2)

    r1.setSite(Direction.North, factory.makeWall())
    r1.setSite(Direction.East, aDoor)
    r1.setSite(Direction.South, factory.makeWall())
    r1.setSite(Direction.West, factory.makeWall())
    r2.setSite(Direction.North, factory.makeWall())
    r2.setSite(Direction.East, factory.makeWall())
    r2.setSite(Direction.South, factory.makeWall())
    r2.setSite(Direction.West, aDoor)

    return aMaze
}

// 创建一个 MazeFactory 的子类 EnchantedMazeFactory，这是一个创建施了魔法的迷宫的工厂
// EnchantedMazeFactory 将重新定义不同的成员函数并返回 Room，Wall 等不同的子类
class EnchantedRoom extends Room{
    constructor(roomNo: number, caseSpell:() => void) {
        super(roomNo)
        caseSpell()
    }
}
class DoorNeedingSpell extends Door{}
class EnchantedMazeFactory extends MazeFactory {
    makeRoom(roomNo: number) {
        return new EnchantedRoom(roomNo, this.caseSpell)
    }
    makeDoor(room1: Room, room2: Room) {
        return new DoorNeedingSpell(room1, room2)
    }
    caseSpell(){}
}

// 假设我们想生成一个迷宫游戏，每个房间可以有一个炸弹
// - 如果炸弹爆炸，它将毁坏墙壁
//   - 我们可以生成一个 Room 的子类以明了是否有一个炸弹在房间中以及炸弹是否爆炸了（RoomWithABomb）
//   - 也需要一个 Wall 的子类以明了对墙壁的损坏（BombedWall）
//   - 最后需要定义一个 BombedMazeFactory，它是 MazeFactory 类的子类，保证了墙壁是 BombedWall 类的而房间是 RoomWithABomb 的。（BombedMazeFactory 仅需要重新定义两个函数）
class RoomWithABomb extends Room{}
class BombedWall extends Wall{}

class BombedMazeFactory extends MazeFactory {
    makeWall() {
        return new BombedWall()
    }
    makeRoom(roomNo: number) {
        return new RoomWithABomb(roomNo)
    }
}

// 为了建造一个包含炸弹的简单迷宫，我们仅用 BombedMazeFactory 调用 CreateMaze
function createBombMaze(){
    const factory = new BombedMazeFactory()
    createMaze(factory)
}

// 注意：MazeFactory 仅是工厂方法的一个集合，这是最通常的实现 AbstractFactory 模式的方式。
// MazeFactory 即作为一个 AbstractFactory 也作为 ConcreteFactory，因为 MazeFactory 是一个完全由工厂方法组成的具体类，通过生成一个子类并重定义需要改变的操作，很容易生成一个新的 MazeFactor
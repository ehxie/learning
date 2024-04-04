# Redis

Redis(Remote Dictionary Server) 是一个开源内存数据库。采用 Key-Value 键值对的方式提供数据结构存储

> 通常静态资源(HTML、CSS、JS、图片等)的缓存可以使用 nginx，而数据库的缓存一般就使用 redis(减少数据库压力)

## 一般作用

- 缓存
- 分布式锁
- 高效的数据结构和算法

> Redis 也可用作消息队列和流处理，但强烈不推荐这样用，请使用专门的消息队列如 Kafka、RabbitMQ

## 常见数据结构

String 字符串

- 缓存、分布式锁、计数器

Set 集合

- 去重、交集(共同关注)、并集

List 列表

- Queue、Stack

Hash 哈希表

- 字典

Sorted set 有序集合(Zset)

- 排行榜、热搜

Bitmap 位图

- 在线人数、精确去重估计

HyperLogLog 基数估算

- 估算不重复元素的数量

## 特点

高性能

- 数据存储在内存重，读写速度非常快
- ANSI C 编写，底层采用多路复用和非阻塞模型(异步 IO)

持久化

- 快照 RDB(Redis DataBase)
- 日志 AOF(Append Only File)

高可用/分布式

- Sentinel 哨兵模式

- Replication 主从复制

- Redis Cluster 分布式集群

## Docker 安装 Redis

### 安装

Redis 不支持 Window 安装，所以需要用 Docker 来进行安装

[参考](https://www.cnblogs.com/yyee/p/12827739.html)

1、下载 Redis

```bash
# 下载镜像
docker pull redis:7.2

# 查看是否下载成功
docker images
```

2、安装 Redis 容器

```bash
docker run --name redis7 -p 6379:6379 -d redis:7.2
```

> 使用 docker ps -a 可以查看已安装容器

3、进入容器

```bash
docker exec -it redis7 bash
```

### redis 图形客户端

- RedisInsight
- Another Redis Desktop Manager

```bash
# 使用 docker 安装 web 版的 RedisInsight
docker run -d -p 8001:8001 redislabs/redisinsight:1.14.0
```

在浏览器输入 `localhost:8001` 打开图形化界面

- ip 不能输入 127.0.0.1 因为运行在容器中，需要输入本机 ip(终端输入 ipconfig)
- 端口 6379

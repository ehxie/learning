[neofetch](https://github.com/dylanaraps/neofetch)

## 安装

brew install neofetch

- 安装完成后在终端就可以使用 neofetch 命令查看了

```shell
neofetch
```

配置文件所在路径

```shell
${HOME}/.config/neofetch/config.conf
```

## 自定义输出图标

[图片路径配置](https://github.com/dylanaraps/neofetch/wiki/Images-in-the-terminal#image-source)

ascii art 参考

- <https://fsymbols.com/text-art/#all_cats>
  - 第一行需要加上 `${c1}`, [官方文档 ascii 格式说明](https://github.com/dylanaraps/neofetch/wiki/Custom-Ascii-art-file-format)
- 我把图片都存到了和配置文件相同目录下的 ascii-art 目录中(${HOME}/.config/neofetch/ascii-art)

把配置文件中的 image_source 路径改为你要显示的图片的路径即可

## 给输出增加点颜色

[lolcat](https://github.com/busyloop/lolcat)

```shell
brew install lolcat
```

## 在每次打开控制台时启动

我用的是 zsh，所以直接配置 `~/.zshrc` 即可

- 如果是 bash，则配置 `~/.bashrc`

```text
# 放在文件开头 neofetch
neofetch | lolcat
```

## 拓展

如果想要将图片转换为 ascii，可以使用 [jp2a](https://github.com/cslarsen/jp2a)

## 我的配置

[配置](/useful-devlopment-tools/neofetch/conf/)

#!/bin/bash

SPACE_ID=${NAME#*.}

# 引入自动映射字典（将 App 名称转为原版官方 Logo）
source ~/.config/sketchybar/icon_map.sh

# 读取该桌面所有 App 名字，使用 sort -u 去重，并清除空行
APPS=$(yabai -m query --windows --space $SPACE_ID | jq -r '.[].app' | sort -u | sed '/^$/d')

ICON_STRING=""
if [ -z "$APPS" ]; then
  # 桌面为空时，显示一个横杠
  ICON_STRING="—"
else
  # 调用字典翻译图标
  while IFS= read -r app; do
    __icon_map "$app"
    ICON_STRING="$ICON_STRING $icon_result"
  done <<< "$APPS"

  # 去除首尾多余空格
  ICON_STRING=$(echo "$ICON_STRING" | xargs)
fi

# 使用 SketchyBar 原生高亮判定，产生颜色渐变
if [ "$SELECTED" = "true" ]; then
  # 选中状态：纯白背景，深邃黑图标
  sketchybar --animate sin 10 --set $NAME icon="$ICON_STRING" \
                         background.color=0xffffffff \
                         icon.color=0xff1c1c1e
else
  # 未选中状态：半透明深灰背景，纯白图标
  sketchybar --animate sin 10 --set $NAME icon="$ICON_STRING" \
                         background.color=0x661c1c1e \
                         icon.color=0xffffffff
fi

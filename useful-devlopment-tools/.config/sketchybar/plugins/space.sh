#!/bin/bash

SPACE_ID=${NAME#*.}

# 引入自动映射字典（将 App 名称转为原版官方 Logo）
source ~/.config/sketchybar/icon_map.sh

# 读取该桌面的 App 名字：只统计标准窗口(AXStandardWindow)且未最小化的，
# 借此滤掉辅助进程窗口(如 Lark Helper)和已最小化的窗口；再 sort -u 去重、清空行
APPS=$(yabai -m query --windows --space $SPACE_ID \
  | jq -r '.[] | select(.subrole=="AXStandardWindow" and .["is-minimized"]==false) | .app' \
  | sort -u | sed '/^$/d')

ICON_STRING=""
if [ -z "$APPS" ]; then
  ICON_STRING="—"
else
  while IFS= read -r app; do
    __icon_map "$app"
    ICON_STRING="$ICON_STRING $icon_result"
  done <<< "$APPS"
  ICON_STRING=$(echo "$ICON_STRING" | xargs)
fi

# icon 显示 App logo，label 显示桌面编号（叠在右上角）
if [ "$SELECTED" = "true" ]; then
  # 选中：纯白背景，深黑图标，深黑数字
  sketchybar --animate sin 10 --set $NAME icon="$ICON_STRING" \
                         label="$SPACE_ID" \
                         label.color=0xff1c1c1e \
                         background.color=0xffffffff \
                         icon.color=0xff1c1c1e
else
  # 未选中：半透明深灰背景，白图标，白数字
  sketchybar --animate sin 10 --set $NAME icon="$ICON_STRING" \
                         label="$SPACE_ID" \
                         label.color=0xffffffff \
                         background.color=0x661c1c1e \
                         icon.color=0xffffffff
fi

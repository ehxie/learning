#!/bin/bash

# 显示器热插拔（插拔外接屏）时触发。
# 目标：重建桌面指示器，让所有桌面按当前 yabai 的 space->display 映射重新绑定，
# 否则拔掉外接屏后，原本绑在外接屏上的桌面会因目标显示器不存在而被丢到屏幕外（不显示）。
#
# 注意：`sketchybar --reload` 本身会再次派发 display_change 事件。
# 若无条件 reload 会造成死循环，因此这里用「布局签名」做守卫：
#   仅当 space->display 映射真的发生变化时才 reload。
# 真正插拔时：签名变化 -> reload 一次；reload 触发的 display_change 再次进入本脚本，
#   此时签名已一致 -> 不再 reload，循环终止。

SIG_FILE="/tmp/sketchybar_display_sig"

# 等 yabai 完成 space 到 display 的重新分配
sleep 1

# 当前布局签名，例如 "1:1,2:1,3:1,4:2,5:2"
CURRENT_SIG=$(yabai -m query --spaces 2>/dev/null \
  | jq -r '[.[] | "\(.index):\(.display)"] | join(",")')

# yabai 未就绪/查询失败时不动作，避免误 reload
[ -z "$CURRENT_SIG" ] && exit 0

PREV_SIG=""
[ -f "$SIG_FILE" ] && PREV_SIG=$(cat "$SIG_FILE")

if [ "$CURRENT_SIG" != "$PREV_SIG" ]; then
  echo "$CURRENT_SIG" > "$SIG_FILE"
  sketchybar --reload
fi

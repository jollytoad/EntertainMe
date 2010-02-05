#!/bin/sh
export HOME=/home/mark
echo "Content-type: text/plain"
echo
$HOME/bin/get_iplayer --no-subdir --stream --type=liveradio --pid="$1" --player="/usr/bin/mplayer -really-quiet -vo null -cache 128 -" --quiet >/dev/null 2>&1 &


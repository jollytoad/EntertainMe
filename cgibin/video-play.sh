#!/bin/sh
. $PWD/env.sh
export DISPLAY
echo "Content-type: text/plain"
echo
f=$(echo $1 | sed -r "s/%20/ /g")
echo "$PWD/files/$f"
/usr/bin/vlc --fullscreen --play-and-exit "$PWD/files/$f" >/dev/null 2>&1 &


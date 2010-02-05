#!/bin/sh
. $PWD/env.sh
export DISPLAY
echo "Content-type: text/plain"
echo
/usr/bin/vlc --fullscreen --play-and-exit "$PWD/files/$1" >/dev/null 2>&1 &


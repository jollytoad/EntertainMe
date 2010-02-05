#!/bin/sh
. $PWD/env.sh
export DISPLAY
echo "Content-type: text/plain"
echo
/usr/bin/vlc --fullscreen --play-and-exit "$1" >/dev/null 2>&1 &


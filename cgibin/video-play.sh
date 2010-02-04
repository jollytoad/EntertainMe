#!/bin/sh
echo "Content-type: text/plain"
echo
DISPLAY=:0.0 /usr/bin/vlc --fullscreen --play-and-exit $1 >/dev/null 2>&1 &


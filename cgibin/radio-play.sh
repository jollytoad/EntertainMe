#!/bin/sh
ARGS=$1
IFS=";"
set -- $ARGS
. $PWD/env.sh
export HOME
echo "Content-type: text/plain"
echo
$HOME/bin/get_iplayer --no-subdir --stream --type=$1 --pid="$2" --player="/usr/bin/mplayer -really-quiet -vo null -cache 128 -" --quiet >/dev/null 2>&1 &


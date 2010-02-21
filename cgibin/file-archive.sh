#!/bin/bash
ARGS=$1
IFS=";"
set -- $ARGS
SRC="$PWD/files/$1"
DST=$PWD/files/$(dirname "$2")
DIR=$(dirname "$SRC")
echo "Content-type: text/plain"
echo
mkdir -p "$DST" && mv -n "$SRC" "$DST" && rmdir "$DIR"


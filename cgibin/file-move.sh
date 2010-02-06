#!/bin/bash
ARGS=$1
IFS=";"
set -- $ARGS
DIR=$PWD/files/$(dirname "$2")
echo "Content-type: text/plain"
echo
mkdir -p "$DIR" && mv -n "$PWD/files/$1" "$DIR"


#!/bin/bash
ARGS=$1
IFS=";"
set -- $ARGS
echo "Content-type: text/plain"
echo
mv -n "$PWD/files/$1" "$PWD/files/$2"


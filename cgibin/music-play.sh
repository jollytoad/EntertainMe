#!/bin/sh
. $PWD/env.sh
export MPD_HOST MPD_PORT
echo "Content-type: text/plain"
echo
if [ "$1" ]; then
	$MPC clear >/dev/null
	$MPC load "$1" >/dev/null
fi
$MPC play


#!/bin/sh
. $PWD/env.sh
export MPD_HOST MPD_PORT
echo "Content-type: text/plain"
echo
/usr/bin/mpc lsplaylists


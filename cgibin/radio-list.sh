#!/bin/sh
. $PWD/env.sh
export HOME
echo "Content-type: text/plain"
echo
$HOME/bin/get_iplayer --type=liveradio --listformat="radio|<pid>|<name>|<thumbnail>"


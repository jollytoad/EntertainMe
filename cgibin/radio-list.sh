#!/bin/sh
export HOME=/home/mark
echo "Content-type: text/plain"
echo
$HOME/bin/get_iplayer --type=liveradio --listformat="radio|<pid>|<name>|<thumbnail>"


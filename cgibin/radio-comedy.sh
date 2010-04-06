#!/bin/sh
. $PWD/env.sh
export HOME
echo "Content-type: text/plain"
echo
$HOME/bin/get_iplayer --type=radio --category=comedy --listformat="radio|<pid>|<name>|<episode>|<channel>|<thumbnail>|<desc>" | grep -E '^  radio'


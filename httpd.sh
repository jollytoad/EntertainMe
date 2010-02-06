#!/bin/sh
bozohttpd -bs -I 8088 -c cgibin . >httpd.log 2>&1


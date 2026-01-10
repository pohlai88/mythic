#!/bin/bash
# log-activity.sh
json_input=$(cat)
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
mkdir -p "$(dirname /tmp/cursor-activity.log)"
echo "[$timestamp] AGENT RESPONSE" >> /tmp/cursor-activity.log
exit 0

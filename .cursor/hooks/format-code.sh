#!/bin/bash
# format-code.sh
json_input=$(cat)
file_path=$(echo "$json_input" | jq -r '.file_path // empty')
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$timestamp] FORMAT: $file_path" >> /tmp/cursor-format.log
exit 0

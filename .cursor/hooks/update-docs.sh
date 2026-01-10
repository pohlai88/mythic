#!/bin/bash
# update-docs.sh
json_input=$(cat)
file_path=$(echo "$json_input" | jq -r '.file_path // empty')
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$timestamp] DOC CHECK: $file_path" >> /tmp/cursor-docs.log
exit 0

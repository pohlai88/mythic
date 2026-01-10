#!/bin/bash
# audit-command.sh
json_input=$(cat)
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
command=$(echo "$json_input" | jq -r '.command // empty')
mkdir -p "$(dirname /tmp/cursor-audit.log)"
echo "[$timestamp] COMMAND: $command" >> /tmp/cursor-audit.log
cat << EOF
{
  "continue": true,
  "permission": "allow"
}
EOF

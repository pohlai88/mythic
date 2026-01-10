#!/bin/bash
# validate-prompt.sh
json_input=$(cat)
prompt=$(echo "$json_input" | jq -r '.prompt // empty')
timestamp=$(date '+%Y-%m-% %H:%M:%S')
echo "[$timestamp] PROMPT VALIDATION" >> /tmp/cursor-prompts.log
cat << EOF
{
  "continue": true
}
EOF

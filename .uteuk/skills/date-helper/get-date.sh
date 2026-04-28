#!/bin/bash
# Get current date from internet time API
# Usage: source get-date.sh

# Fetch current date from worldtimeapi.org
DATE_INFO=$(curl -s "http://worldtimeapi.org/api/ip" 2>/dev/null || echo "")

if [ -n "$DATE_INFO" ]; then
    # Extract date components from API response
    CURRENT_YEAR=$(echo "$DATE_INFO" | grep -o '"year":[0-9]*' | cut -d':' -f2)
    CURRENT_MONTH=$(echo "$DATE_INFO" | grep -o '"month":[0-9]*' | cut -d':' -f2)
    CURRENT_DAY=$(echo "$DATE_INFO" | grep -o '"day":[0-9]*' | cut -d':' -f2)
    CURRENT_DATETIME=$(echo "$DATE_INFO" | grep -o '"datetime":"[^"]*' | cut -d'"' -f4)
else
    # Fallback to system date if API fails
    CURRENT_YEAR=$(date +%Y)
    CURRENT_MONTH=$(date +%m)
    CURRENT_DAY=$(date +%d)
    CURRENT_DATETIME=$(date +%Y-%m-%dT%H:%M)
fi

# Export for use in other scripts
export CURRENT_YEAR
export CURRENT_MONTH
export CURRENT_DAY
export CURRENT_DATETIME
export CURRENT_DATE="${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}"

# Output for display
echo "Current Date: ${CURRENT_DATE}"
echo "Current Year: ${CURRENT_YEAR}"

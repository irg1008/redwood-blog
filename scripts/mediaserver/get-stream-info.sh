#!/bin/bash

# Input stream
INPUT="-" # Change to your input source, e.g., a file or URL

# Get source resolution
RESOLUTION=$(ffprobe -v error \
  -select_streams v:0 -show_entries stream=width,height \
  -of csv=p=0 "$INPUT")
echo "Source resolution: $RESOLUTION" >/res.log

SOURCE_WIDTH=$(echo "$RESOLUTION" | cut -d',' -f1)
SOURCE_HEIGHT=$(echo "$RESOLUTION" | cut -d',' -f2)

# Check if resolution was successfully retrieved
if [[ -z "$SOURCE_WIDTH" || -z "$SOURCE_HEIGHT" ]]; then
  echo "Error: Unable to determine the source resolution."
  exit 1
fi

echo "Source resolution: ${SOURCE_WIDTH}x${SOURCE_HEIGHT}" >/res.log

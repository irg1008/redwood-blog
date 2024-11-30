#!/bin/bash

# Input stream
INPUT="-" # Change to your input source, e.g., a file or URL

# Define target resolutions and bitrates in descending order
RESOLUTIONS=("2560x1440" "1920x1080" "1280x720" "854x480")
BITRATES=("8000k" "5000k" "2000k" "1000k")

# Slice from max resolution if specified
MAX_RES=$1

if [[ -z "$MAX_RES" ]]; then
  echo "Error: No max resolution specified."
  exit 1
fi

# Find index of MAX_RES in RESOLUTIONS array
INDEX=-1
for i in "${!RESOLUTIONS[@]}"; do
  if [[ "${RESOLUTIONS[$i]}" == "$MAX_RES" ]]; then
    INDEX=$i
    break
  fi
done

# Exit if MAX_RES is not found in RESOLUTIONS
if [[ $INDEX -eq -1 ]]; then
  echo "Error: Specified resolution not found in RESOLUTIONS array."
  exit 1
fi

# Slice arrays from the found index onward
SLICED_RESOLUTIONS=("${RESOLUTIONS[@]:$INDEX}")
SLICED_BITRATES=("${BITRATES[@]:$INDEX}")

# Construct ffmpeg command
FFMPEG_CMD="ffmpeg -loglevel quiet -hide_banner -fflags nobuffer -i $INPUT"

# Add the appropriate number of -map v:0 arguments
for ((i = 0; i < ${#SLICED_RESOLUTIONS[@]}; i++)); do
  FFMPEG_CMD+=" -map v:0"
done

# Add audio map
FFMPEG_CMD+=" -map a:0"

# Add valid streams based on source resolution
MAP_INDEX=0
for i in "${!SLICED_RESOLUTIONS[@]}"; do
  RES=${SLICED_RESOLUTIONS[$i]}
  BITRATE=${SLICED_BITRATES[$i]}
  FFMPEG_CMD+=" -c:v:$MAP_INDEX h264 -preset veryfast -b:v:$MAP_INDEX $BITRATE -s:v:$MAP_INDEX $RES"
  MAP_INDEX=$((MAP_INDEX + 1))
done

# Add audio mapping and output options for adaptive bitrate streams
FFMPEG_CMD+=" -c:a copy -force_key_frames source -cluster_time_limit 0 -f matroska -"

# Run the ffmpeg command
$FFMPEG_CMD

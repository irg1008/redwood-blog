# #!/bin/bash

# Set the input stream URL
INPUT_URL="https://localhost:8888/o2jgfnx4gs7v8h0upv2ttvq7/index.m3u8?jwt=eyJhbGciOiJQUzI1NiIsImtpZCI6ImJhc2UifQ.eyJtZWRpYW10eF9wZXJtaXNzaW9ucyI6W3siYWN0aW9uIjoicHVibGlzaCIsInBhdGgiOiJvMmpnZm54NGdzN3Y4aDB1cHYydHR2cTcifSx7ImFjdGlvbiI6InJlYWQiLCJwYXRoIjoibzJqZ2ZueDRnczd2OGgwdXB2MnR0dnE3In1dLCJleHAiOjE3Mjc4MTIxNzYsImlhdCI6MTcyNzgxMDM3Nn0.nZB0kRE1ibnP_RlmOIhhQCLZZXlpuNBPgI6NnzbQmOUhJuV9sT0YOHNqFjrhuwWkSZhrBqz8rAqd3w07gtAu72s-YJ5NrW_met6wcWt7mp7EnXSrPYJoY8vVWLax0md1s_Hb-lAIpj82IhKtAi-q3hs_ojHOn077vYtg_0Vqr3iOi4mt2_VfDf_wzCpivoXanNj94Ofjoi19s5R4SbDALN29SCu5ZoI7ZSyIEJ_FhwhtN8A6M5SlMhcuaMdA89nDpV3iP6DitT9BFJd78kPesLos9Xp_oWhQdYLM3XyQomEOGlL90oaBPWL2sdTAoVdVu2jW-alTRUPXtOwf6PFePw"

# # Create a directory called "dump" if it doesn't exist
# mkdir -p dump

# # Get the stream resolution
# RESOLUTION=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$INPUT_URL")

# # Check if ffprobe returned valid resolution
# if [[ -z "$RESOLUTION" ]]; then
#   echo "Failed to retrieve resolution. Please check the input URL."
#   exit 1
# fi

# # Parse the resolution
# IFS='x' read -r WIDTH HEIGHT <<< "$RESOLUTION"

# # Check if WIDTH or HEIGHT are empty
# if [[ -z "$WIDTH" || -z "$HEIGHT" ]]; then
#   echo "Width or height is empty. Exiting."
#   exit 1
# fi

# # Create an array for resolutions we want to support
# declare -A RESOLUTIONS

# # Include original resolution
# RESOLUTIONS["index"]=$WIDTH:$HEIGHT

# # Define common lower resolutions
# COMMON_HEIGHTS=(1080)  # You can add more heights here if needed

# # Add only valid resolutions lower than the original height
# for h in "${COMMON_HEIGHTS[@]}"; do
#   if [ "$HEIGHT" -gt "$h" ]; then
#     # Calculate width based on aspect ratio
#     NEW_WIDTH=$((WIDTH * h / HEIGHT))

#     # Make sure NEW_WIDTH is divisible by 2
#     if (( NEW_WIDTH % 2 != 0 )); then
#       NEW_WIDTH=$((NEW_WIDTH + 1))  # Round up to the nearest even number
#     fi

#     RESOLUTIONS["$h"]=$NEW_WIDTH:$h
#   fi
# done

# # Create the master m3u8 file
# MASTER_M3U8="#EXTM3U8\n"

# # Build filter_complex and output options for ffmpeg
# FILTER_COMPLEX=""
# OUTPUT_OPTIONS=""

# # Generate HLS streams for valid resolutions
# for RES_HEIGHT in "${!RESOLUTIONS[@]}"; do
#   RESOLUTION="${RESOLUTIONS[$RES_HEIGHT]}"
#   WIDTH=$(echo "$RESOLUTION" | cut -d':' -f1)
#   HEIGHT=$(echo "$RESOLUTION" | cut -d':' -f2)

#   # Estimate bandwidth based on resolution
#   BANDWIDTH=$((WIDTH * HEIGHT * 3 / 1000))  # Rough estimate

#   # Create individual resolution playlist filename
#   OUTPUT_FILE="dump/${RES_HEIGHT}.m3u8"  # e.g., "dump/720.m3u8"

#   # Append to filter_complex
#   FILTER_COMPLEX+="[0:v]scale=$WIDTH:$HEIGHT,setpts=PTS-STARTPTS[v$RES_HEIGHT];"

#   # Append output options for HLS
#   OUTPUT_OPTIONS+="-map [v$RES_HEIGHT] -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename 'dump/${RES_HEIGHT}_%03d.ts' $OUTPUT_FILE "

#   # Add the stream to the master playlist
#   MASTER_M3U8+="#EXT-X-STREAM-INF:BANDWIDTH=${BANDWIDTH},RESOLUTION=${WIDTH}x${HEIGHT}\n"
#   MASTER_M3U8+="$OUTPUT_FILE\n"  # Point to the generated .m3u8 file
# done

# # Finalize filter_complex
# FILTER_COMPLEX="${FILTER_COMPLEX%?}"  # Remove the last semicolon

# # Start the ffmpeg command
# ffmpeg -i "$INPUT_URL" -filter_complex "$FILTER_COMPLEX" $OUTPUT_OPTIONS 2> dump/ffmpeg_error.log

# # Save the master m3u8 file
# echo -e "$MASTER_M3U8" > dump/master.m3u8

# # Output the master m3u8 file
# cat dump/master.m3u8

ffmpeg -i $INPUT_URL \
  -filter_complex "[0:v]split=3[v1][v2][v3]; \
  [v1]scale=1280:720,setpts=PTS-STARTPTS[vout1]; \
  [v2]scale=1920:1080,setpts=PTS-STARTPTS[vout2]; \
  [v3]scale=2560:1440,setpts=PTS-STARTPTS[vout3]" \
  -map "[vout1]" -c:v:0 libx264 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "dump/720_%03d.ts" "dump/720p.m3u8" \
  -map "[vout2]" -c:v:1 libx264 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "dump/1080_%03d.ts" "dump/1080p.m3u8" \
  -map "[vout3]" -c:v:2 libx264 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "dump/1440_%03d.ts" "dump/1440p.m3u8" \
  -f hls -hls_time 10 -hls_list_size 0 -hls_flags delete_segments -hls_playlist_type event "dump/master.m3u8"

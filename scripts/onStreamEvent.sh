#!/bin/sh

EVENT=$1


if [ -z "$MTX_PATH" ] || [ -z "$MTX_SOURCE_ID" ] || [ -z "$EVENT" ]; then
  echo "Error: One or more required values are missing."
  echo "MTX_PATH: $MTX_PATH"
  echo "MTX_SOURCE_ID: $MTX_SOURCE_ID"
  echo "Event: $EVENT"
  exit 1
fi


# if [ "$EVENT" = "publish" ]; then
#   # STREAM_URL="$MEDIA_SERVER_WEBRTC_URL/$MTX_PATH/whip$MTX_QUERY"
#   # echo "STREAM_URL: $STREAM_URL"
#   # ffmpeg -i $MEDIA_SERVER_HLS_URL/$MTX_PATH/whip?$MTX_QUERY -c copy -f webrtc $MEDIA_SERVER_WEBRTC_URL/$MTX_PATH-720/whip?$MTX_QUERY
# fi


JSON_PAYLOAD=$(cat <<EOF
{
  "streamPath": "$MTX_PATH",
  "connectionId": "$MTX_SOURCE_ID",
  "event": "$EVENT"
}
EOF
)

TIMESTAMP=$(date +%s%3N)

SIGNATURE=$(echo -n "$TIMESTAMP.$JSON_PAYLOAD" | \
  openssl dgst -sha256 -hmac "$MEDIA_SERVER_SECRET" | \
  awk '{print $2}')

AUTH_HEADER="t=$TIMESTAMP,v1=$SIGNATURE"

curl -X POST \
  -H "$MEDIA_SERVER_SIGNATURE: $AUTH_HEADER" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  "$MEDIA_SERVER_EVENT_URI"

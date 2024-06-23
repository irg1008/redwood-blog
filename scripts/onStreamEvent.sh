#!/bin/sh

if [ -z "$MTX_PATH" ] || [ -z "$MTX_SOURCE_ID" ] || [ -z "$1" ]; then
  echo "Error: One or more required values are missing."
  echo "MTX_PATH: $MTX_PATH"
  echo "MTX_SOURCE_ID: $MTX_SOURCE_ID"
  echo "Event: $1"
  exit 1
fi

JSON_PAYLOAD=$(cat <<EOF
{
  "streamPath": "$MTX_PATH",
  "connectionId": "$MTX_SOURCE_ID",
  "event": "$1"
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

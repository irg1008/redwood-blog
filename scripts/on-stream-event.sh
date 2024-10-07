#!/bin/bash

if [ -z "$MEDIA_SERVER_SECRET" ] ||
  [ -z "$MEDIA_SERVER_SIGNATURE_HEADER" ] ||
  [ -z "$MEDIA_SERVER_EVENT_URI" ] ||
  [ -z "$MEDIA_SERVER_TRIGGER_HEADER" ]; then
  echo "Missing required environment variables."
  exit 1
fi

# Get the trigger name (first argument)
TRIGGER_NAME="$1"

# Read from standard input (the payload)
PAYLOAD=""

while IFS= read -r LINE; do
  PAYLOAD+="$LINE"$'\n'
done

TIMESTAMP=$(date +%s%3N)

SIGNATURE=$(echo -n "$TIMESTAMP.$PAYLOAD" |
  openssl dgst -sha256 -hmac "$MEDIA_SERVER_SECRET" |
  awk '{print $2}')

AUTH_HEADER="t=$TIMESTAMP,v1=$SIGNATURE"

RESPONSE=$(curl -s -X POST \
  -H "content-type: text/plain" \
  -H "$MEDIA_SERVER_SIGNATURE_HEADER: $AUTH_HEADER" \
  -H "$MEDIA_SERVER_TRIGGER_HEADER: $TRIGGER_NAME" \
  -d "$PAYLOAD" \
  "$MEDIA_SERVER_EVENT_URI")

echo -n "$RESPONSE"

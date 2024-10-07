#!/bin/bash

NAME=$1
OUT=$2

if [ -z "$OUT" ] || [ -z "$NAME" ]; then
  echo "Usage: $0 <name> <output-dir>"
  exit 1
fi

COUNTRY="XX"
STATE="StateName"
CITY="CityName"
ORGANIZATION="CompanyName"
ORGANIZATION_UNIT="CompanySectionName"
COMMON_NAME="CommonNameOrHostname"

INFO="/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORGANIZATION/OU=$ORGANIZATION_UNIT/CN=$COMMON_NAME"

DAYS=3650

openssl req -x509 -newkey rsa:4096 -sha256 -days $DAYS \
  -nodes -keyout "$OUT/$NAME.key" -out "$OUT/$NAME.crt" -subj $INFO
# -addext "subjectAltName=DNS:example.com,DNS:*.example.com,IP:10.0.0.1"

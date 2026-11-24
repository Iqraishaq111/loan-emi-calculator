
#!/bin/bash

URL="http://127.0.0.1:8081/api/emi"
PAYLOAD="scripts/payload.json"

mkdir -p results/load-tests

echo "Starting HPA 10-minute profile"

echo "Phase 1: 10 RPS for 2 minutes"
ab -t 120 -R 10 -c 100 \
  -p "$PAYLOAD" \
  -T "application/json" \
  -H "Host: emi.local" \
  "$URL" > results/load-tests/hpa-low-start.txt 2>&1

echo "Phase 2: 100 RPS for 5 minutes"
ab -t 300 -R 100 -c 100 \
  -p "$PAYLOAD" \
  -T "application/json" \
  -H "Host: emi.local" \
  "$URL" > results/load-tests/hpa-high.txt 2>&1

echo "Phase 3: 10 RPS for 3 minutes"
ab -t 180 -R 10 -c 100 \
  -p "$PAYLOAD" \
  -T "application/json" \
  -H "Host: emi.local" \
  "$URL" > results/load-tests/hpa-low-end.txt 2>&1

echo "HPA profile completed"

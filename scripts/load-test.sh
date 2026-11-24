
#!/bin/bash

set -u

URL="http://127.0.0.1:8081/api/emi"
PAYLOAD="scripts/payload.json"
RESULTS="results/load-tests"

mkdir -p "$RESULTS"

CSV="$RESULTS/summary.csv"

echo "replicas,target_rps,actual_rps,avg_latency_ms,failed_requests" > "$CSV"

for replicas in 1 2 3
do
    echo "=================================="
    echo "Setting replicas to $replicas"
    echo "=================================="

    kubectl scale deployment emi-web \
      --replicas="$replicas" -n emi

    kubectl rollout status deployment/emi-web -n emi

    for rate in 10 25 50 100 200
    do
        echo "Testing $rate requests per second with $replicas replicas"

        FILE="$RESULTS/replicas-${replicas}-rate-${rate}.txt"

        ab -t 60 -R "$rate" -c 100 \
          -p "$PAYLOAD" \
          -T "application/json" \
          -H "Host: emi.local" \
          "$URL" > "$FILE" 2>&1

        actual=$(awk '/Requests per second:/ {print $4}' "$FILE")
        latency=$(awk '/Time per request:/ {print $4; exit}' "$FILE")
        failed=$(awk '/Failed requests:/ {print $3}' "$FILE")

        echo "$replicas,$rate,${actual:-0},${latency:-0},${failed:-0}" >> "$CSV"

        echo "Completed: replicas=$replicas rate=$rate"
        echo "Actual RPS: ${actual:-0}"
        echo "Average latency: ${latency:-0} ms"
        echo "Failed requests: ${failed:-0}"
        echo ""
    done
done

echo "All 15 tests completed."
echo "Results saved in $CSV"

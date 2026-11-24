
#!/bin/bash

OUTPUT="results/monitoring/pod-metrics.csv"

mkdir -p results/monitoring

echo "timestamp,pod,container,cpu,memory" > "$OUTPUT"

while true
do
    timestamp=$(date -Iseconds)

    kubectl top pods -n emi --containers --no-headers 2>/dev/null |
    while read -r pod container cpu memory rest
    do
        echo "$timestamp,$pod,$container,$cpu,$memory" >> "$OUTPUT"
    done

    sleep 15
done


#!/bin/bash

URL="http://127.0.0.1:8081/api/emi"

echo "Sending 30 EMI requests..."
echo "--------------------------"

for i in $(seq 1 30)
do
  echo "Request $i"

  curl -s -X POST "$URL" \
    -H "Host: emi.local" \
    -H "Content-Type: application/json" \
    -d '{"P":500000,"rate":12,"n":24}'

  echo ""
done


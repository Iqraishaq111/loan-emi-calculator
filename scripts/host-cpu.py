
import time
import csv
from datetime import datetime

OUTPUT = "results/monitoring/host-cpu.csv"

def read_cpu():
    with open("/proc/stat", "r") as file:
        values = list(map(int, file.readline().split()[1:]))

    idle = values[3] + values[4]
    total = sum(values)

    return idle, total

with open(OUTPUT, "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["timestamp", "host_cpu_percent"])

    previous_idle, previous_total = read_cpu()

    while True:
        time.sleep(1)

        current_idle, current_total = read_cpu()

        total_diff = current_total - previous_total
        idle_diff = current_idle - previous_idle

        cpu_percent = 100 * (1 - idle_diff / total_diff) if total_diff else 0

        writer.writerow([
            datetime.now().isoformat(),
            round(cpu_percent, 2)
        ])

        file.flush()

        previous_idle = current_idle
        previous_total = current_total

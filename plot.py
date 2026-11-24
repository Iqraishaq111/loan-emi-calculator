import matplotlib.pyplot as plt
import re, os

# ==========================================
# GRAPH 1: Response Time vs Request Rate
# ==========================================
rates = [10, 25, 50, 100, 200]
for r in [1, 2, 3]:
    times = []
    for rate in rates:
        filepath = f"results/load-tests/replicas-{r}-rate-{rate}.txt"
        try:
            txt = open(filepath).read()
            # Extract "Time per request: XX.XX [ms] (mean)"
            m = re.search(r"Time per request:\s+([\d.]+)", txt)
            if m:
                times.append(float(m.group(1)))
            else:
                times.append(0)
        except FileNotFoundError:
            print(f"File missing: {filepath}")
            times.append(0)
            
    plt.plot(rates, times, marker='o', label=f'{r} Replica(s)')

plt.xlabel('Request Rate (req/s)')
plt.ylabel('Average Response Time (ms)')
plt.title('Graph 1: Avg Response Time vs Load')
plt.legend()
plt.grid(True)
plt.savefig('results/graph1.png', dpi=150)
plt.clf()
print("Graph 1 saved!")


# ==========================================
# GRAPH 2: Pod CPU during 100 req/s (3 replicas)
# ==========================================
# Note: Assuming you have a pod-metrics.csv saved from kubectl top
# If you only have pod-monitor.log, we will parse that
data = {}
current_time = 0

# Example parser for 'pod-monitor.log' (adjust if your format differs)
if os.path.exists('results/monitoring/pod-autoscaling.txt'):
    for line in open('results/monitoring/pod-autoscaling.txt'):
        line = line.strip()
        if line.startswith('---'):
            current_time = int(line.split()[1])
        elif 'emi-web' in line:
            parts = line.split()
            pod_name = parts[0].split('-')[-1] # short name
            cpu_val = int(parts[1].replace('m', ''))
            if pod_name not in data:
                data[pod_name] = {'x': [], 'y': []}
            data[pod_name]['x'].append(current_time)
            data[pod_name]['y'].append(cpu_val)

for pod, points in data.items():
    # Normalize x axis to start at 0
    start_time = points['x'][0]
    xs = [x - start_time for x in points['x']]
    plt.plot(xs, points['y'], marker='o', label=f'Pod {pod}')

plt.xlabel('Time (seconds)')
plt.ylabel('CPU (m)')
plt.title('Graph 2: Pod CPU During 100 req/s (3 Replicas)')
plt.legend()
plt.grid(True)
plt.savefig('results/graph2.png', dpi=150)
plt.clf()
print("Graph 2 saved!")


# ==========================================
# GRAPH 3: HPA Autoscaling Timeline
# ==========================================
times, cpus, replicas = [], [], []
start_time = 0

if os.path.exists('results/monitoring/hpa-autoscaling.csv'):
    for line in open('results/monitoring/hpa-autoscaling.csv'):
        parts = line.strip().split(',')
        if len(parts) >= 3:
            t = int(parts[0])
            if start_time == 0: start_time = t
            
            # Extract CPU % (e.g. "cpu: 65%/50%" -> 65)
            cpu_match = re.search(r'(\d+)%', parts[1])
            cpu = int(cpu_match.group(1)) if cpu_match else 0
            
            rep = int(parts[2])
            
            times.append(t - start_time)
            cpus.append(cpu)
            replicas.append(rep)

if times:
    fig, ax1 = plt.subplots()
    ax1.plot(times, cpus, 'b-', label='CPU %')
    ax1.set_xlabel('Time (s)')
    ax1.set_ylabel('CPU %', color='b')
    
    ax2 = ax1.twinx()
    ax2.plot(times, replicas, 'r-', label='Replicas')
    ax2.set_ylabel('Replicas', color='r')
    
    plt.title('Graph 3: HPA Autoscaling Over Time')
    fig.tight_layout()
    plt.savefig('results/graph3.png', dpi=150)
    print("Graph 3 saved!")
else:
    print("HPA data missing, couldn't generate Graph 3.")
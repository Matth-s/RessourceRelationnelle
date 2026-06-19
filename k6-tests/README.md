# K6 Load Testing Scripts

This directory contains K6 load testing scripts for the RessourceRelationnelle API.

## Setup

### Prerequisites
- K6 installed locally: https://k6.io/docs/getting-started/installation/
- Valid API endpoint (staging or production)
- Authentication token (if needed)

### Installation

```bash
# On Windows (using Chocolatey)
choco install k6

# On macOS
brew install k6

# On Linux
sudo apt-get install k6
```

## Running Tests Locally

### Basic Load Test
```bash
BASE_URL=http://localhost:5000 k6 run load-test-api.js
```

### Stress Test
```bash
BASE_URL=http://staging-api.example.com k6 run stress-test-api.js
```

### Spike Test
```bash
BASE_URL=http://staging-api.example.com k6 run spike-test-api.js
```

### With Authentication
```bash
BASE_URL=http://staging-api.example.com AUTH_TOKEN=your_token_here k6 run load-test-api.js
```

## Test Types

### 1. Load Test (`load-test-api.js`)
- **Purpose**: Gradual ramp-up to simulate realistic user growth
- **VUs**: 20 → 50 → 100
- **Duration**: ~8 minutes
- **Thresholds**:
  - 95th percentile response time < 500ms
  - 99th percentile response time < 1000ms
  - Error rate < 10%

### 2. Stress Test (`stress-test-api.js`)
- **Purpose**: Determine system breaking point
- **VUs**: 200 → 500
- **Duration**: ~16 minutes
- **Thresholds**:
  - 95th percentile response time < 1000ms
  - 99th percentile response time < 2000ms
  - Error rate < 20%

### 3. Spike Test (`spike-test-api.js`)
- **Purpose**: Test system resilience to sudden traffic spikes
- **VUs**: Sudden jumps (50 → 500 → 1000)
- **Duration**: ~5 minutes
- **Thresholds**:
  - 99th percentile response time < 3000ms
  - Error rate < 30%

## GitHub Actions Integration

The K6 tests are automatically triggered:

1. **On Staging Deployment**
   - Triggered after successful deployment to staging
   - Runs all three test suites
   - Reports results to pull request comments

2. **Manual Trigger**
   - Available via `workflow_dispatch`
   - Choose between staging or production environment

## Performance Metrics

K6 reports the following key metrics:

| Metric | Description |
|--------|-------------|
| `http_req_duration` | Total time for HTTP request |
| `http_req_failed` | Failed requests (non-2xx status) |
| `http_reqs` | Total number of requests |
| `vus` | Virtual Users |
| `vus_max` | Maximum Virtual Users |

## Example Output

```
     data_received..................: 2.5 MB  42 kB/s
     data_sent.......................: 1.3 MB  22 kB/s
     http_req_blocked...............: avg=2.3ms    min=1.1ms max=156.4ms p(90)=2.5ms p(95)=2.8ms
     http_req_connecting............: avg=0.5ms    min=0s     max=15.2ms  p(90)=0.5ms p(95)=0.6ms
     http_req_duration..............: avg=287.3ms  min=12.1ms max=2.8s    p(90)=412.5ms p(95)=498.2ms
     http_req_failed................: 2.5%   ✓ rate<0.1
     http_req_receiving.............: avg=5.8ms    min=0.3ms max=124.1ms p(90)=8.2ms  p(95)=10.2ms
     http_req_sending...............: avg=1.5ms    min=0.1ms max=41.2ms  p(90)=1.8ms  p(95)=2.1ms
     http_req_tls_handshaking.......: avg=0s       min=0s     max=0s      p(90)=0s     p(95)=0s
     http_req_waiting...............: avg=280ms    min=9.8ms max=2.7s    p(90)=405ms   p(95)=490ms
     http_reqs......................: 14523  242.9/s
     iteration_duration.............: avg=1.5s     min=1.02s max=5.3s    p(90)=1.8s   p(95)=2.1s
     iterations.....................: 2145   35.8/s
     vus............................: 35     min=0     max=100
     vus_max........................: 100    min=100   max=100
```

## Customization

### Adjusting VU Count and Duration

Edit the `stages` array in the test files:

```javascript
stages: [
  { duration: '30s', target: 10 },   // 30 seconds to ramp up to 10 VUs
  { duration: '2m', target: 50 },    // 2 minutes to ramp up to 50 VUs
  { duration: '30s', target: 0 },    // 30 seconds to ramp down to 0 VUs
],
```

### Modifying Thresholds

Update the `thresholds` section to define what constitutes a failed test:

```javascript
thresholds: {
  http_req_duration: ['p(99)<500'],  // 99th percentile under 500ms
  http_req_failed: ['rate<0.05'],    // Less than 5% failure rate
},
```

## Troubleshooting

### Connection Refused
```bash
# Ensure the API is running
# Check BASE_URL is correct
BASE_URL=http://localhost:5000 k6 run load-test-api.js
```

### Authorization Failed
```bash
# Provide authentication token
AUTH_TOKEN=your_token_here k6 run load-test-api.js
```

### Memory Issues
```bash
# Reduce VU count or duration in test configuration
# Or set K6_VUS environment variable
K6_VUS=50 k6 run load-test-api.js
```

## Resources

- [K6 Official Documentation](https://k6.io/docs/)
- [K6 Best Practices](https://k6.io/docs/misc/best-practices/)
- [K6 Community](https://community.k6.io/)

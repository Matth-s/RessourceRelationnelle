# K6 Configuration and Setup Guide

## GitHub Secrets to Configure

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### Required Secrets

```
K6_VUS
- Description: Number of Virtual Users for testing
- Example value: 10
- Default: 10 (if not set)

K6_DURATION
- Description: Duration of the test
- Example value: 30s
- Default: 30s (if not set)

STAGING_API_URL
- Description: Base URL of the staging API
- Example value: https://staging-api.example.com
- Required for automated staging tests
```

### Optional Secrets

```
PRODUCTION_API_URL
- Description: Base URL of the production API (if applicable)
- Example value: https://api.example.com

K6_CLOUD_TOKEN
- Description: Token for K6 Cloud integration
- For storing results in K6 Cloud (optional)
```

## Integration with Staging Workflow

To integrate K6 tests into the existing staging workflow (`_02_Stagging.yml`), add this job:

```yaml
K6-Performance-Tests:
  needs: [Build_Push_Docker]
  if: ${{github.ref_name == 'develop'}}
  uses: ./.github/workflows/02-3_K6LoadTest.yml
  secrets: inherit
  with:
    environment: staging
    base_url: ${{ secrets.STAGING_API_URL }}
```

## Environment Variables

### For Load Test
```bash
BASE_URL              - API endpoint URL
K6_VUS               - Virtual Users (default: 10)
K6_DURATION          - Test duration (default: 30s)
AUTH_TOKEN           - API authentication token (optional)
```

### K6 Specific Variables
```bash
K6_INFLUXDB_ADDR     - InfluxDB address for metrics storage (optional)
K6_OUT               - Output format (json, statsd, influxdb, etc.)
```

## Running Tests Locally Before Deployment

### Prerequisites
1. Install K6: https://k6.io/docs/getting-started/installation/
2. Ensure the API is running locally or accessible

### Step 1: Run Load Test
```bash
cd k6-tests
BASE_URL=http://localhost:5000 k6 run load-test-api.js
```

### Step 2: Review Results
- Check response times (should be under thresholds)
- Review error rates
- Verify system stability

### Step 3: Run Stress Test
```bash
BASE_URL=http://localhost:5000 k6 run stress-test-api.js
```

### Step 4: Run Spike Test
```bash
BASE_URL=http://localhost:5000 k6 run spike-test-api.js
```

## Test Execution in CI/CD

### Manual Trigger
1. Go to GitHub Actions
2. Select "02-3 - Performance - K6 Load Test"
3. Click "Run workflow"
4. Select environment (staging/production)
5. Tests will run and results will be displayed

### Automatic Trigger
- Push changes to the `k6` branch
- Modify files in `k6-tests/` directory
- Tests will automatically run against staging

### Through Staging Deployment
- Deploy to staging (merge to develop)
- K6 tests will automatically run after deployment

## Performance Thresholds

### Load Test Thresholds
- Response time (p95): < 500ms
- Response time (p99): < 1000ms
- Error rate: < 10%

### Stress Test Thresholds
- Response time (p95): < 1000ms
- Response time (p99): < 2000ms
- Error rate: < 20%

### Spike Test Thresholds
- Response time (p99): < 3000ms
- Error rate: < 30%

## Interpreting Results

### Successful Test
✅ All checks passed and below thresholds
- Green indicators in GitHub Actions
- All metrics within expected ranges

### Failed Test
❌ Thresholds exceeded or checks failed
- Red indicators in GitHub Actions
- Review logs for specific failures
- Common causes:
  - API is too slow
  - High error rate
  - Database issues
  - Network problems

### Performance Degradation
- Compare with previous test runs
- Check API logs for errors
- Review recent deployments
- Monitor resource usage

## Customizing Tests

### Add Custom Endpoints
Edit the test files to add more endpoints:

```javascript
group('New Endpoint Group', function () {
  const res = http.get(`${BASE_URL}/api/new-endpoint`, {
    headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
  });

  check(res, {
    'new endpoint status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
});
```

### Adjust Load Stages
Modify the `stages` array to change the load profile:

```javascript
stages: [
  { duration: '1m', target: 50 },    // Different warm-up
  { duration: '3m', target: 100 },   // Longer ramp-up
  { duration: '1m', target: 0 },     // Quick ramp-down
],
```

### Change Thresholds
Update thresholds based on your API's SLA:

```javascript
thresholds: {
  http_req_duration: ['p(95)<300'],  // Stricter threshold
  http_req_failed: ['rate<0.05'],    // Lower error tolerance
},
```

## Troubleshooting

### Tests Not Running
- Check k6-tests directory exists
- Verify all required scripts present
- Check GitHub Actions logs

### Connection Errors
- Verify BASE_URL is correct
- Check API is accessible from GitHub servers
- Review firewall/VPN settings

### Threshold Violations
- Review recent code changes
- Check API server resources
- Run performance profiling
- Consider scaling infrastructure

### Authentication Failures
- Verify AUTH_TOKEN if needed
- Check API authentication requirements
- Update secrets if credentials changed

## Resources

- [K6 Documentation](https://k6.io/docs/)
- [K6 Best Practices](https://k6.io/docs/using-k6/best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Performance Testing Guide](https://k6.io/docs/using-k6/metrics/)

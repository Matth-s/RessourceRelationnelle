# Integration with Staging Workflow

This document explains how to integrate K6 performance tests with the existing staging workflow.

## Current Setup

The K6 tests are configured as a reusable workflow component that can be:
1. Called from other workflows
2. Manually triggered
3. Automatically triggered on changes to k6-tests branch

## Option 1: Auto-run After Staging Deployment

To automatically run K6 tests after deploying to staging, update `_02_Stagging.yml`:

### Step 1: Update the Staging Workflow

Add this new job to the end of `_02_Stagging.yml`:

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

### Step 2: Add GitHub Secrets

In your GitHub repository, add:
- `STAGING_API_URL`: The base URL of your staging API (e.g., https://staging-api.example.com)
- `K6_VUS`: Number of virtual users (default: 10)
- `K6_DURATION`: Duration of tests (default: 30s)

### Step 3: Verify Integration

1. Merge changes to the `develop` branch
2. Monitor GitHub Actions for the new K6 test job
3. Review results in the workflow summary

## Option 2: Manual Trigger Only

If you prefer to run tests manually:

1. Go to GitHub Actions
2. Select "02-3 - Performance - K6 Load Test"
3. Click "Run workflow"
4. Select environment and provide base URL
5. Tests will run on demand

## Option 3: Scheduled Testing

To run K6 tests on a schedule, add to `02-3_K6LoadTest.yml`:

```yaml
on:
  schedule:
    # Run every day at 2 AM UTC
    - cron: '0 2 * * *'
```

## Example Workflow

Here's an example of a complete staging workflow with K6 integration:

```yaml
name: 02 - Stagging

on:
  push:
    branches:
      - develop
      - release/*

jobs:
  Display_Data:
    runs-on: ubuntu-latest
    steps:
      - name: Display Data
        run: env | sort

  Build_Push_Docker:
    if: ${{github.ref_name == 'develop'}}
    uses: ./.github/workflows/z_Docker-Ghcr.yml
    secrets: inherit
    with:
      docker-mode: canary

  Trivy_Scan_Package:
    needs: [Build_Push_Docker]
    uses: ./.github/workflows/02-2_TrivyScan.yml
    secrets: inherit

  # NEW: Performance Testing
  K6-Performance-Tests:
    needs: [Build_Push_Docker]
    if: ${{github.ref_name == 'develop'}}
    uses: ./.github/workflows/02-3_K6LoadTest.yml
    secrets: inherit
    with:
      environment: staging
      base_url: ${{ secrets.STAGING_API_URL }}

  # Optional: Deploy job (when ready)
  # Deploy:
  #   needs: [Trivy_Scan_Package, K6-Performance-Tests]
  #   uses: ./.github/workflows/02-3_Deploy.yml
  #   secrets: inherit
```

## Monitoring K6 Test Results

### In GitHub Actions
1. View the workflow run
2. Check "K6-Performance-Tests" job
3. Review the test summary in the workflow summary
4. Download artifact results if needed

### In Pull Requests
When integrated with staging, K6 results will be posted as PR comments showing:
- Environment tested
- Base URL used
- Test execution timestamp
- Links to detailed results

### Interpreting Test Results

**✅ Passed Tests**
- All performance metrics below thresholds
- Error rate acceptable
- System is performing well

**⚠️ Failed Tests**
- One or more metrics exceeded thresholds
- May require investigation
- Check API logs and infrastructure

**❌ Critical Failures**
- API unavailable or extreme slowness
- Error rate very high
- Likely infrastructure or deployment issue

## Performance SLA

Expected API performance for staging environment:

| Metric | Threshold | Comment |
|--------|-----------|---------|
| P95 Response Time | 500ms | 95% of requests under 500ms |
| P99 Response Time | 1000ms | 99% of requests under 1000ms |
| Error Rate | < 10% | Less than 10% failed requests |
| Throughput | > 100 req/s | Handle at least 100 requests/second |

## Troubleshooting Integration

### Tests Not Running
- Verify `STAGING_API_URL` secret is set
- Check that k6-tests directory exists
- Review GitHub Actions logs for errors

### Connection Timeouts
- Ensure staging API is accessible from GitHub servers
- Check firewall rules
- Verify correct URL in secrets

### Threshold Violations
- Check recent deployments
- Review API performance metrics
- Check database and infrastructure status
- Consider scaling resources

## Next Steps

1. ✅ Set up GitHub secrets (STAGING_API_URL, K6_VUS, K6_DURATION)
2. ✅ Update `_02_Stagging.yml` with K6 job
3. ✅ Test the integration with a manual workflow run
4. ✅ Verify results in GitHub Actions
5. ✅ Monitor performance over time

## Additional Resources

- [K6 Documentation](https://k6.io/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [RessourceRelationnelle K6 Tests README](./README.md)
- [K6 Setup Guide](./SETUP_GUIDE.md)

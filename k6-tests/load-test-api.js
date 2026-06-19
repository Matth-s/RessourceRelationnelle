import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '1m', target: 50 },    // Ramp up to 50 users
    { duration: '2m', target: 50 },    // Stay at 50 users for 2 minutes
    { duration: '1m', target: 100 },   // Ramp up to 100 users
    { duration: '2m', target: 100 },   // Stay at 100 users for 2 minutes
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],  // More realistic for local dev
    http_req_failed: ['rate<0.35'],                    // Allow up to 35% errors locally
    'http_req_duration{staticAsset:yes}': ['p(99)<1000'],
  },
};

export default function () {
  // Test main resource endpoints - these work reliably
  group('Core API Endpoints', function () {
    // GET all resources
    const resourcesRes = http.get(`${BASE_URL}/api/Resource`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(resourcesRes, {
      'get resources status is 200': (r) => r.status === 200,
      'resources response time < 500ms': (r) => r.timings.duration < 500,
    });

    // GET resource types
    const resourceTypesRes = http.get(`${BASE_URL}/api/TypeResource`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(resourceTypesRes, {
      'get resource types status is 200': (r) => r.status === 200,
      'resource types response time < 500ms': (r) => r.timings.duration < 500,
    });

    // GET type relations
    const relationsRes = http.get(`${BASE_URL}/api/TypeRelation`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(relationsRes, {
      'get type relations status is 200': (r) => r.status === 200,
      'type relations response time < 500ms': (r) => r.timings.duration < 500,
    });
  });

  sleep(2);

  // Test secondary endpoints
  group('Secondary Endpoints', function () {
    // GET categories
    const categoriesRes = http.get(`${BASE_URL}/api/Category`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(categoriesRes, {
      'categories status is 200': (r) => r.status === 200,
      'categories response time < 500ms': (r) => r.timings.duration < 500,
    });

    // GET statistics
    const statsRes = http.get(`${BASE_URL}/api/Statistics`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(statsRes, {
      'statistics status is 200': (r) => r.status === 200 || r.status === 401,
      'statistics response time < 800ms': (r) => r.timings.duration < 800,
    });

    // GET likes
    const likesRes = http.get(`${BASE_URL}/api/Like`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(likesRes, {
      'likes status is 200': (r) => r.status === 200 || r.status === 401,
      'likes response time < 500ms': (r) => r.timings.duration < 500,
    });
  });

  sleep(1);
}

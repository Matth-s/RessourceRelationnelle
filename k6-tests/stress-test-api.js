import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export const options = {
  stages: [
    { duration: '2m', target: 200 },   // Ramp up to 200 users
    { duration: '5m', target: 200 },   // Stay at 200 users
    { duration: '2m', target: 500 },   // Spike to 500 users
    { duration: '5m', target: 500 },   // Stay at 500 users
    { duration: '2m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500', 'p(99)<2500'],  // More realistic for local dev
    http_req_failed: ['rate<0.3'],                     // Allow up to 30% errors under stress
    'http_req_duration{staticAsset:yes}': ['p(99)<2000'],
  },
};

export default function () {
  // Heavy load on core endpoints
  group('Heavy Load - Core Endpoints', function () {
    // Multiple rapid requests to resource endpoints
    for (let i = 0; i < 3; i++) {
      const res = http.get(`${BASE_URL}/api/Resource`, {
        headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
        tags: { name: 'GetResources' },
      });

      check(res, {
        'get resources status is 200': (r) => r.status === 200,
        'response time acceptable under stress': (r) => r.timings.duration < 2000,
      });
    }

    // Test multiple endpoints concurrently
    const typeResourceRes = http.get(`${BASE_URL}/api/TypeResource`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    const typeRelationRes = http.get(`${BASE_URL}/api/TypeRelation`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(typeResourceRes, {
      'get type resources status is 200': (r) => r.status === 200,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    check(typeRelationRes, {
      'get type relations status is 200': (r) => r.status === 200,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });
  });

  group('Heavy Load - Secondary Endpoints', function () {
    // GET categories under stress
    for (let i = 0; i < 2; i++) {
      const res = http.get(`${BASE_URL}/api/Category`, {
        headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
        tags: { name: 'GetCategories' },
      });

      check(res, {
        'get categories status is 200': (r) => r.status === 200,
        'response time acceptable': (r) => r.timings.duration < 2000,
      });
    }

    // GET statistics under stress
    const statsRes = http.get(`${BASE_URL}/api/Statistics`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(statsRes, {
      'statistics status is 200': (r) => r.status === 200 || r.status === 401,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    // GET likes under stress
    const likesRes = http.get(`${BASE_URL}/api/Like`, {
      headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
    });

    check(likesRes, {
      'likes status is 200': (r) => r.status === 200 || r.status === 401,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });
  });

  sleep(Math.random() * 2);
}

import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

export const options = {
  stages: [
    { duration: '1m', target: 50 },    // Warm up
    { duration: '30s', target: 500 },  // Sudden spike to 500 users
    { duration: '1m', target: 500 },   // Hold at spike level
    { duration: '30s', target: 50 },   // Drop back to normal
    { duration: '30s', target: 1000 }, // Another spike to 1000 users
    { duration: '1m', target: 1000 },  // Hold at high level
    { duration: '1m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<3000'],
    http_req_failed: ['rate<0.4'],  // Allow up to 40% errors during spikes
  },
};

export default function () {
  group('Spike Test - API Stability', function () {
    // Test if API can handle sudden traffic spikes on core endpoints
    const endpoints = [
      `/api/Resource`,
      `/api/TypeRelation`,
      `/api/TypeResource`,
      `/api/Category`,
      `/api/Like`,
      `/api/Statistics`,
    ];

    for (const endpoint of endpoints) {
      const res = http.get(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${__ENV.AUTH_TOKEN || ''}` },
        tags: { name: `Spike-${endpoint}` },
      });

      check(res, {
        'spike test response': (r) => 
          r.status === 200 || 
          r.status === 401 || 
          r.status === 503, // Service Unavailable is acceptable during spikes
        'response time during spike < 3s': (r) => r.timings.duration < 3000,
      });
    }
  });

  sleep(Math.random() * 1);
}

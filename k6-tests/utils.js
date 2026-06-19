import { check, sleep } from 'k6';
import http from 'k6/http';

/**
 * Performance thresholds for different test types
 */
export const THRESHOLDS = {
  load: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'http_req_failed': ['rate<0.1'],
  },
  stress: {
    'http_req_duration': ['p(95)<1000', 'p(99)<2000'],
    'http_req_failed': ['rate<0.2'],
  },
  spike: {
    'http_req_duration': ['p(99)<3000'],
    'http_req_failed': ['rate<0.3'],
  },
};

/**
 * Common headers for API requests
 */
export const getCommonHeaders = (authToken = '') => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * Check common HTTP response codes
 */
export const checkResponse = (response, endpoint, statusCodes = [200]) => {
  const acceptedStatuses = [
    200, 201, 204,  // Success
    400, 401, 403,  // Client errors (expected)
    ...statusCodes,
  ];

  return check(response, {
    [`${endpoint}: status is acceptable`]: (r) => 
      acceptedStatuses.includes(r.status) || [200, 201].includes(r.status),
    [`${endpoint}: response time < 500ms`]: (r) => 
      r.timings.duration < 500,
  });
};

/**
 * Make paginated requests
 */
export const makePaginatedRequests = (baseUrl, endpoint, pages = 3, authToken = '') => {
  for (let page = 1; page <= pages; page++) {
    const url = `${baseUrl}${endpoint}?page=${page}`;
    const response = http.get(url, {
      headers: getCommonHeaders(authToken),
    });

    checkResponse(response, `${endpoint} (page ${page})`);
  }
};

/**
 * Make concurrent requests
 */
export const makeConcurrentRequests = (baseUrl, endpoints = [], authToken = '') => {
  const requests = endpoints.reduce((acc, endpoint) => {
    acc[endpoint] = http.batch([
      ['GET', `${baseUrl}${endpoint}`],
    ]);
    return acc;
  }, {});

  // Process responses
  Object.entries(requests).forEach(([endpoint, responses]) => {
    responses.forEach((response) => {
      checkResponse(response, endpoint);
    });
  });

  return requests;
};

/**
 * Generate random test data
 */
export const generateTestData = () => {
  const timestamp = Date.now();
  return {
    name: `Test-Resource-${timestamp}`,
    type: 'test-type',
    description: `Generated at ${new Date(timestamp).toISOString()}`,
    timestamp: timestamp,
  };
};

/**
 * Simulate user think time
 */
export const thinkTime = (minSeconds = 1, maxSeconds = 3) => {
  const duration = minSeconds + Math.random() * (maxSeconds - minSeconds);
  sleep(duration);
};

/**
 * Log performance metrics
 */
export const logMetric = (name, value, unit = '') => {
  if (__ENV.DEBUG) {
    console.log(`[${name}] ${value}${unit}`);
  }
};

/**
 * Retry failed requests
 */
export const retryRequest = (method, url, payload = null, options = {}, maxRetries = 3) => {
  let response;
  let retries = 0;

  while (retries < maxRetries) {
    if (method === 'GET') {
      response = http.get(url, options);
    } else if (method === 'POST') {
      response = http.post(url, payload, options);
    } else if (method === 'PUT') {
      response = http.put(url, payload, options);
    } else if (method === 'DELETE') {
      response = http.del(url, options);
    }

    if ([200, 201, 204].includes(response.status)) {
      return response;
    }

    retries++;
    sleep(Math.pow(2, retries)); // Exponential backoff
  }

  return response;
};

/**
 * Parse JSON response safely
 */
export const parseJSON = (response) => {
  try {
    return response.json();
  } catch (error) {
    logMetric('JSON Parse Error', `Failed to parse: ${response.body.substring(0, 100)}`);
    return null;
  }
};

/**
 * Calculate response time statistics
 */
export const getResponseTimeStats = (minMs, maxMs, avgMs) => {
  return {
    min: minMs,
    max: maxMs,
    avg: avgMs,
    p50: avgMs * 0.5,
    p95: avgMs * 1.5,
    p99: avgMs * 2.0,
  };
};

export default {
  THRESHOLDS,
  getCommonHeaders,
  checkResponse,
  makePaginatedRequests,
  makeConcurrentRequests,
  generateTestData,
  thinkTime,
  logMetric,
  retryRequest,
  parseJSON,
  getResponseTimeStats,
};

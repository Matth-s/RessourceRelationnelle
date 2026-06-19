import http from 'k6/http';
import { check, group, sleep } from 'k6';
import {
  getCommonHeaders,
  checkResponse,
  generateTestData,
  thinkTime,
  THRESHOLDS,
} from './utils.js';

/**
 * Advanced K6 Test Examples
 * 
 * These examples demonstrate advanced patterns for testing the RessourceRelationnelle API
 */

// Example 1: Authentication and Token Management
export const authenticatedRequest = (baseUrl, credentials) => {
  group('Authentication Flow', function () {
    // Login to get token
    const loginPayload = JSON.stringify(credentials);
    const loginRes = http.post(`${baseUrl}/api/auth/login`, loginPayload, {
      headers: getCommonHeaders(),
    });

    checkResponse(loginRes, '/auth/login');

    const data = loginRes.json();
    const authToken = data?.token || data?.access_token;

    if (authToken) {
      // Use token for subsequent requests
      const protectedRes = http.get(`${baseUrl}/api/resources`, {
        headers: getCommonHeaders(authToken),
      });

      checkResponse(protectedRes, '/api/resources (authenticated)');
    }

    thinkTime();
  });
};

// Example 2: CRUD Operations Test
export const crudOperations = (baseUrl, authToken) => {
  group('CRUD Operations', function () {
    // CREATE
    const createPayload = JSON.stringify(generateTestData());
    const createRes = http.post(`${baseUrl}/api/resources`, createPayload, {
      headers: getCommonHeaders(authToken),
    });

    const createdId = createRes.json()?.id;
    checkResponse(createRes, 'POST /api/resources', [201]);

    thinkTime();

    // READ
    if (createdId) {
      const readRes = http.get(`${baseUrl}/api/resources/${createdId}`, {
        headers: getCommonHeaders(authToken),
      });

      checkResponse(readRes, `GET /api/resources/${createdId}`);
      thinkTime();

      // UPDATE
      const updatePayload = JSON.stringify({
        name: 'Updated Resource',
        description: 'This resource was updated',
      });

      const updateRes = http.put(
        `${baseUrl}/api/resources/${createdId}`,
        updatePayload,
        { headers: getCommonHeaders(authToken) }
      );

      checkResponse(updateRes, `PUT /api/resources/${createdId}`);
      thinkTime();

      // DELETE
      const deleteRes = http.del(`${baseUrl}/api/resources/${createdId}`, {
        headers: getCommonHeaders(authToken),
      });

      checkResponse(deleteRes, `DELETE /api/resources/${createdId}`, [204, 200]);
    }
  });
};

// Example 3: Complex Business Logic Flow
export const businessLogicFlow = (baseUrl, authToken) => {
  group('Complex Business Logic', function () {
    // Step 1: Get all resources
    const resourcesRes = http.get(`${baseUrl}/api/resources`, {
      headers: getCommonHeaders(authToken),
    });

    const resources = resourcesRes.json() || [];
    checkResponse(resourcesRes, 'GET /api/resources');

    thinkTime();

    // Step 2: Get resource types
    const typesRes = http.get(`${baseUrl}/api/resource-types`, {
      headers: getCommonHeaders(authToken),
    });

    const types = typesRes.json() || [];
    checkResponse(typesRes, 'GET /api/resource-types');

    thinkTime();

    // Step 3: Create relationships between resources
    if (resources.length >= 2 && types.length > 0) {
      const relationPayload = JSON.stringify({
        sourceId: resources[0].id,
        targetId: resources[1].id,
        relationTypeId: types[0].id,
        description: 'Test relationship',
      });

      const relationRes = http.post(
        `${baseUrl}/api/relations`,
        relationPayload,
        { headers: getCommonHeaders(authToken) }
      );

      checkResponse(relationRes, 'POST /api/relations', [201]);
    }

    thinkTime();

    // Step 4: Add comments
    if (resources.length > 0) {
      const commentPayload = JSON.stringify({
        resourceId: resources[0].id,
        text: 'Test comment from K6 load test',
      });

      const commentRes = http.post(
        `${baseUrl}/api/comments`,
        commentPayload,
        { headers: getCommonHeaders(authToken) }
      );

      checkResponse(commentRes, 'POST /api/comments', [201]);
    }
  });
};

// Example 4: Stress Test with Error Handling
export const stressTestWithErrorHandling = (baseUrl, authToken) => {
  group('Stress Test with Error Handling', function () {
    // Rapid sequential requests
    for (let i = 0; i < 5; i++) {
      const res = http.get(`${baseUrl}/api/resources?limit=50`, {
        headers: getCommonHeaders(authToken),
      });

      check(res, {
        'status is 200 or 503 (acceptable under stress)': (r) =>
          r.status === 200 || r.status === 503,
        'response time under 2s (stress)': (r) => r.timings.duration < 2000,
      });
    }
  });
};

// Example 5: Search and Filter Functionality
export const searchAndFilter = (baseUrl, authToken) => {
  group('Search and Filter', function () {
    const searchParams = [
      'type:resource-type-1',
      'status:active',
      'created:>2024-01-01',
      'modified:<2024-12-31',
    ];

    for (const param of searchParams) {
      const res = http.get(`${baseUrl}/api/resources?search=${encodeURIComponent(param)}`, {
        headers: getCommonHeaders(authToken),
      });

      check(res, {
        [`search param "${param}" returns 200`]: (r) => r.status === 200 || r.status === 400,
        [`search response time < 500ms`]: (r) => r.timings.duration < 500,
      });

      thinkTime(0.5, 1);
    }
  });
};

// Example 6: Pagination Test
export const paginationTest = (baseUrl, authToken) => {
  group('Pagination', function () {
    const pageSize = 20;
    const maxPages = 5;

    for (let page = 1; page <= maxPages; page++) {
      const res = http.get(
        `${baseUrl}/api/resources?page=${page}&pageSize=${pageSize}`,
        { headers: getCommonHeaders(authToken) }
      );

      check(res, {
        [`page ${page} returns 200`]: (r) => r.status === 200,
        [`page ${page} has expected structure`]: (r) => {
          const body = r.json();
          return body && Array.isArray(body.data || body.items || body);
        },
      });

      thinkTime(0.5);
    }
  });
};

// Example 7: Concurrent Operations
export const concurrentOperations = (baseUrl, authToken) => {
  group('Concurrent Operations', function () {
    // Simulate multiple users performing different operations simultaneously
    const requests = {
      getResources: http.batch([
        ['GET', `${baseUrl}/api/resources`],
      ]),
      getTypes: http.batch([
        ['GET', `${baseUrl}/api/resource-types`],
      ]),
      getRelations: http.batch([
        ['GET', `${baseUrl}/api/relations`],
      ]),
      getStats: http.batch([
        ['GET', `${baseUrl}/api/dashboard/stats`],
      ]),
    };

    // Check results
    const headers = getCommonHeaders(authToken);
    for (const [name, batch] of Object.entries(requests)) {
      batch.forEach((response) => {
        check(response, {
          [`${name}: status 200`]: (r) => r.status === 200,
          [`${name}: response time < 800ms`]: (r) => r.timings.duration < 800,
        });
      });
    }

    thinkTime();
  });
};

// Example 8: Data Validation
export const dataValidationTest = (baseUrl, authToken) => {
  group('Data Validation', function () {
    // Test with invalid data
    const invalidPayloads = [
      { name: '' }, // Empty name
      { name: null }, // Null name
      { type: '' }, // Empty type
      { description: 'x'.repeat(5000) }, // Too long description
    ];

    for (const payload of invalidPayloads) {
      const res = http.post(
        `${baseUrl}/api/resources`,
        JSON.stringify(payload),
        { headers: getCommonHeaders(authToken) }
      );

      check(res, {
        'invalid data returns error': (r) => r.status >= 400 && r.status < 500,
      });
    }

    thinkTime();
  });
};

export default {
  authenticatedRequest,
  crudOperations,
  businessLogicFlow,
  stressTestWithErrorHandling,
  searchAndFilter,
  paginationTest,
  concurrentOperations,
  dataValidationTest,
};

const supertest = require('supertest');
const app = require('../src/app');

describe('Health check', () => {
    it('should return status 200', async () => {
        const response = await supertest(app).get('/test-service/api/health-check');

        expect(response.status).toBe(200);
    });
    
});
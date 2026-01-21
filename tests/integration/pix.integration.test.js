import request from 'supertest';
import express from 'express';
import { participants } from '../../src/services/pix.js';

describe('PIX Service Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.get('/pix/participants/:ispb', participants);
  });

  describe('GET /pix/participants/:ispb', () => {
    describe('Input Validation', () => {
      it('should return 400 for ISPB shorter than 8 digits', async () => {
        const response = await request(app)
          .get('/pix/participants/1234567');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid ISPB code');
      });

      it('should return 400 for ISPB longer than 8 digits', async () => {
        const response = await request(app)
          .get('/pix/participants/123456789');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid ISPB code');
      });

      it('should return 400 for ISPB with letters', async () => {
        const response = await request(app)
          .get('/pix/participants/1234567A');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid ISPB code');
      });

      it('should return 400 for ISPB with special characters', async () => {
        const response = await request(app)
          .get('/pix/participants/12345-78');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid ISPB code');
      });

      it('should return 400 for ISPB with spaces', async () => {
        const response = await request(app)
          .get('/pix/participants/1234 678');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid ISPB code');
      });

      it('should return 400 for empty ISPB', async () => {
        const response = await request(app)
          .get('/pix/participants/');

        expect(response.status).toBe(404);
      });
    });

    describe('Valid ISPB format acceptance', () => {
      it('should accept valid 8-digit numeric ISPB', async () => {
        const response = await request(app)
          .get('/pix/participants/12345678');

        expect(response.status).not.toBe(400);
      });
    });

    describe('Content Type', () => {
      it('should return JSON content type on validation error', async () => {
        const response = await request(app)
          .get('/pix/participants/1234567');

        expect(response.headers['content-type']).toMatch(/json/);
      });
    });

    describe('Response structure', () => {
      it('should return error response with message on validation fail', async () => {
        const response = await request(app)
          .get('/pix/participants/invalid');

        expect(response.body).toHaveProperty('error');
        expect(typeof response.body.error).toBe('string');
      });

      it('should return HTTP status code for validation errors', async () => {
        const testCases = [
          { ispb: '123', expectedStatus: 400 },
          { ispb: '123456789', expectedStatus: 400 },
          { ispb: '1234567A', expectedStatus: 400 },
          { ispb: '1234 678', expectedStatus: 400 },
        ];

        for (const testCase of testCases) {
          const response = await request(app)
            .get(`/pix/participants/${testCase.ispb}`);

          expect(response.status).toBe(testCase.expectedStatus);
        }
      });
    });

    describe('Service error handling', () => {
      it('should handle missing ISPB parameter', async () => {
        const response = await request(app)
          .get('/pix/participants/');

        expect(response.status).toBe(404);
      });
    });
  });

  describe('ISPB validation edge cases', () => {
    const testCases = [
      { ispb: '', valid: false },
      { ispb: '1', valid: false },
      { ispb: '12', valid: false },
      { ispb: '123', valid: false },
      { ispb: '1234', valid: false },
      { ispb: '12345', valid: false },
      { ispb: '123456', valid: false },
      { ispb: '1234567', valid: false },
      { ispb: '12345678', valid: true },
      { ispb: '123456789', valid: false },
      { ispb: '1234567890', valid: false },
      { ispb: '12345678a', valid: false },
      { ispb: 'abcd1234', valid: false },
      { ispb: '1234-678', valid: false },
      { ispb: '12 34 56 78', valid: false },
    ];

    testCases.forEach((testCase) => {
      it(`should ${testCase.valid ? 'accept' : 'reject'} ISPB: "${testCase.ispb}"`, async () => {
        if (testCase.ispb === '') {
          const response = await request(app).get('/pix/participants/');
          expect(response.status).toBe(404);
        } else {
          const response = await request(app)
            .get(`/pix/participants/${testCase.ispb}`);

          if (testCase.valid) {
            expect(response.status).not.toBe(400);
          } else {
            expect(response.status).toBe(400);
          }
        }
      });
    });
  });
});

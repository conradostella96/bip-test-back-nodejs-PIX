import { participants } from '../../src/services/pix.js';

describe('PIX Service', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    const callTracker = { calls: [] };
    const returnTracker = { calls: [] };

    mockReq = {
      params: {},
    };

    mockRes = {
      status: function(code) {
        callTracker.calls.push(['status', code]);
        this.lastStatusCode = code;
        return this;
      },
      json: function(data) {
        returnTracker.calls.push(['json', data]);
        this.lastData = data;
        return this;
      },
      _statusCalls: callTracker,
      _jsonCalls: returnTracker,
    };

    mockRes.statusCalledWith = function(code) {
      return this._statusCalls.calls.some(call => call[0] === 'status' && call[1] === code);
    };

    mockRes.jsonCalledWith = function(data) {
      return this._jsonCalls.calls.some(call => JSON.stringify(call[1]) === JSON.stringify(data));
    };
  });

  describe('participants endpoint', () => {
    describe('Input Validation', () => {
      it('should return 400 for missing ISPB', async () => {
        mockReq.params = {};

        await participants(mockReq, mockRes);

        expect(mockRes.statusCalledWith(400)).toBe(true);
        expect(mockRes.jsonCalledWith({ error: 'Invalid ISPB code' })).toBe(true);
      });

      it('should return 400 for ISPB with incorrect length', async () => {
        mockReq.params = { ispb: '1234567' };

        await participants(mockReq, mockRes);

        expect(mockRes.statusCalledWith(400)).toBe(true);
        expect(mockRes.jsonCalledWith({ error: 'Invalid ISPB code' })).toBe(true);
      });

      it('should return 400 for ISPB with non-numeric characters', async () => {
        mockReq.params = { ispb: '1234567A' };

        await participants(mockReq, mockRes);

        expect(mockRes.statusCalledWith(400)).toBe(true);
        expect(mockRes.jsonCalledWith({ error: 'Invalid ISPB code' })).toBe(true);
      });

      it('should return 400 for ISPB with spaces', async () => {
        mockReq.params = { ispb: '1234 678' };

        await participants(mockReq, mockRes);

        expect(mockRes.statusCalledWith(400)).toBe(true);
        expect(mockRes.jsonCalledWith({ error: 'Invalid ISPB code' })).toBe(true);
      });

      it('should accept valid 8-digit ISPB format', async () => {
        mockReq.params = { ispb: '12345678' };

        await participants(mockReq, mockRes);

        const hasValidationError = mockRes._statusCalls.calls.some(call => call[1] === 400);
        expect(hasValidationError).toBe(false);
      });
    });

    describe('Error handling', () => {
      it('should handle ISPB validation errors', async () => {
        const invalidISPBs = ['', '123', '12345678901', '1234567a', '12-34-56-78', '12 34 56 78'];

        for (const ispb of invalidISPBs) {
          mockRes._statusCalls.calls = [];
          mockRes._jsonCalls.calls = [];
          mockReq.params = { ispb };

          await participants(mockReq, mockRes);

          const called400 = mockRes._statusCalls.calls.some(call => call[1] === 400);
          expect(called400).toBe(true);
        }
      });
    });
  });
});

import { captureException, infoLog } from '../../src/handlers/exceptionHandler.js';

describe('Exception Handler', () => {
  describe('captureException', () => {
    it('should log error message', () => {
      const errorMessage = 'Test error message';
      expect(() => captureException(errorMessage)).not.toThrow();
    });

    it('should handle different types of error input', () => {
      const testCases = [
        'String error',
        new Error('Error object'),
        { message: 'Error object literal' },
      ];

      testCases.forEach(testCase => {
        expect(() => captureException(testCase)).not.toThrow();
      });
    });
  });

  describe('infoLog', () => {
    it('should log info message', () => {
      const infoMessage = 'Test info message';
      expect(() => infoLog(infoMessage)).not.toThrow();
    });

    it('should handle various types of messages', () => {
      const testCases = [
        'Simple string',
        'Message with special chars: !@#$%',
        'Very long message that contains a lot of information about what happened',
      ];

      testCases.forEach(testCase => {
        expect(() => infoLog(testCase)).not.toThrow();
      });
    });
  });
});

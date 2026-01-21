import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PIX Participants API',
      version: '1.0.0',
      description: 'API for retrieving PIX participant information from the Brazilian Central Bank (BCB)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Participant: {
          type: 'object',
          properties: {
            ispb: {
              type: 'string',
              description: 'ISPB code (8-digit numeric identifier)',
              example: '12345678',
            },
            name: {
              type: 'string',
              description: 'Participant name',
              example: 'Banco do Brasil',
            },
            cnpj: {
                type: 'string',
                description: 'CNPJ number',
                example: '12178643000109',
            },
            nome_reduzido: {
                type: 'string',
                description: 'Short participant name',
                example: 'BB',
            },
            modalidade_participacao: {
                type: 'string',
                description: 'Participation mode',
                example: 'PDCT',
            },
            tipo_participacao: {
                type: 'string',
                description: 'Participation type',
                example: 'IDRT',
            },
            inicio_operacao: {
                type: 'string',
                description: 'Operation start date in ISO 8601 format',
                example: '2020-11-03T09:30:00.000Z',
            },
          },
          required: ['ispb'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Invalid ISPB code',
            },
          },
          required: ['error'],
        },
      },
    },
    paths: {
      '/pix/participants/{ispb}': {
        get: {
          tags: ['Participants'],
          summary: 'Get PIX participant information',
          description: 'Retrieve participant information by ISPB code. The result is cached for 24 hours.',
          parameters: [
            {
              name: 'ispb',
              in: 'path',
              required: true,
              description: 'ISPB code - must be exactly 8 numeric digits',
              schema: {
                type: 'string',
                pattern: '^\\d{8}$',
                example: '12345678',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Participant found successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Participant',
                  },
                  example: {
                    ispb: '12345678',
                    name: 'Banco do Brasil',
                    cnpj: '12178643000109',
                    nome_reduzido: 'BB',
                    modalidade_participacao: 'PDCT',
                    tipo_participacao: 'IDRT',
                    inicio_operacao: '2020-11-03T09:30:00.000Z',
                  },
                },
              },
            },
            '400': {
              description: 'Invalid ISPB code format',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                  example: {
                    error: 'Invalid ISPB code',
                  },
                },
              },
            },
            '404': {
              description: 'Participant not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                  example: {
                    error: 'Participant not found',
                  },
                },
              },
            },
            '503': {
              description: 'Service unavailable - BCB API or Redis connection failed',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse',
                  },
                  example: {
                    error: 'Service unavailable',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

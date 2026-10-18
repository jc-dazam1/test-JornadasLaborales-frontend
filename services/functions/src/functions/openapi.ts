import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

const apiContract = {
  openapi: '3.0.3',
  info: {
    title: 'Jornadas Laborales API',
    version: '1.0.0',
    description: 'Health endpoint for the labor scheduling application.',
  },
  servers: [{ url: '/api' }],
  paths: {
    '/health': {
      get: {
        operationId: 'getHealth',
        summary: 'Check API and PostgreSQL health',
        responses: {
          '200': { description: 'PostgreSQL is available' },
          '503': { description: 'PostgreSQL is unavailable' },
        },
      },
    },
  },
};

app.http('openapi', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'openapi.json',
  handler: async (_request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> => ({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    jsonBody: apiContract,
  }),
});
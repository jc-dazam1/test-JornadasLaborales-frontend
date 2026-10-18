import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getServices } from '../services/registry';
import { logger } from '../logger';

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async (_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const startedAt = Date.now();
    try {
      const databaseHealthy = await getServices().database.healthCheck();
      const status = databaseHealthy ? 'healthy' : 'unhealthy';
      const response = { status, services: { postgresql: databaseHealthy ? 'healthy' : 'unhealthy' } } as const;
      logger.info({ operationId: context.invocationId, status, durationMs: Date.now() - startedAt }, 'Health check completed');
      return { status: databaseHealthy ? 200 : 503, jsonBody: response };
    } catch (error) {
      logger.error({ err: error, operationId: context.invocationId, durationMs: Date.now() - startedAt }, 'Health check failed');
      return {
        status: 503,
        jsonBody: { status: 'unhealthy', services: { postgresql: 'unhealthy' } },
      };
    }
  },
});
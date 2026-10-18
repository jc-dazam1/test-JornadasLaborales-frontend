import { API_CLIENT } from './api-client';
import { MockApiClient } from './mock-api-client';

export const API_CLIENT_PROVIDER = { provide: API_CLIENT, useClass: MockApiClient };
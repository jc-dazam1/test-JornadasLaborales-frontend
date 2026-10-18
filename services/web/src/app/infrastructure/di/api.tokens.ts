import { InjectionToken } from '@angular/core';
import { ApiClient } from '../../application/ports/api-client';
import { PreviewScenario } from '../../application/ports/preview-scenario';

export const API_CLIENT = new InjectionToken<ApiClient>('API_CLIENT');
export const PREVIEW_SCENARIO = new InjectionToken<PreviewScenario>('PREVIEW_SCENARIO');
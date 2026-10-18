import { Provider } from '@angular/core';
import { ApiClient } from '../../application/ports/api-client';
import { GetCalendarUseCase } from '../../application/use-cases/get-calendar.use-case';
import { GetDashboardUseCase } from '../../application/use-cases/get-dashboard.use-case';
import { GetEmployeesUseCase } from '../../application/use-cases/get-employees.use-case';
import { ManageEmployeesUseCase } from '../../application/use-cases/manage-employees.use-case';
import { ManageWorkdaysUseCase } from '../../application/use-cases/manage-workdays.use-case';
import { ManagePreviewScenarioUseCase } from '../../application/use-cases/manage-preview-scenario.use-case';
import { PreviewScenario } from '../../application/ports/preview-scenario';
import { HttpApiClient } from '../api/http-api-client';
import { API_CLIENT, PREVIEW_SCENARIO } from '../di/api.tokens';
import { PreviewStateService } from '../preview/preview-state.service';

export const APP_PROVIDERS: Provider[] = [
  { provide: API_CLIENT, useClass: HttpApiClient },
  { provide: PREVIEW_SCENARIO, useExisting: PreviewStateService },
  {
    provide: GetDashboardUseCase,
    useFactory: (api: ApiClient) => new GetDashboardUseCase(api),
    deps: [API_CLIENT],
  },
  {
    provide: GetCalendarUseCase,
    useFactory: (api: ApiClient) => new GetCalendarUseCase(api),
    deps: [API_CLIENT],
  },
  {
    provide: GetEmployeesUseCase,
    useFactory: (api: ApiClient) => new GetEmployeesUseCase(api),
    deps: [API_CLIENT],
  },
  {
    provide: ManageEmployeesUseCase,
    useFactory: (api: ApiClient) => new ManageEmployeesUseCase(api),
    deps: [API_CLIENT],
  },
  {
    provide: ManageWorkdaysUseCase,
    useFactory: (api: ApiClient) => new ManageWorkdaysUseCase(api),
    deps: [API_CLIENT],
  },
  {
    provide: ManagePreviewScenarioUseCase,
    useFactory: (preview: PreviewScenario) => new ManagePreviewScenarioUseCase(preview),
    deps: [PREVIEW_SCENARIO],
  },
];
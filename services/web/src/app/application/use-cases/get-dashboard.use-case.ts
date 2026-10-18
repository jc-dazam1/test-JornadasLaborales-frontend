import { ApiClient } from '../ports/api-client';

export class GetDashboardUseCase {
  constructor(private readonly api: ApiClient) {}

  execute() {
    return this.api.getDashboard();
  }
}
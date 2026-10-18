import { ApiClient } from '../ports/api-client';

export class GetEmployeesUseCase {
  constructor(private readonly api: ApiClient) {}

  execute() {
    return this.api.getEmployees();
  }
}
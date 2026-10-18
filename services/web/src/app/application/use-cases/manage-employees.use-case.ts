import { ApiClient } from '../ports/api-client';
import { EmployeeInput } from '../../domain/models';

export class ManageEmployeesUseCase {
  constructor(private readonly api: ApiClient) {}

  create(employee: EmployeeInput) {
    return this.api.createEmployee(employee);
  }

  update(id: number, employee: EmployeeInput) {
    return this.api.updateEmployee(id, employee);
  }

  delete(id: number) {
    return this.api.deleteEmployee(id);
  }
}
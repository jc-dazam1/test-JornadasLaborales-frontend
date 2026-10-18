import { ApiClient } from '../ports/api-client';
import { WorkdayInput, WorkdayUpdate } from '../../domain/models';

export class ManageWorkdaysUseCase {
  constructor(private readonly api: ApiClient) {}

  create(workday: WorkdayInput) {
    return this.api.createWorkday(workday);
  }

  update(id: number, workday: WorkdayUpdate) {
    return this.api.updateWorkday(id, workday);
  }

  delete(id: number) {
    return this.api.deleteWorkday(id);
  }
}
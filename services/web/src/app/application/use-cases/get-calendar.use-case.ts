import { ApiClient } from '../ports/api-client';

export class GetCalendarUseCase {
  constructor(private readonly api: ApiClient) {}

  execute() {
    return this.api.getCalendar();
  }
}
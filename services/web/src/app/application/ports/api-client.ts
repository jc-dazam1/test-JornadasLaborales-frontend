import { CalendarDay, DashboardSummary, Employee, HealthResponse } from '../../domain/models';

export interface ApiClient {
  getDashboard(): Promise<DashboardSummary>;
  getCalendar(): Promise<CalendarDay[]>;
  getEmployees(): Promise<Employee[]>;
  getHealth(): Promise<HealthResponse>;
}

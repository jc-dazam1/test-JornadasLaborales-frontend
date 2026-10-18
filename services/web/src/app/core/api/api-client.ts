import { InjectionToken } from '@angular/core';
import { CalendarDay, DashboardSummary, Employee, HealthResponse } from './models';

export interface ApiClient {
  getDashboard(): Promise<DashboardSummary>;
  getCalendar(): Promise<CalendarDay[]>;
  getEmployees(): Promise<Employee[]>;
  getHealth(): Promise<HealthResponse>;
}

export const API_CLIENT = new InjectionToken<ApiClient>('API_CLIENT');
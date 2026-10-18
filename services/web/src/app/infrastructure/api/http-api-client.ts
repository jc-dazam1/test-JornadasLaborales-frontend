import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiClient } from '../../application/ports/api-client';
import {
  CalendarDay,
  DashboardSummary,
  Employee,
  EmployeeInput,
  EmployeeWorkdaysSummary,
  Workday,
  WorkdayInput,
  WorkdayUpdate,
} from '../../domain/models';
import { API_BASE_URL } from '../di/api.tokens';

@Injectable()
export class HttpApiClient implements ApiClient {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL).replace(/\/$/, '');

  async getDashboard(): Promise<DashboardSummary> {
    const employees = await this.getEmployees();
    const schedules = await this.getAllWorkdays(employees);
    const totalHours = schedules.reduce((total, workday) => total + workday.hoursWorked, 0);

    return {
      employeeCount: employees.length,
      plannedShifts: schedules.length,
      averageHours: schedules.length ? Number((totalHours / schedules.length).toFixed(1)) : 0,
      schedules,
    };
  }

  async getCalendar(): Promise<CalendarDay[]> {
    const employees = await this.getEmployees();
    return this.getAllWorkdays(employees);
  }

  getEmployees(): Promise<Employee[]> {
    return firstValueFrom(this.http.get<Employee[]>(`${this.baseUrl}/Employees`));
  }

  getEmployee(id: number): Promise<Employee> {
    return firstValueFrom(this.http.get<Employee>(`${this.baseUrl}/Employees/${id}`));
  }

  createEmployee(employee: EmployeeInput): Promise<Employee> {
    return firstValueFrom(this.http.post<Employee>(`${this.baseUrl}/Employees`, employee));
  }

  updateEmployee(id: number, employee: EmployeeInput): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${this.baseUrl}/Employees/${id}`, employee));
  }

  deleteEmployee(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/Employees/${id}`));
  }

  getEmployeeWorkdaysSummary(id: number): Promise<EmployeeWorkdaysSummary> {
    return firstValueFrom(this.http.get<EmployeeWorkdaysSummary>(`${this.baseUrl}/Employees/workdays/${id}`));
  }

  getEmployeeWorkdays(employeeId: number): Promise<Workday[]> {
    return firstValueFrom(this.http.get<Workday[]>(`${this.baseUrl}/Workdays/employee/${employeeId}`));
  }

  getWorkday(id: number): Promise<Workday> {
    return firstValueFrom(this.http.get<Workday>(`${this.baseUrl}/Workdays/${id}`));
  }

  createWorkday(workday: WorkdayInput): Promise<Workday> {
    return firstValueFrom(this.http.post<Workday>(`${this.baseUrl}/Workdays`, workday));
  }

  updateWorkday(id: number, workday: WorkdayUpdate): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${this.baseUrl}/Workdays/${id}`, workday));
  }

  deleteWorkday(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/Workdays/${id}`));
  }

  private async getAllWorkdays(employees: Employee[]): Promise<Workday[]> {
    const groupedWorkdays = await Promise.all(
      employees.map(async (employee) => {
        const workdays = await this.getEmployeeWorkdays(employee.id);
        const employeeName = [employee.firstName, employee.lastName].filter(Boolean).join(' ');
        return workdays.map((workday) => ({ ...workday, employeeName }));
      }),
    );

    return groupedWorkdays.flat().sort((left, right) => left.date.localeCompare(right.date));
  }
}
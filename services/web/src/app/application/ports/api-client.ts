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

export interface ApiClient {
  getDashboard(): Promise<DashboardSummary>;
  getCalendar(): Promise<CalendarDay[]>;
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee>;
  createEmployee(employee: EmployeeInput): Promise<Employee>;
  updateEmployee(id: number, employee: EmployeeInput): Promise<void>;
  deleteEmployee(id: number): Promise<void>;
  getEmployeeWorkdaysSummary(id: number): Promise<EmployeeWorkdaysSummary>;
  getEmployeeWorkdays(employeeId: number): Promise<Workday[]>;
  getWorkday(id: number): Promise<Workday>;
  createWorkday(workday: WorkdayInput): Promise<Workday>;
  updateWorkday(id: number, workday: WorkdayUpdate): Promise<void>;
  deleteWorkday(id: number): Promise<void>;
}

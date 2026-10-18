export interface Employee {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  position: string | null;
}

export interface Workday {
  id: number;
  employeeId: number;
  date: string;
  hoursWorked: number;
  employeeName: string;
}

export interface DashboardSummary {
  employeeCount: number;
  plannedShifts: number;
  averageHours: number;
  schedules: Workday[];
}

export type CalendarDay = Workday;

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}

export interface WorkdayInput {
  employeeId: number;
  date: string;
  hoursWorked: number;
}

export interface WorkdayUpdate {
  date?: string | null;
  hoursWorked?: number | null;
}

export interface EmployeeWorkdaysSummary {
  employeeId: number;
  employeeName: string | null;
  workdays: string[] | null;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, 'healthy' | 'unhealthy'>;
}


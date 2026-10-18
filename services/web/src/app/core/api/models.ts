export type ScheduleStatus = 'Confirmed' | 'Pending';
export type EmployeeStatus = 'Active' | 'Review';

export interface Schedule {
  employee: string;
  shift: string;
  hours: number;
  team: string;
  status: ScheduleStatus;
}

export interface Employee {
  name: string;
  position: string;
  availability: 'Available' | 'On leave';
  shift: string;
  status: EmployeeStatus;
  avatar: string;
}

export interface DashboardSummary {
  plannedShifts: number;
  coverage: number;
  pendingApprovals: number;
  averageHours: number;
  schedules: Schedule[];
}

export interface CalendarDay {
  day: string;
  team: string;
  planned: number;
  status: 'On track' | 'Needs review';
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, 'healthy' | 'unhealthy'>;
}

export type DataState = 'loading' | 'error' | 'empty' | 'data';
import { Injectable, inject } from '@angular/core';
import { ApiClient } from '../../application/ports/api-client';
import { CalendarDay, DashboardSummary, Employee, HealthResponse } from '../../domain/models';
import { PREVIEW_SCENARIO } from '../di/api.tokens';

const schedules = [
  { employee: 'Ana García', shift: '08:00–16:00', hours: 8, team: 'Operaciones', status: 'Confirmed' as const },
  { employee: 'Luis Pérez', shift: '09:00–17:00', hours: 8, team: 'Logística', status: 'Confirmed' as const },
  { employee: 'Camila Rojas', shift: '10:00–18:00', hours: 8, team: 'Atención', status: 'Pending' as const },
];

const employees: Employee[] = [
  { name: 'Ana García', position: 'Supervisora', availability: 'Available', shift: '08:00–16:00', status: 'Active', avatar: 'https://i.pravatar.cc/96?u=ana-garcia' },
  { name: 'Luis Pérez', position: 'Líder de logística', availability: 'Available', shift: '09:00–17:00', status: 'Active', avatar: 'https://i.pravatar.cc/96?u=luis-perez' },
  { name: 'Camila Rojas', position: 'Agente de atención', availability: 'On leave', shift: '10:00–18:00', status: 'Review', avatar: 'https://i.pravatar.cc/96?u=camila-rojas' },
];

const calendar: CalendarDay[] = [
  { day: 'Lun · 12', team: 'Operaciones', planned: 24, status: 'On track' },
  { day: 'Mar · 13', team: 'Logística', planned: 20, status: 'On track' },
  { day: 'Mié · 14', team: 'Atención', planned: 16, status: 'Needs review' },
  { day: 'Jue · 15', team: 'Operaciones', planned: 22, status: 'On track' },
  { day: 'Vie · 16', team: 'Logística', planned: 18, status: 'On track' },
];

@Injectable()
export class MockApiClient implements ApiClient {
  private readonly preview = inject(PREVIEW_SCENARIO);

  getDashboard(): Promise<DashboardSummary> {
    return this.respond({ plannedShifts: 128, coverage: 94, pendingApprovals: 12, averageHours: 8.1, schedules });
  }

  getCalendar(): Promise<CalendarDay[]> {
    return this.respond(calendar);
  }

  getEmployees(): Promise<Employee[]> {
    return this.respond(employees);
  }

  getHealth(): Promise<HealthResponse> {
    return this.respond({ status: 'healthy', services: { postgresql: 'healthy' } });
  }

  private async respond<T>(value: T): Promise<T> {
    const state = this.preview.state();
    if (state === 'loading') {
      await new Promise<void>(() => undefined);
    }
    if (state === 'error') {
      throw new Error('No fue posible cargar la información. Intenta nuevamente.');
    }
    await new Promise<void>((resolve) => window.setTimeout(resolve, 180));
    if (state === 'empty') {
      if (Array.isArray(value)) return [] as T;
      if (typeof value === 'object' && value !== null && 'schedules' in value) {
        return { ...value, schedules: [] } as T;
      }
      return value;
    }
    return value;
  }
}
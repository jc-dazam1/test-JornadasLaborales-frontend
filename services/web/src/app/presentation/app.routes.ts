import { Routes } from '@angular/router';
import { CalendarPageComponent } from '../features/calendar/pages/calendar-page.component';
import { DashboardPageComponent } from '../features/dashboard/pages/dashboard-page.component';
import { EmployeesPageComponent } from '../features/employees/pages/employees-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent, title: 'Dashboard | Jornadas Laborales' },
  { path: 'calendar', component: CalendarPageComponent, title: 'Calendario | Jornadas Laborales' },
  { path: 'employees', component: EmployeesPageComponent, title: 'Empleados | Jornadas Laborales' },
  { path: '**', redirectTo: '' },
];
import { Routes } from '@angular/router';
import { CalendarPageComponent } from './pages/calendar/calendar-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { EmployeesPageComponent } from './pages/employees/employees-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent, title: 'Dashboard | Jornadas Laborales' },
  { path: 'calendar', component: CalendarPageComponent, title: 'Calendario | Jornadas Laborales' },
  { path: 'employees', component: EmployeesPageComponent, title: 'Empleados | Jornadas Laborales' },
  { path: '**', redirectTo: '' },
];
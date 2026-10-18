import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GetDashboardUseCase } from '../../../application/use-cases/get-dashboard.use-case';
import { DataState } from '../../../application/models/data-state';
import { DashboardSummary } from '../../../domain/models';
import { DataStateComponent } from '../../../shared/ui/data-state.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTableModule, DataStateComponent],
  template: `
    <section class="page-heading">
      <div>
        <p class="eyebrow"><span></span> OPERACIONES · RESUMEN</p>
        <h1>Jornadas de trabajo</h1>
        <p class="page-subtitle">Cobertura y asignaciones del equipo para la semana del 12 de octubre.</p>
      </div>
      <div class="heading-actions">
        <button mat-stroked-button><mat-icon>download</mat-icon> Exportar</button>
        <button mat-flat-button color="primary"><mat-icon>add</mat-icon> Crear jornada</button>
      </div>
    </section>

    <section class="hero-panel">
      <div class="hero-art" aria-hidden="true"></div>
      <div class="hero-copy">
        <p class="hero-kicker">PLANIFICACIÓN SEMANAL</p>
        <h2>El equipo, en equilibrio.</h2>
        <p>La cobertura está casi completa. Revisa los turnos pendientes antes del cierre de semana.</p>
        <div class="hero-actions">
          <button mat-flat-button class="hero-primary" (click)="scrollToSchedule()"><mat-icon>calendar_month</mat-icon> Ver jornadas</button>
          <button mat-button class="hero-secondary"><mat-icon>arrow_forward</mat-icon> Abrir planificación</button>
        </div>
      </div>
      <div class="hero-metric"><span>Cobertura de turnos</span><strong>{{ summary()?.coverage ?? 94 }}<small>%</small></strong><div class="coverage-track"><span></span></div><span class="hero-note"><mat-icon>trending_up</mat-icon> +4% frente a la semana pasada</span></div>
    </section>

    <app-data-state [state]="state()" (retry)="load()" (emptyAction)="load()"
      emptyIcon="calendar_add_on" emptyTitle="Sin jornadas esta semana"
      emptyMessage="Crea la primera jornada para comenzar a organizar turnos." actionLabel="Crear jornada">
      @if (summary(); as data) {
        <section class="metric-grid" aria-label="Indicadores de cobertura">
          <mat-card class="metric-card"><div class="metric-top"><span class="metric-icon blue"><mat-icon>event_available</mat-icon></span><span class="metric-change positive">+8 esta semana</span></div><p>Jornadas planeadas</p><strong>{{ data.plannedShifts }}</strong><span class="metric-foot">En todas las áreas</span></mat-card>
          <mat-card class="metric-card"><div class="metric-top"><span class="metric-icon green"><mat-icon>task_alt</mat-icon></span><span class="metric-change positive">Objetivo 90%</span></div><p>Cobertura</p><strong>{{ data.coverage }}<small>%</small></strong><span class="metric-foot">Turnos con personal asignado</span></mat-card>
          <mat-card class="metric-card"><div class="metric-top"><span class="metric-icon amber"><mat-icon>pending_actions</mat-icon></span><span class="metric-change attention">Requieren revisión</span></div><p>Aprobaciones pendientes</p><strong>{{ data.pendingApprovals }}</strong><span class="metric-foot">De 3 departamentos</span></mat-card>
          <mat-card class="metric-card"><div class="metric-top"><span class="metric-icon coral"><mat-icon>schedule</mat-icon></span><span class="metric-change">Límite: 9 h</span></div><p>Promedio de horas</p><strong>{{ data.averageHours }}<small> h</small></strong><span class="metric-foot">Por persona esta semana</span></mat-card>
        </section>

        <section class="content-section" id="schedule-table">
          <div class="section-heading"><div><p class="eyebrow">EQUIPO Y COBERTURA</p><h2>Jornadas asignadas</h2></div><button mat-button>Ver todas <mat-icon>arrow_forward</mat-icon></button></div>
          <mat-card class="table-card">
            <table mat-table [dataSource]="data.schedules" class="schedule-table">
              <ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>Empleado</th><td mat-cell *matCellDef="let row"><div class="employee-cell"><span class="person-initials">{{ initials(row.employee) }}</span><strong>{{ row.employee }}</strong></div></td></ng-container>
              <ng-container matColumnDef="shift"><th mat-header-cell *matHeaderCellDef>Turno</th><td mat-cell *matCellDef="let row">{{ row.shift }}</td></ng-container>
              <ng-container matColumnDef="hours"><th mat-header-cell *matHeaderCellDef>Horas</th><td mat-cell *matCellDef="let row">{{ row.hours }} h</td></ng-container>
              <ng-container matColumnDef="team"><th mat-header-cell *matHeaderCellDef>Equipo</th><td mat-cell *matCellDef="let row">{{ row.team }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let row"><span class="status-pill" [class.pending]="row.status === 'Pending'"><span></span>{{ row.status === 'Confirmed' ? 'Confirmada' : 'Pendiente' }}</span></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns"></tr>
            </table>
          </mat-card>
        </section>
      }
    </app-data-state>
  `,
})
export class DashboardPageComponent implements OnInit {
  private readonly getDashboard = inject(GetDashboardUseCase);
  readonly summary = signal<DashboardSummary | null>(null);
  readonly state = signal<DataState>('loading');
  readonly columns = ['employee', 'shift', 'hours', 'team', 'status'];

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      const data = await this.getDashboard.execute();
      this.summary.set(data);
      this.state.set(data.schedules.length ? 'data' : 'empty');
    } catch {
      this.state.set('error');
    }
  }

  initials(name: string): string {
    return name.split(' ').map((part) => part[0]).join('');
  }

  scrollToSchedule(): void {
    document.getElementById('schedule-table')?.scrollIntoView({ behavior: 'smooth' });
  }
}
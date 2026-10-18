import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  imports: [DatePipe, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, DataStateComponent],
  template: `
    <section class="page-heading">
      <div>
        <p class="eyebrow"><span></span> OPERACIONES · RESUMEN</p>
        <h1>Jornadas de trabajo</h1>
        <p class="page-subtitle">Resumen de empleados y jornadas registrados en el sistema.</p>
      </div>
    </section>

    <app-data-state [state]="state()" (retry)="load()" (emptyAction)="load()"
      emptyIcon="calendar_add_on" emptyTitle="Sin jornadas registradas"
      emptyMessage="Cuando existan jornadas asociadas a empleados, aparecerán aquí.">
      @if (summary(); as data) {
        <section class="metric-grid" aria-label="Resumen de empleados y jornadas">
          <mat-card class="metric-card"><div class="metric-top"><span class="metric-icon blue"><mat-icon>event_available</mat-icon></span></div><p>Jornadas registradas</p><strong>{{ data.plannedShifts }}</strong><span class="metric-foot">Total consultado en el API</span></mat-card>
          <mat-card class="metric-card"><div class="metric-top"><span class="metric-icon green"><mat-icon>groups</mat-icon></span></div><p>Empleados</p><strong>{{ data.employeeCount }}</strong><span class="metric-foot">Registros activos en el directorio</span></mat-card>
          <mat-card class="metric-card"><div class="metric-top"><span class="metric-icon coral"><mat-icon>schedule</mat-icon></span></div><p>Promedio de horas</p><strong>{{ data.averageHours }}<small> h</small></strong><span class="metric-foot">Por jornada registrada</span></mat-card>
        </section>

        <section class="content-section" id="schedule-table">
          <div class="section-heading"><div><p class="eyebrow">DATOS DEL API</p><h2>Jornadas asignadas</h2></div></div>
          <mat-card class="table-card">
            <table mat-table [dataSource]="data.schedules" class="schedule-table">
              <ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>Empleado</th><td mat-cell *matCellDef="let row"><div class="employee-cell"><span class="person-initials">{{ initials(row.employeeName) }}</span><strong>{{ row.employeeName }}</strong></div></td></ng-container>
              <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Fecha</th><td mat-cell *matCellDef="let row">{{ row.date | date:'medium' }}</td></ng-container>
              <ng-container matColumnDef="hours"><th mat-header-cell *matHeaderCellDef>Horas</th><td mat-cell *matCellDef="let row">{{ row.hoursWorked }} h</td></ng-container>
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
  readonly columns = ['employee', 'date', 'hours'];

  ngOnInit(): void { void this.load(); }

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

}
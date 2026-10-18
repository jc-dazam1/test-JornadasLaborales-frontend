import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GetCalendarUseCase } from '../../../application/use-cases/get-calendar.use-case';
import { DataState } from '../../../application/models/data-state';
import { CalendarDay } from '../../../domain/models';
import { DataStateComponent } from '../../../shared/ui/data-state.component';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatTableModule, ReactiveFormsModule, DataStateComponent],
  template: `
    <section class="page-heading">
      <div><p class="eyebrow"><span></span> PLANIFICACIÓN · OCTUBRE 2026</p><h1>Calendario laboral</h1><p class="page-subtitle">Vista semanal de turnos y cobertura por equipo.</p></div>
      <div class="heading-actions"><button mat-stroked-button><mat-icon>chevron_left</mat-icon> Semana anterior</button><button mat-flat-button color="primary"><mat-icon>add</mat-icon> Agregar turno</button></div>
    </section>
    <app-data-state [state]="state()" (retry)="load()" (emptyAction)="load()" emptyIcon="event_busy" emptyTitle="Semana sin turnos" emptyMessage="Ajusta los filtros o programa el primer turno." actionLabel="Agregar turno">
      @if (days().length) {
        <div class="calendar-layout">
          <mat-card class="table-card week-card">
            <div class="section-heading inline-heading"><div><p class="eyebrow">SEMANA 42</p><h2>12 – 18 de octubre</h2></div><span class="week-tag"><mat-icon>today</mat-icon> Hoy · 17 oct</span></div>
            <table mat-table [dataSource]="days()" class="schedule-table">
              <ng-container matColumnDef="day"><th mat-header-cell *matHeaderCellDef>Día</th><td mat-cell *matCellDef="let row"><strong>{{ row.day }}</strong></td></ng-container>
              <ng-container matColumnDef="team"><th mat-header-cell *matHeaderCellDef>Equipo</th><td mat-cell *matCellDef="let row">{{ row.team }}</td></ng-container>
              <ng-container matColumnDef="planned"><th mat-header-cell *matHeaderCellDef>Turnos</th><td mat-cell *matCellDef="let row">{{ row.planned }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Cobertura</th><td mat-cell *matCellDef="let row"><span class="status-pill" [class.pending]="row.status === 'Needs review'"><span></span>{{ row.status === 'On track' ? 'En orden' : 'Por revisar' }}</span></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr><tr mat-row *matRowDef="let row; columns: columns"></tr>
            </table>
            <div class="calendar-summary"><span class="summary-icon"><mat-icon>insights</mat-icon></span><div><strong>100 turnos programados</strong><p>La cobertura semanal está por encima de la meta.</p></div><span class="summary-rate">92%</span></div>
          </mat-card>
          <aside class="calendar-aside">
            <mat-card class="filter-card"><div class="section-heading"><div><p class="eyebrow">PERSONALIZA LA VISTA</p><h2>Filtros</h2></div><mat-icon class="heading-icon">tune</mat-icon></div>
              <mat-form-field appearance="outline"><mat-label>Departamento</mat-label><mat-select [formControl]="department"><mat-option value="Operaciones">Operaciones</mat-option><mat-option value="Logística">Logística</mat-option><mat-option value="Atención">Atención</mat-option></mat-select><mat-error>Selecciona un departamento para filtrar</mat-error></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Tipo de turno</mat-label><mat-select value="Todos"><mat-option value="Todos">Todos los turnos</mat-option><mat-option value="Mañana">Mañana</mat-option><mat-option value="Tarde">Tarde</mat-option></mat-select></mat-form-field>
              <button mat-stroked-button class="filter-reset" (click)="department.setValue('')"><mat-icon>restart_alt</mat-icon> Limpiar filtros</button>
            </mat-card>
            <mat-card class="coverage-card"><div class="section-heading"><div><p class="eyebrow">DISTRIBUCIÓN</p><h2>Por departamento</h2></div></div>
              <div class="coverage-row"><span class="coverage-bullet ops"></span><span>Operaciones</span><strong>48</strong></div><div class="coverage-row"><span class="coverage-bullet logistics"></span><span>Logística</span><strong>32</strong></div><div class="coverage-row"><span class="coverage-bullet support"></span><span>Atención</span><strong>20</strong></div>
              <div class="distribution-track"><span></span><span></span><span></span></div>
            </mat-card>
          </aside>
        </div>
      }
    </app-data-state>
  `,
})
export class CalendarPageComponent implements OnInit {
  private readonly getCalendar = inject(GetCalendarUseCase);
  readonly days = signal<CalendarDay[]>([]);
  readonly state = signal<DataState>('loading');
  readonly columns = ['day', 'team', 'planned', 'status'];
  readonly department = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  ngOnInit(): void {
    this.department.markAsTouched();
    this.load();
  }

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.days.set(await this.getCalendar.execute());
      this.state.set(this.days().length ? 'data' : 'empty');
    } catch {
      this.state.set('error');
    }
  }
}
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GetCalendarUseCase } from '../../../application/use-cases/get-calendar.use-case';
import { GetEmployeesUseCase } from '../../../application/use-cases/get-employees.use-case';
import { ManageWorkdaysUseCase } from '../../../application/use-cases/manage-workdays.use-case';
import { DataState } from '../../../application/models/data-state';
import { CalendarDay, Employee, Workday } from '../../../domain/models';
import { DataStateComponent } from '../../../shared/ui/data-state.component';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTableModule, ReactiveFormsModule, DataStateComponent],
  template: `
    <section class="page-heading">
      <div><p class="eyebrow"><span></span> PLANIFICACIÓN · JORNADAS</p><h1>Calendario laboral</h1><p class="page-subtitle">Fechas y horas registradas para cada empleado.</p></div>
      <button mat-flat-button color="primary" (click)="startCreate()"><mat-icon>add</mat-icon> Agregar jornada</button>
    </section>
    @if (formVisible()) {
      <mat-card class="table-card workday-form">
        <form [formGroup]="workdayForm" (ngSubmit)="saveWorkday()">
          <div class="section-heading"><div><p class="eyebrow">PLANIFICACIÓN</p><h2>{{ editingWorkday() ? 'Editar jornada' : 'Nueva jornada' }}</h2></div><button mat-icon-button type="button" aria-label="Cerrar formulario" (click)="cancelEdit()"><mat-icon>close</mat-icon></button></div>
          <mat-form-field appearance="outline"><mat-label>Empleado</mat-label><mat-select formControlName="employeeId" [disabled]="!!editingWorkday()"><mat-option [value]="0" disabled>Selecciona un empleado</mat-option>@for (employee of employees(); track employee.id) { <mat-option [value]="employee.id">{{ employeeName(employee) }}</mat-option> }</mat-select></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Fecha y hora</mat-label><input matInput type="datetime-local" formControlName="date" required></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Horas trabajadas</mat-label><input matInput type="number" min="0.1" max="24" step="0.5" formControlName="hoursWorked" required></mat-form-field>
          @if (formError()) { <p role="alert">{{ formError() }}</p> }
          <button mat-flat-button color="primary" type="submit" [disabled]="workdayForm.invalid || saving()">{{ saving() ? 'Guardando…' : 'Guardar' }}</button>
          <button mat-button type="button" (click)="cancelEdit()">Cancelar</button>
        </form>
      </mat-card>
    }
    @if (actionError()) { <p role="alert">{{ actionError() }}</p> }
    <app-data-state [state]="state()" (retry)="load()" emptyIcon="event_busy" emptyTitle="Sin jornadas registradas" emptyMessage="Las jornadas disponibles aparecerán aquí.">
      @if (days().length) {
        <section class="content-section">
          <mat-card class="table-card week-card">
            <div class="section-heading inline-heading"><div><p class="eyebrow">DATOS DEL API</p><h2>Jornadas registradas</h2></div><span class="week-tag"><mat-icon>event</mat-icon> {{ days().length }} en total</span></div>
            <table mat-table [dataSource]="days()" class="schedule-table">
              <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Fecha</th><td mat-cell *matCellDef="let row"><strong>{{ row.date | date:'medium' }}</strong></td></ng-container>
              <ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>Empleado</th><td mat-cell *matCellDef="let row">{{ row.employeeName }}</td></ng-container>
              <ng-container matColumnDef="hours"><th mat-header-cell *matHeaderCellDef>Horas trabajadas</th><td mat-cell *matCellDef="let row">{{ row.hoursWorked }} h</td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let row"><button mat-icon-button [attr.aria-label]="'Editar jornada del ' + (row.date | date:'mediumDate')" (click)="startEdit(row)"><mat-icon>edit</mat-icon></button><button mat-icon-button [attr.aria-label]="'Eliminar jornada del ' + (row.date | date:'mediumDate')" (click)="deleteWorkday(row)"><mat-icon>delete</mat-icon></button></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr><tr mat-row *matRowDef="let row; columns: columns"></tr>
            </table>
          </mat-card>
        </section>
      }
    </app-data-state>
  `,
})
export class CalendarPageComponent implements OnInit {
  private readonly getCalendar = inject(GetCalendarUseCase);
  private readonly getEmployees = inject(GetEmployeesUseCase);
  private readonly manageWorkdays = inject(ManageWorkdaysUseCase);
  private readonly formBuilder = inject(FormBuilder);
  readonly days = signal<CalendarDay[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly state = signal<DataState>('loading');
  readonly columns = ['date', 'employee', 'hours', 'actions'];
  readonly editingWorkday = signal<Workday | null>(null);
  readonly formVisible = signal(false);
  readonly formError = signal('');
  readonly actionError = signal('');
  readonly saving = signal(false);
  readonly workdayForm = this.formBuilder.nonNullable.group({
    employeeId: [0, Validators.min(1)],
    date: ['', Validators.required],
    hoursWorked: [8, [Validators.required, Validators.min(0.1), Validators.max(24)]],
  });

  ngOnInit(): void { void this.load(); }

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      const [days, employees] = await Promise.all([
        this.getCalendar.execute(),
        this.getEmployees.execute(),
      ]);
      this.days.set(days);
      this.employees.set(employees);
      this.state.set(this.days().length ? 'data' : 'empty');
    } catch {
      this.state.set('error');
    }
  }

  employeeName(employee: Employee): string {
    return [employee.firstName, employee.lastName].filter(Boolean).join(' ') || `Empleado #${employee.id}`;
  }

  startCreate(): void {
    this.editingWorkday.set(null);
    this.formError.set('');
    this.actionError.set('');
    this.workdayForm.reset({
      employeeId: this.employees()[0]?.id ?? 0,
      date: this.toLocalDateTime(new Date().toISOString()),
      hoursWorked: 8,
    });
    this.formVisible.set(true);
  }

  startEdit(workday: Workday): void {
    this.editingWorkday.set(workday);
    this.formError.set('');
    this.actionError.set('');
    this.workdayForm.setValue({
      employeeId: workday.employeeId,
      date: this.toLocalDateTime(workday.date),
      hoursWorked: workday.hoursWorked,
    });
    this.formVisible.set(true);
  }

  cancelEdit(): void {
    this.formVisible.set(false);
    this.editingWorkday.set(null);
    this.workdayForm.reset({ employeeId: 0, date: '', hoursWorked: 8 });
    this.formError.set('');
  }

  async saveWorkday(): Promise<void> {
    if (this.workdayForm.invalid || this.saving()) return;
    this.saving.set(true);
    this.formError.set('');
    this.actionError.set('');
    try {
      const value = this.workdayForm.getRawValue();
      const current = this.editingWorkday();
      const date = new Date(value.date).toISOString();
      if (current) {
        await this.manageWorkdays.update(current.id, { date, hoursWorked: value.hoursWorked });
      } else {
        await this.manageWorkdays.create({ employeeId: value.employeeId, date, hoursWorked: value.hoursWorked });
      }
      this.cancelEdit();
      await this.load();
    } catch {
      this.formError.set('No fue posible guardar la jornada. Intenta nuevamente.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteWorkday(workday: Workday): Promise<void> {
    if (!window.confirm('¿Eliminar esta jornada?')) return;
    this.actionError.set('');
    try {
      await this.manageWorkdays.delete(workday.id);
      await this.load();
    } catch {
      this.actionError.set('No fue posible eliminar la jornada. Intenta nuevamente.');
    }
  }

  private toLocalDateTime(value: string): string {
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
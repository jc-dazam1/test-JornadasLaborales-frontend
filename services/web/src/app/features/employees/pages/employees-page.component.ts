import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { GetEmployeesUseCase } from '../../../application/use-cases/get-employees.use-case';
import { ManageEmployeesUseCase } from '../../../application/use-cases/manage-employees.use-case';
import { DataState } from '../../../application/models/data-state';
import { Employee } from '../../../domain/models';
import { DataStateComponent } from '../../../shared/ui/data-state.component';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTableModule, ReactiveFormsModule, DataStateComponent],
  template: `
    <section class="page-heading">
      <div><p class="eyebrow"><span></span> PERSONAL · EQUIPO OPERATIVO</p><h1>Directorio de empleados</h1><p class="page-subtitle">Información de empleados consultada desde el API.</p></div>
      <button mat-flat-button color="primary" (click)="startCreate()"><mat-icon>person_add</mat-icon> Agregar empleado</button>
    </section>
    @if (formVisible()) {
      <mat-card class="table-card employee-form">
        <form [formGroup]="employeeForm" (ngSubmit)="saveEmployee()">
          <div class="section-heading"><div><p class="eyebrow">DIRECTORIO</p><h2>{{ editingEmployee() ? 'Editar empleado' : 'Nuevo empleado' }}</h2></div><button mat-icon-button type="button" aria-label="Cerrar formulario" (click)="cancelEdit()"><mat-icon>close</mat-icon></button></div>
          <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="firstName" required></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Apellido</mat-label><input matInput formControlName="lastName" required></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Correo</mat-label><input matInput type="email" formControlName="email" required></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Cargo</mat-label><input matInput formControlName="position" required></mat-form-field>
          @if (formError()) { <p role="alert">{{ formError() }}</p> }
          <button mat-flat-button color="primary" type="submit" [disabled]="employeeForm.invalid || saving()">{{ saving() ? 'Guardando…' : 'Guardar' }}</button>
          <button mat-button type="button" (click)="cancelEdit()">Cancelar</button>
        </form>
      </mat-card>
    }
    @if (actionError()) { <p role="alert">{{ actionError() }}</p> }
    <section class="roster-summary">
      <div class="roster-stat"><span class="metric-icon blue"><mat-icon>groups</mat-icon></span><div><span>Empleados registrados</span><strong>{{ employees().length }}</strong></div></div>
    </section>
    <app-data-state [state]="state()" (retry)="load()" emptyIcon="person_search" emptyTitle="Aún no hay empleados" emptyMessage="Los empleados disponibles aparecerán aquí.">
      @if (employees().length) {
        <section class="content-section roster-table-section">
          <div class="section-heading"><div><p class="eyebrow">DIRECTORIO · {{ employees().length }} REGISTROS</p><h2>Empleados</h2></div></div>
          <mat-card class="table-card">
            <table mat-table [dataSource]="employees()" class="schedule-table employees-table">
              <ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>Empleado</th><td mat-cell *matCellDef="let row"><div class="employee-cell"><span class="person-initials">{{ initials(row) }}</span><div><strong>{{ employeeName(row) }}</strong><small>#{{ row.id }}</small></div></div></td></ng-container>
              <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Correo</th><td mat-cell *matCellDef="let row">{{ row.email || '—' }}</td></ng-container>
              <ng-container matColumnDef="position"><th mat-header-cell *matHeaderCellDef>Cargo</th><td mat-cell *matCellDef="let row">{{ row.position || '—' }}</td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let row"><button mat-icon-button [attr.aria-label]="'Editar ' + employeeName(row)" (click)="startEdit(row)"><mat-icon>edit</mat-icon></button><button mat-icon-button [attr.aria-label]="'Eliminar ' + employeeName(row)" (click)="deleteEmployee(row)"><mat-icon>delete</mat-icon></button></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="columns"></tr><tr mat-row *matRowDef="let row; columns: columns"></tr>
            </table>
          </mat-card>
        </section>
      }
    </app-data-state>
  `,
})
export class EmployeesPageComponent implements OnInit {
  private readonly getEmployees = inject(GetEmployeesUseCase);
  readonly employees = signal<Employee[]>([]);
  readonly state = signal<DataState>('loading');
  readonly columns = ['employee', 'email', 'position', 'actions'];
  private readonly formBuilder = inject(FormBuilder);
  private readonly manageEmployees = inject(ManageEmployeesUseCase);
  readonly employeeForm = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    position: ['', Validators.required],
  });
  readonly editingEmployee = signal<Employee | null>(null);
  readonly formVisible = signal(false);
  readonly formError = signal('');
  readonly actionError = signal('');
  readonly saving = signal(false);

  ngOnInit(): void { void this.load(); }

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.employees.set(await this.getEmployees.execute());
      this.state.set(this.employees().length ? 'data' : 'empty');
    } catch {
      this.state.set('error');
    }
  }

  employeeName(employee: Employee): string {
    return [employee.firstName, employee.lastName].filter(Boolean).join(' ') || 'Sin nombre';
  }

  initials(employee: Employee): string {
    return [employee.firstName, employee.lastName]
      .filter((name): name is string => Boolean(name))
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  }

  startCreate(): void {
    this.editingEmployee.set(null);
    this.formError.set('');
    this.actionError.set('');
    this.employeeForm.reset();
    this.formVisible.set(true);
  }

  startEdit(employee: Employee): void {
    this.editingEmployee.set(employee);
    this.formError.set('');
    this.actionError.set('');
    this.employeeForm.setValue({
      firstName: employee.firstName ?? '',
      lastName: employee.lastName ?? '',
      email: employee.email ?? '',
      position: employee.position ?? '',
    });
    this.formVisible.set(true);
  }

  cancelEdit(): void {
    this.formVisible.set(false);
    this.editingEmployee.set(null);
    this.employeeForm.reset();
    this.formError.set('');
  }

  async saveEmployee(): Promise<void> {
    if (this.employeeForm.invalid || this.saving()) return;
    this.saving.set(true);
    this.formError.set('');
    try {
      const employee = this.employeeForm.getRawValue();
      const current = this.editingEmployee();
      if (current) await this.manageEmployees.update(current.id, employee);
      else await this.manageEmployees.create(employee);
      this.cancelEdit();
      await this.load();
    } catch {
      this.formError.set('No fue posible guardar el empleado. Intenta nuevamente.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteEmployee(employee: Employee): Promise<void> {
    if (!window.confirm(`¿Eliminar a ${this.employeeName(employee)}?`)) return;
    this.actionError.set('');
    try {
      await this.manageEmployees.delete(employee.id);
      await this.load();
    } catch {
      this.actionError.set('No fue posible eliminar el empleado. Intenta nuevamente.');
    }
  }
}
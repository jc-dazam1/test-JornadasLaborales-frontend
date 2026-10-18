import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { GetEmployeesUseCase } from '../../../application/use-cases/get-employees.use-case';
import { DataState } from '../../../application/models/data-state';
import { Employee } from '../../../domain/models';
import { DataStateComponent } from '../../../shared/ui/data-state.component';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTableModule, DataStateComponent],
  template: `
    <section class="page-heading">
      <div><p class="eyebrow"><span></span> PERSONAL · EQUIPO OPERATIVO</p><h1>Directorio de empleados</h1><p class="page-subtitle">Disponibilidad, asignación y estado de cada integrante.</p></div>
      <div class="heading-actions"><button mat-stroked-button><mat-icon>filter_list</mat-icon> Filtrar</button><button mat-flat-button color="primary"><mat-icon>person_add</mat-icon> Agregar empleado</button></div>
    </section>
    <section class="roster-summary">
      <div class="roster-stat"><span class="metric-icon blue"><mat-icon>groups</mat-icon></span><div><span>Personas en el equipo</span><strong>{{ employees().length || 18 }}</strong></div></div>
      <div class="roster-stat"><span class="metric-icon green"><mat-icon>how_to_reg</mat-icon></span><div><span>Disponibles hoy</span><strong>16 <small>de 18</small></strong></div></div>
      <div class="roster-stat"><span class="metric-icon amber"><mat-icon>event_busy</mat-icon></span><div><span>Ausencias registradas</span><strong>2 <small>esta semana</small></strong></div></div>
      <div class="roster-avatars"><span>Equipo de hoy</span><div class="avatar-stack"><img src="https://i.pravatar.cc/96?u=ana-garcia" alt="Ana García"><img src="https://i.pravatar.cc/96?u=luis-perez" alt="Luis Pérez"><img src="https://i.pravatar.cc/96?u=camila-rojas" alt="Camila Rojas"><b>+15</b></div></div>
    </section>
    <app-data-state [state]="state()" (retry)="load()" (emptyAction)="load()" emptyIcon="person_add" emptyTitle="Aún no hay empleados" emptyMessage="Añade integrantes para empezar a organizar sus jornadas." actionLabel="Agregar empleado">
      @if (employees().length) {
        <section class="content-section roster-table-section">
          <div class="section-heading"><div><p class="eyebrow">ROSTER · 3 MOSTRADOS</p><h2>Equipo y disponibilidad</h2></div><button mat-button>Ver restricciones <mat-icon>arrow_forward</mat-icon></button></div>
          <mat-card class="table-card">
            <table mat-table [dataSource]="employees()" class="schedule-table employees-table">
              <ng-container matColumnDef="employee"><th mat-header-cell *matHeaderCellDef>Empleado</th><td mat-cell *matCellDef="let row"><div class="employee-cell"><img class="employee-avatar" [src]="row.avatar" [alt]="row.name"><div><strong>{{ row.name }}</strong><small>{{ row.position }}</small></div></div></td></ng-container>
              <ng-container matColumnDef="availability"><th mat-header-cell *matHeaderCellDef>Disponibilidad</th><td mat-cell *matCellDef="let row"><span class="availability" [class.away]="row.availability === 'On leave'"><span></span>{{ row.availability === 'Available' ? 'Disponible' : 'En permiso' }}</span></td></ng-container>
              <ng-container matColumnDef="shift"><th mat-header-cell *matHeaderCellDef>Turno asignado</th><td mat-cell *matCellDef="let row">{{ row.shift }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Estado</th><td mat-cell *matCellDef="let row"><span class="status-pill" [class.pending]="row.status === 'Review'"><span></span>{{ row.status === 'Active' ? 'Activo' : 'Revisar' }}</span></td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let row"><button mat-icon-button [attr.aria-label]="'Más opciones para ' + row.name"><mat-icon>more_horiz</mat-icon></button></td></ng-container>
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
  readonly columns = ['employee', 'availability', 'shift', 'status', 'actions'];

  ngOnInit(): void { this.load(); }

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.employees.set(await this.getEmployees.execute());
      this.state.set(this.employees().length ? 'data' : 'empty');
    } catch {
      this.state.set('error');
    }
  }
}
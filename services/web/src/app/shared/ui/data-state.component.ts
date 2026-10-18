import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataState } from '../../application/models/data-state';

@Component({
  selector: 'app-data-state',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  template: `
    @switch (state) {
      @case ('loading') {
        <mat-card class="state-card loading-state" aria-label="Cargando información">
          <mat-progress-bar mode="indeterminate" />
          <div class="loading-lines"><span></span><span></span><span></span></div>
        </mat-card>
      }
      @case ('error') {
        <mat-card class="state-card empty-state">
          <mat-icon class="state-icon error-icon">cloud_off</mat-icon>
          <h2>No pudimos cargar los datos</h2>
          <p>Comprueba tu conexión e inténtalo de nuevo.</p>
          <button mat-flat-button color="primary" (click)="retry.emit()">Reintentar</button>
        </mat-card>
      }
      @case ('empty') {
        <mat-card class="state-card empty-state">
          <mat-icon class="state-icon">{{ emptyIcon }}</mat-icon>
          <h2>{{ emptyTitle }}</h2>
          <p>{{ emptyMessage }}</p>
          <button mat-flat-button color="primary" (click)="emptyAction.emit()">{{ actionLabel }}</button>
        </mat-card>
      }
      @default { <ng-content /> }
    }
  `,
})
export class DataStateComponent {
  @Input({ required: true }) state: DataState = 'loading';
  @Input() emptyIcon = 'inbox';
  @Input() emptyTitle = 'Sin información';
  @Input() emptyMessage = 'No hay registros para mostrar.';
  @Input() actionLabel = 'Actualizar';
  @Output() retry = new EventEmitter<void>();
  @Output() emptyAction = new EventEmitter<void>();
}
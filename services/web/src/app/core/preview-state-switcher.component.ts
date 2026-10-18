import { Component, inject, isDevMode } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DataState } from './api/models';
import { PreviewStateService } from './preview-state.service';

@Component({
  selector: 'app-preview-state-switcher',
  standalone: true,
  imports: [MatButtonToggleModule],
  template: `
    @if (isDevelopment) {
      <mat-button-toggle-group aria-label="Preview data state" [value]="preview.state()" (change)="preview.setState($event.value)">
        <mat-button-toggle value="data">Datos</mat-button-toggle><mat-button-toggle value="loading">Carga</mat-button-toggle><mat-button-toggle value="empty">Vacío</mat-button-toggle><mat-button-toggle value="error">Error</mat-button-toggle>
      </mat-button-toggle-group>
    }
  `,
  styles: [`:host { position: fixed; right: 16px; bottom: 16px; z-index: 1000; }`],
})
export class PreviewStateSwitcherComponent {
  readonly preview = inject(PreviewStateService);
  readonly isDevelopment = isDevMode();
}
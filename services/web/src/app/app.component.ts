import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PreviewStateSwitcherComponent } from './core/preview-state-switcher.component';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule, PreviewStateSwitcherComponent],
  template: `
    <mat-toolbar class="topbar">
      <a class="brand" routerLink="/" aria-label="Jornadas Laborales, inicio"><span class="brand-mark"><mat-icon>schedule</mat-icon></span><span>Jornadas <strong>Laborales</strong></span></a>
      <span class="toolbar-spacer"></span>
      <span class="workspace-label">OPERACIONES · COLOMBIA</span>
      <button mat-icon-button (click)="theme.toggle()" [attr.aria-label]="theme.isDark() ? 'Activar tema claro' : 'Activar tema oscuro'"><mat-icon>{{ theme.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon></button>
      <span class="user-avatar" aria-label="Usuario, Ana García">AG</span>
    </mat-toolbar>
    <mat-sidenav-container class="app-frame">
      <mat-sidenav class="sidebar" mode="side" opened>
        <div class="nav-caption">PLANIFICACIÓN</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/" routerLinkActive="nav-active" [routerLinkActiveOptions]="{ exact: true }"><mat-icon matListItemIcon>space_dashboard</mat-icon><span matListItemTitle>Dashboard</span></a>
          <a mat-list-item routerLink="/calendar" routerLinkActive="nav-active"><mat-icon matListItemIcon>calendar_month</mat-icon><span matListItemTitle>Calendario</span></a>
          <a mat-list-item routerLink="/employees" routerLinkActive="nav-active"><mat-icon matListItemIcon>groups</mat-icon><span matListItemTitle>Empleados</span></a>
        </mat-nav-list>
        <div class="sidebar-bottom"><div class="sidebar-status"><span class="status-dot"></span><span>Turno operativo</span><strong>Activo</strong></div><p>Semana laboral<br><strong>12 – 18 oct, 2026</strong></p></div>
      </mat-sidenav>
      <mat-sidenav-content class="main-frame"><main class="route-content"><router-outlet /></main></mat-sidenav-content>
    </mat-sidenav-container>
    <app-preview-state-switcher />
  `,
})
export class AppComponent {
  readonly theme = inject(ThemeService);
}
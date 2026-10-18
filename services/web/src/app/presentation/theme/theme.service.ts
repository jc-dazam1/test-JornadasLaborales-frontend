import { Injectable, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly mode = signal<ThemeMode>((localStorage.getItem('app-theme') as ThemeMode | null) ?? 'system');
  readonly isDark = signal(false);

  constructor() {
    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    this.apply(this.mode(), preference.matches);
    preference.addEventListener('change', (event) => {
      if (this.mode() === 'system') this.apply('system', event.matches);
    });
  }

  toggle(): void {
    const next = this.isDark() ? 'light' : 'dark';
    this.mode.set(next);
    localStorage.setItem('app-theme', next);
    this.apply(next, false);
  }

  private apply(mode: ThemeMode, systemDark: boolean): void {
    const dark = mode === 'dark' || (mode === 'system' && systemDark);
    this.isDark.set(dark);
    document.body.dataset['theme'] = dark ? 'dark' : 'light';
  }
}
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { API_BASE_URL } from './app/infrastructure/di/api.tokens';
import { APP_PROVIDERS } from './app/infrastructure/providers/app.providers';
import { AppShellComponent } from './app/presentation/layout/app-shell.component';
import { routes } from './app/presentation/app.routes';

async function bootstrap(): Promise<void> {
  const response = await fetch('/assets/runtime-config.json');
  if (!response.ok) throw new Error('No se pudo cargar la configuración del API.');
  const config = await response.json() as { apiBaseUrl: string };

  await bootstrapApplication(AppShellComponent, {
    providers: [
      provideHttpClient(),
      provideAnimationsAsync(),
      provideRouter(routes),
      { provide: API_BASE_URL, useValue: config.apiBaseUrl },
      ...APP_PROVIDERS,
    ],
  });
}

bootstrap().catch((error: unknown) => console.error(error));
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { APP_PROVIDERS } from './app/infrastructure/providers/app.providers';
import { AppShellComponent } from './app/presentation/layout/app-shell.component';
import { routes } from './app/presentation/app.routes';

bootstrapApplication(AppShellComponent, {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes),
    ...APP_PROVIDERS,
  ],
}).catch((error: unknown) => console.error(error));
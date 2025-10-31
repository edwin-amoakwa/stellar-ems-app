import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {routes} from './app/app-routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {CoreModule} from './app/core/core.module';
import { RequestInterceptor } from './app/core/requestInterceptor';
import {MessageService} from 'primeng/api';
import { registerLocaleData } from '@angular/common';
import localeEnGh from '@angular/common/locales/en-GH';
import { LOCALE_ID,DEFAULT_CURRENCY_CODE } from '@angular/core';
import {provideRouter} from '@angular/router';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeEnGh);

document.documentElement.setAttribute('data-theme', 'dark');

bootstrapApplication(AppComponent, {
  providers: [
    MessageService,
    importProvidersFrom(BrowserModule, CoreModule),
    provideAnimations(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([RequestInterceptor])),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          // Activate PrimeNG dark theme tokens when the app is in dark mode.
          // We use the global [data-theme="dark"] attribute that the app toggles.
          darkModeSelector: '[data-theme="dark"]',
        },
      },

    }),
    { provide: LOCALE_ID, useValue: 'en-GH' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'GHS' }
  ]
}).catch((err) => console.error(err));

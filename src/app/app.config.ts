import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideGraphQL } from './provideApollo';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideGraphQL(),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }


  ],
  
};

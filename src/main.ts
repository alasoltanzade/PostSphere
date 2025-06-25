import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { appConfig } from './app/app.config';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from './auth.interceptor';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    HttpClientModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ...appConfig.providers,
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));

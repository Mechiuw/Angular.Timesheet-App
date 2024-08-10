import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService: SessionService = inject(SessionService);
  let newReq: HttpRequest<unknown>;
  if (
    req.url.includes('/api/v1/login') ||
    req.url.includes('/api/v1/accounts/activate') ||
    req.url.includes('/api/v1/accounts/forget-password') ||
    (req.url.includes('/api/v1/timesheets') && req.method == 'GET')
  ) {
    newReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${environment.BASIC_AUTH}`,
        'ngrok-skip-browser-warning': 'true',
      },
    });
  } else {
    newReq = sessionService.isAuthenticated()
      ? req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + sessionService.get('token'),
            'ngrok-skip-browser-warning': 'true',
          },
        })
      : req;
  }

  return next(newReq);
};

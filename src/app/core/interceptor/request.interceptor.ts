import { HttpInterceptorFn } from '@angular/common/http';
import { SessionService } from '../services/session.service';
import { inject } from '@angular/core';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService: SessionService = inject(SessionService)
  return next(
    sessionService.isAuthenticated()
      ? req.clone({
          headers: req.headers.set(
            'Authorization',
            'Bearer ' + sessionService.get('token')
          )
        },)
      : req
  )
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU2NDEyMjgsImlhdCI6MTcyMzA0OTIyOCwiaXNzIjoidGltZXNoZWV0LWFwcCIsImlkIjoiY2NmYzAyYjktZDA3MS00MmZmLWIwMTgtN2JiMWZmZjQ3Mjg3IiwidXNlcm5hbWUiOiJBa3VuIFVzZXIgNDUiLCJlbWFpbCI6ImVwYzQxODA1QHpjY2NrLmNvbSIsInJvbGUiOiJ1c2VyIn0.j0Pcwfv1WXtFsaYPtkjhDmjOhC1e8ZzNA54kJsZaJ3s';

  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
    // .set('ngrok-skip-browser-warning', 'true'),
  });

  return next(clonedRequest);
};

import { HttpInterceptorFn } from '@angular/common/http';

export const AUTH_TOKEN_INTERCEPTOR: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    request = request.clone({
      setHeaders: { Authorization: `Token ${token}` }
    });
  }
  return next(request);
}
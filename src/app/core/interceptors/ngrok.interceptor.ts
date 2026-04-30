import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  const ngrokReq = req.clone({
    setHeaders: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(ngrokReq);
};

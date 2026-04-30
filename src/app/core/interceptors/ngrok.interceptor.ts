import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  const token =
    localStorage.getItem('auth_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'Accept': 'application/json'
  };

  if (token) {
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    headers['Authorization'] = `Bearer ${cleanToken}`;
    headers['X-Access-Token'] = cleanToken;
  }

  return next(req.clone({
    setHeaders: headers
  }));
};

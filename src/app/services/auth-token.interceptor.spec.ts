import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { AUTH_TOKEN_INTERCEPTOR } from './auth-token.interceptor';

describe('AUTH_TOKEN_INTERCEPTOR', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => AUTH_TOKEN_INTERCEPTOR(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});

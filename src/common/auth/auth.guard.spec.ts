import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { createMock } from '@golevelup/ts-jest';

describe('AuthGuard', () => {
  const authGuard = new AuthGuard();

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it(`should return true if there's a valid API key`, () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => `SECRET`,
          // adding `headers` is necessary since on auth guard
          // devs can access the header using headers
          headers: {
            'x-api-key': `SECRET`,
          },
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBe(true);
  });

  it(`should return false if there's no header is passed in`, () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => undefined,
          headers: {
            'x-api-key': undefined,
          },
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBe(false);
  });

  it(`should return false if apiKey is invalid`, () => {
    const context = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => `SECERT`,
          headers: {
            'x-api-key': `SECERT`,
          },
        }),
      }),
    });
    const result = authGuard.canActivate(context);
    expect(result).toBe(false);
  });
});

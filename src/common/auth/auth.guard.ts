import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(`Guard: checking authentication`);

    const request = context.switchToHttp().getRequest<Request>();
    // const apiKey = request.header(`x-api-key`);
    const apiKey = request.headers[`x-api-key`];

    return apiKey === 'SECRET';
  }
}

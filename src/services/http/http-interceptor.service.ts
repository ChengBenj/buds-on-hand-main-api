import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { z } from 'zod';

@Injectable()
export default class HttpInterceptorService implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) =>
        throwError(() => {
          if (error instanceof z.ZodError) {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                message: 'Some data is not valid',
                issues: error.issues,
              },
              HttpStatus.BAD_REQUEST,
              {
                cause: error,
              },
            );
          }

          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: error.message,
            },
            HttpStatus.BAD_REQUEST,
            {
              cause: error,
            },
          );
        }),
      ),
    );
  }
}

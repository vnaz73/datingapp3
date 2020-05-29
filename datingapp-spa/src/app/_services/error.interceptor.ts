import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { join } from 'path';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 401) {
                        return throwError(error.statusText);
                    }

                    const applicationError = error.headers.get('Applicaion-Error');
                    if (applicationError) {
                        // console.error(applicationError);
                        return throwError(applicationError);
                    }
                    // console.log(error);
                    const serverError = error.error.errors;
                   // console.log(typeof serverError);
                    let modalStateError = '';
                    if (serverError && typeof serverError === 'object') {
                        for (const key in serverError) {
                            if (serverError[key]) {
                                // console.log(typeof serverError[key]);
                                modalStateError += serverError[key] + '\n';
                               //  modalStateError += (Array.isArray(serverError[key])) ?  serverError[key].join('\n') : serverError[key] + '\n';
                                // console.log(modalStateError);
                            }
                        }
                    }
                    return throwError(modalStateError || serverError || 'Server Error');
                }

            }

            )
        );
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};

import {HttpInterceptorFn, HttpErrorResponse, HttpResponse, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError, tap} from 'rxjs';
import {UserSession} from './user-session';
import {NotificationService} from './notification.service';

/**
 * HTTP Interceptor that adds merchantId to all outgoing requests and handles errors centrally
 */
export const RequestInterceptor: HttpInterceptorFn = (req:HttpRequest<any>, next) => {
  const notificationService = inject(NotificationService);

  let merchantId = localStorage.getItem(UserSession.MerchantId);
  let userId = localStorage.getItem(UserSession.UserID);

  let headers: any = {};

  if (merchantId) {
    headers.merchantId = merchantId;
  }

  if (userId) {
    headers.userId = userId;
  }

  // console.log(" http heaers",headers);
  const modifiedReq = req.clone({
    setHeaders: headers
  });

  return next(modifiedReq).pipe(
    tap(httpEvent => {
      // Check if the response is an HTTP response
      if (httpEvent instanceof HttpResponse) {
        // Log all successful HTTP responses
        // console.log(`[HTTP Response] ${req.method} ${req.url} - Status: ${httpEvent.status}`, httpEvent);

        // Log the request body
        // console.log(`[Request Body] ${req.method} ${req.url}`, req.body);
        // console.log(`[Request response] ${req.method} ${req.url}`, req.body);

        let response: any = httpEvent;

        if (httpEvent.body && (httpEvent.body as any).success) {

          // console.log("response --> ",response)
          if (response.status == 201) {
            notificationService.success("Data saved successfully");
          } else if (response.status == 200) {
            if (req.method === "PUT") {
              notificationService.success("Record updated successfully.")
            } else if (req.method === "DELETE") {
              notificationService.success("Data deleted successfully.");
            } else if (req.method === "POST") {
              if (response.body.message) {
                notificationService.success(response.body.message);
              }
            }
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      // Log error responses
      // console.log(`[HTTP Error Response] ${req.method} ${req.url} - Status: ${error.status}`, error);

      // Check if it's an HTTP error response
      if (error.error && error.error.message) {
        errorMessage = error.error.message;

        if(error.error.errors)
        {
          const validationErrors = error.error.errors;
          validationErrors.forEach(error => {
            notificationService.error(error.message, 'Validation Error');
          })
        }

      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show error notification
      notificationService.error(errorMessage, 'Error');

      // Re-throw the error so components can still handle it if needed
      return throwError(() => error);
    })
  );
};

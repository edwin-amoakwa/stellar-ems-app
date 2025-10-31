import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export class Exceptions
{
    public static handleError(errorResponse: HttpErrorResponse)
    {
      if (errorResponse.error instanceof ErrorEvent)
      {
        console.error('Client side error: ', errorResponse.error);
      }
      else
      {
        console.error('Server side error: ', errorResponse);
      }
      return throwError('There is a problem with the service.');
    }
}
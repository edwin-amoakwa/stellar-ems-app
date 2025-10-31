import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {ApiResponse} from '../ApiResponse';
import {environment} from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class DataLookupService {
  private http = inject(HttpClient);

  async getCountries() {

    return await firstValueFrom(this.http.get<ApiResponse<any>>(`${environment.baseUrl}/data/countries`));
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';
import {HttpUtils} from '../core/HttpUtils';

@Injectable({
  providedIn: 'root'
})
export class SmsRecordsService {
  private apiUrl = `${environment.baseUrl}/sms-messages`;

  constructor(private http: HttpClient) {}

  async getSmsRecords(param): Promise<ApiResponse<any[]>> {
    let params = HttpUtils.toUrlParam(param);
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?${params}`));
  }

}

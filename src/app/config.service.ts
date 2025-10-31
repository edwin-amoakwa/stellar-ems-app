import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponse } from './core/ApiResponse';



@Injectable({ providedIn: 'root' })
export class ConfigService {
  private http = inject(HttpClient);

  async createSenderId(payload: any): Promise<ApiResponse<any>> {
    if(payload.id)
    {
      return await firstValueFrom(this.http.put<ApiResponse<any>>(`${environment.baseUrl}/sms-sender-ids`, payload));
    }
    else
    {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(`${environment.baseUrl}/sms-sender-ids`, payload));
    }
  }

  async deleteSenderId(senderId: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${environment.baseUrl}/sms-sender-ids/${senderId}`));
  }

  async getSenderIds(): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${environment.baseUrl}/sms-sender-ids`));
  }
}

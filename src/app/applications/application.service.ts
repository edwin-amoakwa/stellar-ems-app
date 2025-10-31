import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/applications`;

  async getApplications(): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(this.apiUrl));
  }

  async saveApplication(application: any): Promise<ApiResponse<any>> {
    if(!application.id)
    {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, application));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}`, application));
  }


  async deleteApplication(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`));
  }

  async renewApiKey(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.apiUrl}/${id}/renew`, {}));
  }

  async disableApplication(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.apiUrl}/${id}/disable`, {}));
  }

  async enableApplication(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.apiUrl}/${id}/enable`, {}));
  }

}

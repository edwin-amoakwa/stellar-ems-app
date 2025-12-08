import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';
import { HttpUtils } from '../core/HttpUtils';

@Injectable({ providedIn: 'root' })
export class GuardianService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/guardians`;

  async getGuardians(filter: any): Promise<ApiResponse<any[]>> {
    const urlParams = HttpUtils.toUrlParam(filter || {});
    return await firstValueFrom(
      this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?${urlParams}`)
    );
  }

  async saveGuardian(payload: any): Promise<ApiResponse<any>> {
    if (!payload?.id) {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, payload));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}`, payload));
  }

  async deleteGuardian(id: string | number): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`));
  }

  async getStudentsForGuardian(guardianId: string | number): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(
      this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${guardianId}/students`)
    );
  }

  async addStudent(payload): Promise<ApiResponse<any>> {
    return await firstValueFrom(
      this.http.post<ApiResponse<any>>(`${this.apiUrl}/add-student`, payload)
    );
  }
}

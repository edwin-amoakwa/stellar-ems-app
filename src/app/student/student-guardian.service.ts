import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';
import { HttpUtils } from '../core/HttpUtils';

@Injectable({ providedIn: 'root' })
export class StudentGuardianService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/guardians`;

  async listByStudentId(studentId: number | string): Promise<ApiResponse<any[]>> {
    const params = HttpUtils.toUrlParam({ studentId });
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?${params}`));
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';
import { UserSession } from '../core/user-session';

@Injectable({ providedIn: 'root' })
export class AcademicTermClassesDataService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/data/academic-term-classes`;

  async list(): Promise<ApiResponse<any[]>> {
    try {
      // Add IDs if available; backend may ignore if not needed
      const schoolId = localStorage.getItem(UserSession.schoolId) || undefined;
      const academicTermId = UserSession.getAcademicTerm()?.id || undefined;

      let params = new HttpParams();
      if (schoolId) params = params.set('schoolId', schoolId);
      if (academicTermId) params = params.set('academicTermId', academicTermId);

      return await this.http
        .get<ApiResponse<any[]>>(this.apiUrl, { params })
        .toPromise();
    } catch (e: any) {
      console.error('Failed to load academic term classes', e);
      return ApiResponse.error('Failed to load academic term classes');
    }
  }
}

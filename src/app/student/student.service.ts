import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/students`;

  async getUsers(): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(this.apiUrl));
  }


  async saveStudent(user: any): Promise<ApiResponse<any>> {
    if(!user.id) {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, user));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}`, user));
  }

  async deleteStudent(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`));
  }


}

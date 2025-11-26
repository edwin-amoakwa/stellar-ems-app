import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';
import {HttpUtils} from "../core/HttpUtils";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/students`;

  async getStudent(filter): Promise<ApiResponse<any[]>> {
      const urlParams = HttpUtils.toUrlParam(filter);
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?${urlParams}`));
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


    async uploadStudent(dto: any): Promise<ApiResponse<any>>
    {
        return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.apiUrl}/upload/students`,dto));
    }

    async saveUpload(rows: any[]): Promise<ApiResponse<any>> {
        // Endpoint as requested: /save-upload under students base URL
        return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.apiUrl}/upload/save-upload`, rows));
    }

}

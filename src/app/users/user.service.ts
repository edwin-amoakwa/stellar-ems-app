import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/users`;

  async getUsers(): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(this.apiUrl));
  }

  async createUser(user: Partial<any>): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, user));
  }

  async updateUser(id: string, user: Partial<any>): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, user));
  }

  async saveUser(user: any): Promise<ApiResponse<any>> {
    if(!user.id) {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, user));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}`, user));
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`));
  }

  async updatePassword(payload:any): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.apiUrl}/update-password`, payload));
  }

  async updatePasswordWithCurrent(data): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${environment.baseUrl}/users/change-password`, data));
  }

  // Permissions APIs
  async getUserPermissions(userId: string): Promise<ApiResponse<any[]>> {
    const url = `${environment.baseUrl}/user-permissions`;
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(url, { params: { userId } }));
  }

  async saveUserPermissions(userId: string, permissions: any[]): Promise<ApiResponse<any>> {
    const url = `${environment.baseUrl}/user-permissions`;
    const payload = { userId, permissions };
    return await firstValueFrom(this.http.post<ApiResponse<any>>(url, payload));
  }
}

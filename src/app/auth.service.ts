import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import {ApiResponse} from './core/ApiResponse';

export interface LoginPayload {
  username: string;
  userPassword: string;
}

export interface RequestPasswordPayload {
  username: string;
}



@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);


  async login(payload: LoginPayload): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${environment.baseUrl}/auth/staff-login`, payload));
  }

  async logiByToken(sessionId): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.get<ApiResponse<any>>(`${environment.baseUrl}/auth/staff/${sessionId}/token`));
  }

  async requestPassword(payload: RequestPasswordPayload): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${environment.baseUrl}/auth/request-password`, payload));
  }

  async register(payload: any): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${environment.baseUrl}/auth/register`, payload));
  }
}

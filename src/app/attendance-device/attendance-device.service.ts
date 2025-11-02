import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {environment} from "../../environments/environment";
import {ApiResponse} from "../core/ApiResponse";


@Injectable({ providedIn: 'root' })
export class AttendanceDeviceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/attendance-devices`;

  async getAttendanceDevice(): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(this.apiUrl));
  }

  async saveNotificationSetting(setting: any): Promise<ApiResponse<any>> {
    if (!setting.id) {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, setting));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}`, setting));
  }


}

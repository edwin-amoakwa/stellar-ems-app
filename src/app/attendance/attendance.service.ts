import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {environment} from "../../environments/environment";
import {ApiResponse} from "../core/ApiResponse";
import {HttpUtils} from "../core/HttpUtils";


@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/attendances`;

  async getAttendances(param): Promise<ApiResponse<any[]>> {
      const urlParams = HttpUtils.toUrlParam(param);
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?${urlParams}`));
  }

    async getAttendeesList(attendanceId): Promise<ApiResponse<any[]>> {
        return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${attendanceId}/attendees`));
    }

  async saveNotificationSetting(setting: any): Promise<ApiResponse<any>> {
    if (!setting.id) {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, setting));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}`, setting));
  }


}

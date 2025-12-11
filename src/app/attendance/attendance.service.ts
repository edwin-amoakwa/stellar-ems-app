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


  async getDailyAttendance(param): Promise<ApiResponse<any[]>> {
    const urlParams = HttpUtils.toUrlParam(param);
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/daily/attendance?${urlParams}`));
  }

  async getAttendances(param): Promise<ApiResponse<any[]>> {
      const urlParams = HttpUtils.toUrlParam(param);
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?${urlParams}`));
  }

  async getAttendeesList(attendanceId): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${attendanceId}/attendees`));
  }

  // Update a single attendee for a given attendance
  async updateAttendee(attendanceId, payload): Promise<ApiResponse<any>> {
    const url = `${this.apiUrl}/${attendanceId}/attendees/update`;
    return await firstValueFrom(this.http.put<ApiResponse<any>>(url, payload));
  }

  // Send a notification for a single attendee
  async notifyAttendee(attendanceId: number | string, attendeeId: number | string): Promise<ApiResponse<any>> {
    const url = `${this.apiUrl}/${attendanceId}/attendees/${attendeeId}/notify`;
    return await firstValueFrom(this.http.post<ApiResponse<any>>(url, {}));
  }

  // Initialize a new attendance record
  async initAttendance(payload: any): Promise<ApiResponse<any>> {
    const url = `${this.apiUrl}/init`;
    return await firstValueFrom(this.http.post<ApiResponse<any>>(url, payload));
  }

  // Delete an attendance record
  async deleteAttendance(id: number | string): Promise<ApiResponse<any>> {
    const url = `${this.apiUrl}/${id}`;
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(url));
  }


  private config = `${environment.baseUrl}/attendance-config`;

  async getConfig(): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.get<ApiResponse<any>>(this.config));
  }

  async saveConfig(payload: any): Promise<ApiResponse<any>> {
    // Single resource configuration; use PUT to upsert/update
    return await firstValueFrom(this.http.put<ApiResponse<any>>(this.config, payload));
  }
}

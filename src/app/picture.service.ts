import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiResponse } from './core/ApiResponse';
import {environment} from "../environments/environment";

@Injectable({ providedIn: 'root' })
export class PictureService {
  private http = inject(HttpClient);




  async savePicture(data): Promise<ApiResponse<any>> {
    // Post captured/cropped base64 image to the required endpoint
    const url = `${environment.baseUrl}/pictures`;
      return await firstValueFrom(this.http.post<ApiResponse<any[]>>(url,data));
  }

  async getPictureByStudentId(studentId: string): Promise<ApiResponse<any>> {
    const url = `${environment.baseUrl}/pictures/${studentId}`;
    return await firstValueFrom(this.http.get<ApiResponse<any>>(url));
  }

  async sendToDevice(studentId: string): Promise<ApiResponse<any>> {
    const url = `${environment.baseUrl}/pictures/${studentId}/post-to-device`;
    return await firstValueFrom(this.http.post<ApiResponse<any>>(url,{}));
  }

    async classMembers(termClassId: string): Promise<ApiResponse<any>> {
        const url = `${environment.baseUrl}/pictures/class-members/${termClassId}`;
        return await firstValueFrom(this.http.get<ApiResponse<any>>(url,{}));
    }


}

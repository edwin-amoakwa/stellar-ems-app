import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiResponse } from '../core/ApiResponse';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class TermClassService {
  private http = inject(HttpClient);


    async getClassMembers(termClassId: string): Promise<ApiResponse<any[]>> {
    const url = `${environment.baseUrl}/class-members/${termClassId}/students`;

        return await firstValueFrom(this.http.get<ApiResponse<any[]>>(url));
  }

  async addStudentToClass(termClassId: string, studentId: string): Promise<ApiResponse<any>> {
    const url = `${environment.baseUrl}/class-members/${termClassId}/add-student/${studentId}`;
      return await firstValueFrom(this.http.post<ApiResponse<any[]>>(url,{}));
  }


    async removeStudentToClass(termClassId: string, studentId: string): Promise<ApiResponse<any>> {
        const url = `${environment.baseUrl}/class-members/${termClassId}/remove-student/${studentId}`;
        return await firstValueFrom(this.http.post<ApiResponse<any>>(url,{}));
    }
}

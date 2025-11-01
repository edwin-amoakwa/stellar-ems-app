import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/payments`;

  async getPayments(): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(this.apiUrl));
  }

  async savePayment(payment:any): Promise<ApiResponse<any>> {
    if(payment.id)
    {
      return await firstValueFrom(this.http.put<ApiResponse<any>>(this.apiUrl, payment));
    }
    return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, payment));
  }



  async deletePayment(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`));
  }
}

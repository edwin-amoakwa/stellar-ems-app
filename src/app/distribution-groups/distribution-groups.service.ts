import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class DistributionGroupsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/distribution-groups`;
  private contactsApiUrl = `${environment.baseUrl}/group-contacts`;

  async getDistributionGroups(): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(this.apiUrl));
  }




  async saveDistributionGroup(group: any): Promise<ApiResponse<any>> {
    if (!group.id) {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.apiUrl, group));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.apiUrl}`, group));
  }

  async mangeFreeFormNumbers(request: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.apiUrl}/manage-phone-nos`,request));
  }

  async deleteDistributionGroup(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`));
  }

  // Group Contacts CRUD methods
  async getGroupContacts(groupId: string): Promise<ApiResponse<any[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<any[]>>(`${this.contactsApiUrl}?groupId=${groupId}`));
  }

  async saveGroupContact(contact: any): Promise<ApiResponse<any>> {
    if (!contact.id) {
      return await firstValueFrom(this.http.post<ApiResponse<any>>(this.contactsApiUrl, contact));
    }
    return await firstValueFrom(this.http.put<ApiResponse<any>>(`${this.contactsApiUrl}`, contact));
  }

  async deleteGroupContact(id: string): Promise<ApiResponse<any>> {
    return await firstValueFrom(this.http.delete<ApiResponse<any>>(`${this.contactsApiUrl}/${id}`));
  }

  async uploadContacts(groupId: string,dto: any): Promise<ApiResponse<any>>
  {
    return await firstValueFrom(this.http.post<ApiResponse<any>>(`${this.contactsApiUrl}/${groupId}/upload-contacts`,dto));
  }
}

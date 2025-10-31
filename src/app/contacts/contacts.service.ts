import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';

export interface Contact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  groupId?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/contacts`;

  async getContacts(): Promise<ApiResponse<Contact[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<Contact[]>>(this.apiUrl));
  }

  async getContactsByGroup(groupId: string): Promise<ApiResponse<Contact[]>> {
    return await firstValueFrom(this.http.get<ApiResponse<Contact[]>>(`${this.apiUrl}?groupId=${groupId}`));
  }

  async createContact(contact: Partial<Contact>): Promise<ApiResponse<Contact>> {
    return await firstValueFrom(this.http.post<ApiResponse<Contact>>(this.apiUrl, contact));
  }

  async updateContact(id: string, contact: Partial<Contact>): Promise<ApiResponse<Contact>> {
    return await firstValueFrom(this.http.put<ApiResponse<Contact>>(`${this.apiUrl}/${id}`, contact));
  }

  async saveContact(contact: Contact): Promise<ApiResponse<Contact>> {
    if (!contact.id) {
      return await firstValueFrom(this.http.post<ApiResponse<Contact>>(this.apiUrl, contact));
    }
    return await firstValueFrom(this.http.put<ApiResponse<Contact>>(`${this.apiUrl}/${contact.id}`, contact));
  }

  async deleteContact(id: string): Promise<ApiResponse<Contact>> {
    return await firstValueFrom(this.http.delete<ApiResponse<Contact>>(`${this.apiUrl}/${id}`));
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/ApiResponse';

export interface StudentSearchFilters {
  referenceNo?: string;
  surname?: string;
  firstName?: string;
}

interface CacheEntry<T> {
  data: T;
  filters: StudentSearchFilters;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class StudentSearchDataService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/students`;
  private readonly cacheKey = 'studentSearchCache';
  private readonly cacheTtlMs = 10 * 60 * 1000; // 10 minutes

  // Always call API directly; update cache with latest results
  async search(filters: StudentSearchFilters): Promise<ApiResponse<any[]>> {
    try {
      let params = new HttpParams();
      if (filters.referenceNo) params = params.set('referenceNo', filters.referenceNo);
      if (filters.surname) params = params.set('surname', filters.surname);
      if (filters.firstName) params = params.set('firstName', filters.firstName);

      const obs = this.http.get<ApiResponse<any[]>>(this.apiUrl, { params });
      const resp = await firstValueFrom(obs);
      if (resp?.success) {
        this.setCache({ data: resp.data ?? [], filters });
      }
      return resp;
    } catch (e) {
      console.error('Failed to search students', e);
      return ApiResponse.error('Failed to load students');
    }
  }

  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }

  // Public getter to load cached data on component init without hitting API
  public getCached(): CacheEntry<any[]> | null {
    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry<any[]>;
      if (!entry || typeof entry.expiresAt !== 'number') return null;
      if (Date.now() > entry.expiresAt) {
        this.clearCache();
        return null;
      }
      return entry;
    } catch (e) {
      this.clearCache();
      return null;
    }
  }

  private setCache(entry: { data: any[]; filters: StudentSearchFilters }): void {
    const payload: CacheEntry<any[]> = {
      data: entry.data,
      filters: entry.filters,
      expiresAt: Date.now() + this.cacheTtlMs,
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(payload));
  }

  private sameFilters(a: StudentSearchFilters, b: StudentSearchFilters): boolean {
    const norm = (v?: string) => (v ?? '').trim().toLowerCase();
    return (
      norm(a.referenceNo) === norm(b.referenceNo) &&
      norm(a.surname) === norm(b.surname) &&
      norm(a.firstName) === norm(b.firstName)
    );
  }
}

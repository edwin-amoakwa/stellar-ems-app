import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/ApiResponse';
import { HttpUtils } from '../../core/HttpUtils';

interface CacheEntry<T> {
  data: T;
  filters: any;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class GuardianSearchDataService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/guardians`;
  private readonly cacheKey = 'guardianSearchCache';
  private readonly cacheTtlMs = 10 * 60 * 10000; // 100 minutes

  // Always call API directly; update cache with latest results
  async search(filters: any): Promise<ApiResponse<any[]>> {
    try {
      filters.general = true;
      const urlParams = HttpUtils.toUrlParam(filters);
      const obs = this.http.get<ApiResponse<any[]>>(`${this.apiUrl}?${urlParams}`);
      const resp = await firstValueFrom(obs);
      if (resp?.success) {
        this.setCache({ data: resp.data ?? [], filters });
      }
      return resp;
    } catch (e) {
      console.error('Failed to search guardians', e);
      return ApiResponse.error('Failed to load guardians');
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

  private setCache(entry: { data: any[]; filters: any }): void {
    const payload: CacheEntry<any[]> = {
      data: entry.data,
      filters: entry.filters,
      expiresAt: Date.now() + this.cacheTtlMs,
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(payload));
  }
}

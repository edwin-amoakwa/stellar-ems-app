import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../core/ApiResponse';
import { UserSession } from '../../core/user-session';

export interface TermClass {
  academicTermId: string;
  academicTermCode: string;
  schoolClassId: string;
  schoolClassName: string;
  classTeacherId: string;
  classTeacherName: string;
  termBillsFootnote: string;
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // epoch ms
}

@Injectable({ providedIn: 'root' })
export class TermClassService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/academic-term-classes`;
  private readonly cacheKey = 'termClassesData';
  private readonly cacheTtlMs = 10 * 60 * 1000; // 10 minutes

  async fetchTermClasses(schoolId: string, academicTermId: string): Promise<ApiResponse<TermClass[]>> {
    try {
      const params = new HttpParams().set('schoolId', schoolId).set('academicTermId', academicTermId);
      const obs = this.http.get<ApiResponse<TermClass[]>>(this.apiUrl, { params });
      const resp = await firstValueFrom(obs);
      return resp;
    } catch (error: any) {
      console.error('Error fetching academic term classes', error);
      return ApiResponse.error('Failed to fetch academic term classes');
    }
  }

  // Cache helpers
  getCached(): TermClass[] | null {
    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (!raw) return null;
      const entry = JSON.parse(raw) as CacheEntry<TermClass[]>;
      if (!entry || !Array.isArray(entry.data) || typeof entry.expiresAt !== 'number') return null;
      if (Date.now() > entry.expiresAt) {
        this.clearCache();
        return null;
      }
      return entry.data;
    } catch (e) {
      console.warn('Invalid cache for term classes, clearing.');
      this.clearCache();
      return null;
    }
  }

  setCache(data: TermClass[]): void {
    const entry: CacheEntry<TermClass[]> = { data, expiresAt: Date.now() + this.cacheTtlMs };
    localStorage.setItem(this.cacheKey, JSON.stringify(entry));
  }

  clearCache(): void {
    localStorage.removeItem(this.cacheKey);
  }

  // Helpers to get IDs from localStorage
  getSchoolId(): string | null {
    // Prefer dedicated key in UserSession
    return localStorage.getItem(UserSession.schoolId);
  }

  getAcademicTermId(): string | null {
    const academicTerm = UserSession.getAcademicTerm();
    // loginResponse.academicTerm?.id is expected shape
    return academicTerm?.id ?? null;
  }
}

// src/app/features/experience-detail/services/experience-media.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface ExperienceMedia {
  id: number;
  experienceId: number;
  mediaUrl: string;
  caption: string;
}

@Injectable({ providedIn: 'root' })
export class ExperienceMediaService {
  private baseUrl = `${environment.serverBasePath}/experience-media`;

  constructor(private http: HttpClient) {}

  getByExperienceId(experienceId: number): Observable<ExperienceMedia[]> {
    const headers = new HttpHeaders().set('experienceid', experienceId.toString());
    return this.http.get<ExperienceMedia[]>(`${this.baseUrl}`, { headers });
  }

  addMedia(experienceId: number, body: { mediaUrl: string; caption: string }): Observable<ExperienceMedia> {
    const headers = new HttpHeaders().set('experienceid', experienceId.toString());
    return this.http.post<ExperienceMedia>(`${this.baseUrl}`, body, { headers });
  }
}

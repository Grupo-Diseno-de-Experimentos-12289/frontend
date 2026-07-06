// src/app/features/experience-detail/services/experience.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';

export interface Experience {
  id: number;
  title: string;
  description: string;
  duration: string;
  meetingPoint: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private basePath = `${environment.serverBasePath}/experiences`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.basePath);
  }

  /**
   * ⚠️ Workaround temporal hasta que exista GET /experiences/{id}
   */
  getExperienceById(id: number): Observable<Experience> {
    return this.http.get<Experience[]>(this.basePath).pipe(
      map((experiences) => {
        const found = experiences.find(e => e.id === id);
        if (!found) {
          throw new Error(`Experience with id ${id} not found`);
        }
        return found;
      })
    );
  }
}

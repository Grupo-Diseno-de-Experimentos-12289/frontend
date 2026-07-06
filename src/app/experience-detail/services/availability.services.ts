// src/app/features/experience-detail/services/availability.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface Availability {
  id: number;
  experienceId: number;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private basePath = `${environment.serverBasePath}/availabilities`;

  constructor(private http: HttpClient) {}

  getByExperienceId(experienceId: number): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.basePath}/experience/${experienceId}`);
  }
}

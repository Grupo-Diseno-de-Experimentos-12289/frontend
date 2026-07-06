// src/app/features/experience-detail/services/review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

export interface Review {
  id: number;
  userId: number;
  experienceId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private basePath = `${environment.serverBasePath}/reviews`;

  constructor(private http: HttpClient) {}

  getByExperienceId(experienceId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.basePath}/by-experience/${experienceId}`);
  }
}

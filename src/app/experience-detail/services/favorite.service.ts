// src/app/features/experience-detail/services/favorite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';

export interface Favorite {
  favoriteId: number;
  userId: number;
  experienceId: number;
}

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private basePath = `${environment.serverBasePath}/favorites`;

  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.basePath}/by-user/${userId}`);
  }

  add(favorite: Omit<Favorite, 'favoriteId'>): Observable<Favorite> {
    return this.http.post<Favorite>(this.basePath, favorite);
  }

  remove(userId: number, experienceId: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/users/${userId}/experience/${experienceId}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface ItineraryActivity {
  experienceId: number;
  title: string;
  category: string;
  meetingPoint: string;
  duration: string;
}

export interface ItineraryDay {
  dayNumber: number;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  destinationId: number;
  numberOfDays: number;
  days: ItineraryDay[];
}

export interface Destination {
  id: number;
  name: string;
  address: string;
  district: string;
  city: string;
  state: string;
  country: string;
}

export interface GenerateItineraryRequest {
  destinationId: number;
  categories: string[];
  numberOfDays: number;
}

@Injectable({ providedIn: 'root' })
export class ItineraryService {
  private basePath = `${environment.serverBasePath}/itineraries`;

  constructor(private http: HttpClient) {}

  generate(request: GenerateItineraryRequest): Observable<Itinerary> {
    return this.http.post<Itinerary>(`${this.basePath}/generate`, request);
  }

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${environment.serverBasePath}/destinations`);
  }
}

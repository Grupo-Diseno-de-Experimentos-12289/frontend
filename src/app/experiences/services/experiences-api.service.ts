import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExperienceResource } from '../model/experience.resource';
import { CreateExperienceResource } from '../model/create.experience.resource';
import { UpdateExperienceResource } from '../model/update.experience.resource';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperiencesApiService {
  private readonly baseUrl = `${environment.serverBasePath}/experiences`;

  constructor(private http: HttpClient) { }

  createExperience(agencyId: number, experience: CreateExperienceResource): Observable<ExperienceResource> {
    return this.http.post<ExperienceResource>(`${this.baseUrl}/${agencyId}/experiences`, experience);
  }

  getAllExperiences(): Observable<ExperienceResource[]> {
    return this.http.get<ExperienceResource[]>(this.baseUrl);
  }

  updateExperience(experienceId: number, experience: UpdateExperienceResource): Observable<ExperienceResource> {
    return this.http.put<ExperienceResource>(`${this.baseUrl}/${experienceId}`, experience);
  }

  deleteExperience(experienceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${experienceId}`);
  }

  getExperienceById(experienceId: number): Observable<ExperienceResource> {
    return this.http.get<ExperienceResource>(`${this.baseUrl}/${experienceId}`);
  }
}

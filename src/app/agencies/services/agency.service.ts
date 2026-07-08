import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Agency } from '../model/agency.model';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private basePath = `${environment.serverBasePath}/agencies`;

  constructor(private http: HttpClient) {}

  getAgencyById(id: number): Observable<Agency> {
    return this.http.get<Agency>(`${this.basePath}/${id}`);
  }
}

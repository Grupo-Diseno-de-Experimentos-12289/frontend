import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface BookingQuote {
  availabilityId: number;
  ticketTypeId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  stockAvailable: boolean;
  cancellationPolicy: string;
}

@Injectable({ providedIn: 'root' })
export class BookingQuoteService {
  private basePath = `${environment.serverBasePath}/bookings/quote`;

  constructor(private http: HttpClient) {}

  getQuote(availabilityId: number, ticketTypeId: number, quantity: number): Observable<BookingQuote> {
    const params = new HttpParams()
      .set('availabilityId', availabilityId.toString())
      .set('ticketTypeId', ticketTypeId.toString())
      .set('quantity', quantity.toString());

    return this.http.get<BookingQuote>(this.basePath, { params });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { CartItem } from '../../cart/services/cart.service';
import { ExperienceService } from '../../experience-detail/services/experience.service';
import { toDisplayData } from '../../public/components/experience-card/experience-display.mock';

export interface Booking {
  id: string;
  experienceId: number;
  title: string;
  imageUrl: string;
  date: string;
  adults: number;
  pricePerPerson: number;
  rating: number;
  refundRequested: boolean;
}

export interface BookingResource {
  id: number;
  userId: number;
  availabilityId: number;
  quantity: number;
  currency: string;
  totalAmount: number;
  bookingStatus: string;
  bookingDate: string;
}

export interface AvailabilityResource {
  id: number;
  experienceId: number;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);
  private userId: number = Number(localStorage.getItem('userId')) || 1;
  private basePath = `${environment.serverBasePath}/bookings`;

  constructor(
    private http: HttpClient,
    private experienceService: ExperienceService
  ) {
    this.loadBookings();
  }

  get bookings$(): Observable<Booking[]> {
    return this.bookings.asObservable();
  }

  getAll(): Booking[] {
    return this.bookings.value;
  }

  loadBookings(): void {
    this.userId = Number(localStorage.getItem('userId')) || 1;
    this.http.get<BookingResource[]>(`${this.basePath}/user/${this.userId}`).pipe(
      switchMap(bookings => {
        if (!bookings || bookings.length === 0) {
          return of([]);
        }
        return forkJoin({
          availabilities: this.http.get<AvailabilityResource[]>(`${environment.serverBasePath}/availabilities`),
          experiences: this.experienceService.getAll()
        }).pipe(
          map(({ availabilities, experiences }) => {
            return bookings.map(b => {
              const avail = availabilities.find(a => a.id === b.availabilityId);
              const exp = avail ? experiences.find(e => e.id === avail.experienceId) : null;
              return {
                id: b.id.toString(),
                experienceId: avail ? avail.experienceId : 0,
                title: exp ? exp.title : 'Unknown Experience',
                imageUrl: exp ? toDisplayData(exp, exp.id).imageUrl : '',
                date: avail ? avail.startDateTime.substring(0, 10) : '',
                adults: b.quantity,
                pricePerPerson: b.quantity > 0 ? b.totalAmount / b.quantity : b.totalAmount,
                rating: exp ? toDisplayData(exp, exp.id).rating : 0,
                refundRequested: b.bookingStatus === 'CANCELLED'
              };
            });
          })
        );
      })
    ).subscribe({
      next: mappedBookings => this.bookings.next(mappedBookings),
      error: err => console.error('Failed to load bookings', err)
    });
  }

  confirm(item: CartItem): Observable<BookingResource> {
    this.userId = Number(localStorage.getItem('userId')) || 1;
    const body = {
      userId: this.userId,
      availabilityId: Number(item.id),
      ticketTypeId: 1, // default general ticket type
      quantity: item.adults,
      bookingDate: new Date().toISOString()
    };

    return this.http.post<BookingResource>(this.basePath, body).pipe(
      switchMap(booking => {
        return this.http.post<BookingResource>(`${this.basePath}/${booking.id}/confirm-payment`, {});
      }),
      tap(() => this.loadBookings())
    );
  }

  requestRefund(id: string): void {
    this.userId = Number(localStorage.getItem('userId')) || 1;
    const body = {
      userId: this.userId,
      reason: 'Refund requested'
    };

    this.http.post(`${this.basePath}/${id}/cancel`, body).subscribe({
      next: () => this.loadBookings(),
      error: err => console.error('Failed to request refund', err)
    });
  }
}

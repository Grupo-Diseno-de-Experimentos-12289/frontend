// Sin endpoint de reservas en el backend todavía: estado local persistido en localStorage,
// siguiendo el mismo patrón que AuthService/CartService.
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../cart/services/cart.service';

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

const STORAGE_KEY = 'bookings';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>(this.readFromStorage());

  get bookings$(): Observable<Booking[]> {
    return this.bookings.asObservable();
  }

  getAll(): Booking[] {
    return this.bookings.value;
  }

  confirm(item: CartItem): Booking {
    const booking: Booking = { ...item, refundRequested: false };
    const updated = [...this.bookings.value, booking];
    this.persist(updated);
    return booking;
  }

  requestRefund(id: string): void {
    const updated = this.bookings.value.map(b =>
      b.id === id ? { ...b, refundRequested: true } : b
    );
    this.persist(updated);
  }

  private persist(bookings: Booking[]): void {
    this.bookings.next(bookings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  private readFromStorage(): Booking[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
}

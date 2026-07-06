import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking, BookingService } from '../../services/booking.service';
import { TripItemCard } from '../../../cart/components/trip-item-card/trip-item-card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, TripItemCard, MatIcon],
  templateUrl: './bookings.html',
  styleUrl: './bookings.scss'
})
export class Bookings implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.bookings$.subscribe(bookings => (this.bookings = bookings));
  }

  requestRefund(id: string): void {
    this.bookingService.requestRefund(id);
  }
}

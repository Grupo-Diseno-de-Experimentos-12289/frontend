import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CartItem } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.scss'
})
export class CheckoutSummary {
  @Input({ required: true }) item!: CartItem;

  constructor(private router: Router) {}

  get formattedDate(): string {
    const label = new Date(`${this.item.date}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  get total(): number {
    return this.item.pricePerPerson * this.item.adults;
  }

  editTrip(): void {
    this.router.navigate(['/experience-detail', this.item.experienceId]).then();
  }
}

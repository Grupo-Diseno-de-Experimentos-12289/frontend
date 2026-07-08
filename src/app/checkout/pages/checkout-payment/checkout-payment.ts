import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CartItem, CartService } from '../../../cart/services/cart.service';
import { BookingService } from '../../../bookings/services/booking.service';
import { CheckoutSummary } from '../../components/checkout-summary/checkout-summary';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon, CheckoutSummary],
  templateUrl: './checkout-payment.html',
  styleUrl: './checkout-payment.scss'
})
export class CheckoutPayment implements OnInit {
  item: CartItem | null = null;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private bookingService: BookingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const cartItemId = this.route.snapshot.paramMap.get('cartItemId') || '';
    this.item = this.cartService.getById(cartItemId) ?? null;

    if (!this.item) {
      this.router.navigate(['/carts']).then();
      return;
    }

    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(12)]],
      expiry: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      cardHolder: ['', Validators.required]
    });
  }

  payNow(): void {
    if (this.form.invalid || !this.item) return;

    this.bookingService.confirm(this.item).subscribe({
      next: () => {
        this.cartService.remove(this.item!.id);
        this.router.navigate(['/checkout/success']).then();
      },
      error: (err) => console.error('Booking confirmation failed', err)
    });
  }
}

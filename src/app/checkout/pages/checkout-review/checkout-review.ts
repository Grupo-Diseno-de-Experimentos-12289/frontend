import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CartItem, CartService } from '../../../cart/services/cart.service';
import { AuthService } from '../../../iam/services/auth.service';
import { CheckoutSummary } from '../../components/checkout-summary/checkout-summary';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon, CheckoutSummary],
  templateUrl: './checkout-review.html',
  styleUrl: './checkout-review.scss'
})
export class CheckoutReview implements OnInit {
  item: CartItem | null = null;
  isEditing = false;

  fullName = '';
  email = '';
  phone = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const cartItemId = this.route.snapshot.paramMap.get('cartItemId') || '';
    this.item = this.cartService.getById(cartItemId) ?? null;

    if (!this.item) {
      this.router.navigate(['/carts']).then();
      return;
    }

    this.authService.currentUserMail.subscribe(email => {
      if (email) this.email = email;
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  proceedToPayment(): void {
    if (!this.item) return;
    this.router.navigate(['/checkout', this.item.id, 'payment']).then();
  }
}

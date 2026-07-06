import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss'
})
export class CheckoutSuccess {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']).then();
  }
}

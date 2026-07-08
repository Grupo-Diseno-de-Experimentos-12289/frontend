import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartItem, CartService } from '../../services/cart.service';
import { TripItemCard } from '../../components/trip-item-card/trip-item-card';
import { MatIcon } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

interface CartGroup {
  date: string;
  label: string;
  items: CartItem[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, TripItemCard, MatIcon, TranslateModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  items: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => (this.items = items));
  }

  get groupedByDate(): CartGroup[] {
    const groups = new Map<string, CartItem[]>();
    for (const item of this.items) {
      const existing = groups.get(item.date) ?? [];
      existing.push(item);
      groups.set(item.date, existing);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, groupItems]) => ({ date, label: this.formatGroupLabel(date), items: groupItems }));
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.pricePerPerson * item.adults, 0);
  }

  editItem(item: CartItem): void {
    this.router.navigate(['/experience-detail', item.experienceId]).then();
  }

  removeItem(id: string): void {
    this.cartService.remove(id);
  }

  continueToCheckout(): void {
    if (this.items.length === 0) return;
    this.router.navigate(['/checkout', this.items[0].id]).then();
  }

  private formatGroupLabel(date: string): string {
    const label = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}

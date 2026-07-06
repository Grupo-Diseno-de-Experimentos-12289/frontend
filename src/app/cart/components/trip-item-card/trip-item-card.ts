import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { StarRating } from '../../../public/components/star-rating/star-rating';

export interface TripItemData {
  imageUrl: string;
  title: string;
  date: string;
  adults: number;
  pricePerPerson: number;
  rating?: number;
}

@Component({
  selector: 'app-trip-item-card',
  standalone: true,
  imports: [CommonModule, MatIcon, StarRating],
  templateUrl: './trip-item-card.html',
  styleUrl: './trip-item-card.scss'
})
export class TripItemCard {
  @Input({ required: true }) data!: TripItemData;

  get price(): number {
    return this.data.pricePerPerson * this.data.adults;
  }

  get formattedDate(): string {
    const date = new Date(`${this.data.date}T00:00:00`);
    const label = date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
}

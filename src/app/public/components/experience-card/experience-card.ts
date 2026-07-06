import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { StarRating } from '../star-rating/star-rating';

export interface ExperienceCardData {
  id: number;
  title: string;
  imageUrl: string;
  badgeLabel?: string;
  durationLabel?: string;
  rating: number;
  priceFrom: number;
  currency?: string;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-experience-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MatIconButton, StarRating],
  templateUrl: './experience-card.html',
  styleUrl: './experience-card.scss'
})
export class ExperienceCard {
  @Input({ required: true }) data!: ExperienceCardData;
  @Output() favoriteToggle = new EventEmitter<ExperienceCardData>();

  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit(this.data);
  }
}

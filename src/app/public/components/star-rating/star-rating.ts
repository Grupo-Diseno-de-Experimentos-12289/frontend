import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.scss'
})
export class StarRating {
  @Input() rating = 0;
  @Input() showValue = true;

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  iconFor(star: number): string {
    if (this.rating >= star) return 'star';
    if (this.rating >= star - 0.5) return 'star_half';
    return 'star_border';
  }
}

// src/app/features/experience-detail/components/review-list/review-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  standalone: true,
  selector: 'app-review-list',
  imports: [CommonModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  @Input() experienceId!: number;
  reviews: Review[] = [];
  isLoading = true;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getByExperienceId(this.experienceId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

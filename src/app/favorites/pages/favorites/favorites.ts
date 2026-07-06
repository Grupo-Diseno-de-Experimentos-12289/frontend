import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of, switchMap } from 'rxjs';
import { FavoriteService } from '../../../experience-detail/services/favorite.service';
import { ExperienceService } from '../../../experience-detail/services/experience.service';
import { ExperienceCard, ExperienceCardData } from '../../../public/components/experience-card/experience-card';
import { toDisplayData } from '../../../public/components/experience-card/experience-display.mock';

const PAGE_SIZE = 3;

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ExperienceCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites implements OnInit {
  favorites: ExperienceCardData[] = [];
  isLoading = true;
  currentPage = 1;

  userId: number = JSON.parse(localStorage.getItem('user') || '{}').profileId || 1;

  constructor(
    private favoriteService: FavoriteService,
    private experienceService: ExperienceService
  ) {}

  ngOnInit(): void {
    this.favoriteService
      .getByUser(this.userId)
      .pipe(
        switchMap(favs => {
          if (favs.length === 0) return of([]);
          return forkJoin(favs.map(f => this.experienceService.getExperienceById(f.experienceId)));
        })
      )
      .subscribe({
        next: experiences => {
          this.favorites = experiences.map((exp, index) => ({
            ...toDisplayData(exp, exp.id + index),
            isFavorite: true
          }));
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.favorites.length / PAGE_SIZE));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedFavorites(): ExperienceCardData[] {
    const start = (this.currentPage - 1) * PAGE_SIZE;
    return this.favorites.slice(start, start + PAGE_SIZE);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  removeFavorite(card: ExperienceCardData): void {
    this.favoriteService.remove(this.userId, card.id).subscribe(() => {
      this.favorites = this.favorites.filter(f => f.id !== card.id);
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    });
  }
}

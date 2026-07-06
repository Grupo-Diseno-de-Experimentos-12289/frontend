import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceService } from '../../../experience-detail/services/experience.service';
import { FavoriteService } from '../../../experience-detail/services/favorite.service';
import { ExperienceCard, ExperienceCardData } from '../../components/experience-card/experience-card';
import {
  BEST_CULTURAL_PLACES,
  BestPlace,
  CATEGORY_TABS,
  CategoryTab,
  ExperienceDisplayData,
  toDisplayData
} from '../../components/experience-card/experience-display.mock';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ExperienceCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  categories: CategoryTab[] = CATEGORY_TABS;
  activeCategory: string = this.categories[0].key;

  allExperiences: ExperienceDisplayData[] = [];
  isLoading = true;

  bestPlaces: BestPlace[] = BEST_CULTURAL_PLACES;
  bestPlaceIndex = 0;

  userId: number = JSON.parse(localStorage.getItem('user') || '{}').profileId || 1;

  constructor(
    private experienceService: ExperienceService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.experienceService.getAll().subscribe({
      next: (experiences) => {
        this.allExperiences = experiences.map((exp, index) => toDisplayData(exp, index));
        this.isLoading = false;
        this.syncFavorites();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private syncFavorites(): void {
    this.favoriteService.getByUser(this.userId).subscribe({
      next: (favorites) => {
        const favoriteIds = new Set(favorites.map(f => f.experienceId));
        this.allExperiences = this.allExperiences.map(exp => ({
          ...exp,
          isFavorite: favoriteIds.has(exp.id)
        }));
      },
      error: () => {}
    });
  }

  get filteredExperiences(): ExperienceDisplayData[] {
    return this.allExperiences.filter(exp => exp.category === this.activeCategory);
  }

  selectCategory(key: string): void {
    this.activeCategory = key;
  }

  toggleFavorite(card: ExperienceCardData): void {
    const experience = this.allExperiences.find(e => e.id === card.id);
    if (!experience) return;

    if (experience.isFavorite) {
      this.favoriteService.remove(this.userId, experience.id).subscribe(() => {
        experience.isFavorite = false;
      });
    } else {
      this.favoriteService.add({ userId: this.userId, experienceId: experience.id }).subscribe(() => {
        experience.isFavorite = true;
      });
    }
  }

  previousPlace(): void {
    this.bestPlaceIndex = (this.bestPlaceIndex - 1 + this.bestPlaces.length) % this.bestPlaces.length;
  }

  nextPlace(): void {
    this.bestPlaceIndex = (this.bestPlaceIndex + 1) % this.bestPlaces.length;
  }

  get currentBestPlace(): BestPlace {
    return this.bestPlaces[this.bestPlaceIndex];
  }
}

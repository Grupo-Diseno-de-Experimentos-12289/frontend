import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceService } from '../../../experience-detail/services/experience.service';
import { FavoriteService } from '../../../experience-detail/services/favorite.service';
import { FormsModule } from '@angular/forms';
import { ExperienceCard, ExperienceCardData } from '../../components/experience-card/experience-card';
import {
  BEST_CULTURAL_PLACES,
  BestPlace,
  CATEGORY_TABS,
  CategoryTab,
  ExperienceDisplayData,
  toDisplayData
} from '../../components/experience-card/experience-display.mock';
import { FilterStateService } from '../../services/filter-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ExperienceCard, FormsModule],
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

  userId: number = Number(localStorage.getItem('userId')) || 1;

  filterCountry = '';
  filterProvince = '';
  filterCurrency = 'PEN';
  filterPriceRange = '';
  filterActivityType = '';
  filterDateFrom = '';
  filterDateTo = '';

  constructor(
    private experienceService: ExperienceService,
    private favoriteService: FavoriteService,
    private filterStateService: FilterStateService
  ) {}

  get showAdvancedFilters(): boolean {
    return this.filterStateService.showFilters;
  }

  set showAdvancedFilters(value: boolean) {
    this.filterStateService.setFilters(value);
  }

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
    return this.allExperiences.filter(exp => {
      if (exp.category !== this.activeCategory) return false;

      if (this.filterProvince) {
        const p = this.filterProvince.toLowerCase();
        const info = (exp.title + ' ' + exp.durationLabel).toLowerCase();
        if (p === 'lima' && !info.includes('lima') && !info.includes('plaza mayor') && !info.includes('plaza de armas')) return false;
        if (p === 'cusco' && !info.includes('cusco') && !info.includes('valley')) return false;
        if (p === 'puno' && !info.includes('puno') && !info.includes('uros')) return false;
      }

      if (this.filterPriceRange) {
        const price = this.filterCurrency === 'USD' ? exp.priceFrom / 3.7 : exp.priceFrom;
        if (this.filterPriceRange === '0-50' && price > 50) return false;
        if (this.filterPriceRange === '50-100' && (price < 50 || price > 100)) return false;
        if (this.filterPriceRange === '100-200' && (price < 100 || price > 200)) return false;
        if (this.filterPriceRange === '200+' && price < 200) return false;
      }

      if (this.filterActivityType && exp.category !== this.filterActivityType) return false;

      return true;
    });
  }

  clearFilters(): void {
    this.filterCountry = '';
    this.filterProvince = '';
    this.filterCurrency = 'PEN';
    this.filterPriceRange = '';
    this.filterActivityType = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
  }

  selectCategory(key: string): void {
    if (!key) return;
    this.activeCategory = key;
    this.filterActivityType = key;
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

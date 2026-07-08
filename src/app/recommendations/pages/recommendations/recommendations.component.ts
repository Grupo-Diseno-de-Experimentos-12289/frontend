import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExperienceService } from '../../../experience-detail/services/experience.service';
import { ItineraryService, Destination } from '../../../bookings/services/itinerary.service';
import { FavoriteService } from '../../../experience-detail/services/favorite.service';
import { ExperienceCard, ExperienceCardData } from '../../../public/components/experience-card/experience-card';
import { toDisplayData } from '../../../public/components/experience-card/experience-display.mock';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, ExperienceCard],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss'
})
export class RecommendationsComponent implements OnInit {
  userId: number = Number(localStorage.getItem('userId')) || 1;
  destinations: Destination[] = [];
  categories: string[] = ['Adventure', 'Nature', 'Gastronomy', 'Culture', 'Historical'];
  
  // Agenda Form state
  selectedDestinationId!: number;
  selectedCategories: { [key: string]: boolean } = {};
  windowStart = '';
  windowEnd = '';

  corporateProfileSet = false;
  isLoading = false;
  errorMessage = '';
  profileType = 'tourist';

  recommendations: any[] = [];
  displayRecs: ExperienceCardData[] = [];
  generalExperiences: ExperienceCardData[] = [];

  constructor(
    private experienceService: ExperienceService,
    private itineraryService: ItineraryService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.profileType = localStorage.getItem('profileType') || 'tourist';

    // 1. Fetch destinations, deduplicating by city+country
    this.itineraryService.getDestinations().subscribe({
      next: (dests) => {
        // Deduplicate by city+country so the dropdown shows clean options
        const seen = new Set<string>();
        this.destinations = dests.filter(dest => {
          const key = `${dest.city}-${dest.country}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if (this.destinations.length > 0) {
          this.selectedDestinationId = this.destinations[0].id;
        }
      },
      error: (err) => console.error('Failed to load destinations:', err)
    });

    // 2. Pre-populate time windows with reasonable corporate agenda defaults (e.g. today and tomorrow)
    const today = new Date();
    this.windowStart = new Date(today.setHours(9, 0, 0, 0)).toISOString().substring(0, 16);
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    this.windowEnd = new Date(tomorrow.setHours(18, 0, 0, 0)).toISOString().substring(0, 16);

    // 3. Load general experiences to display as suggestions initially
    this.loadGeneralRecommendations();
  }

  loadGeneralRecommendations(): void {
    this.isLoading = true;
    this.experienceService.getAll().subscribe({
      next: (exps) => {
        this.generalExperiences = exps.map((e, index) => toDisplayData(e, index));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load general experiences:', err);
        this.isLoading = false;
      }
    });
  }

  toggleCategory(cat: string): void {
    this.selectedCategories[cat] = !this.selectedCategories[cat];
  }

  applyCorporateAgenda(): void {
    if (!this.selectedDestinationId || !this.windowStart || !this.windowEnd) {
      this.errorMessage = 'Please complete all required fields (Destination and Time Window).';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const interests = Object.keys(this.selectedCategories).filter(k => this.selectedCategories[k]);

    // Backend expects LocalDateTime format: 2026-07-08T09:00:00 (no Z, no ms)
    const toLocalDT = (isoStr: string) => {
      const d = new Date(isoStr);
      return d.toISOString().replace('Z', '').split('.')[0];
    };
    const startISO = toLocalDT(this.windowStart);
    const endISO = toLocalDT(this.windowEnd);

    this.experienceService.getCorporateRecommendations(
      this.selectedDestinationId,
      interests,
      startISO,
      endISO
    ).subscribe({
      next: (recs) => {
        this.recommendations = recs;
        // Transform the backend CorporateRecommendationResource to display formats
        this.displayRecs = recs.map((r, index) => {
          const display = toDisplayData({
            id: r.experienceId,
            title: r.title,
            description: `Matching category: ${r.category}. Meeting point: ${r.meetingPoint}`,
            duration: r.duration,
            meetingPoint: r.meetingPoint,
            agencyId: 1
          }, index);
          
          // Inject matching slot count
          if (r.matchingAvailabilities && r.matchingAvailabilities.length > 0) {
            display.durationLabel = `${display.durationLabel} • ${r.matchingAvailabilities.length} matching slot(s)`;
          }
          return display;
        });

        this.corporateProfileSet = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load corporate recommendations:', err);
        this.errorMessage = 'Could not fetch personalized recommendations. Showing all experiences instead.';
        this.isLoading = false;
      }
    });
  }

  resetAgenda(): void {
    this.corporateProfileSet = false;
    this.recommendations = [];
    this.displayRecs = [];
  }

  onFavoriteToggle(card: ExperienceCardData): void {
    if (card.isFavorite) {
      this.favoriteService.remove(this.userId, card.id).subscribe(() => {
        card.isFavorite = false;
      });
    } else {
      this.favoriteService.add({ userId: this.userId, experienceId: card.id }).subscribe(() => {
        card.isFavorite = true;
      });
    }
  }
}

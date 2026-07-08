import { Component, OnInit } from '@angular/core';
import { ExperienceService, Experience } from '../../services/experience.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AvailabilityCheckerComponent } from '../../components/availability-checker/availability-checker.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewListComponent } from '../../components/review-list/review-list.component';
import { FavoriteService } from '../../services/favorite.service';
import { AvailabilityService, Availability } from '../../services/availability.services';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { ExperienceCard, ExperienceCardData } from '../../../public/components/experience-card/experience-card';
import { StarRating } from '../../../public/components/star-rating/star-rating';
import {
  ExperienceDisplayData,
  toDisplayData
} from '../../../public/components/experience-card/experience-display.mock';
import { CartService } from '../../../cart/services/cart.service';
import { AgencyService } from '../../../agencies/services/agency.service';
import { Agency } from '../../../agencies/model/agency.model';
import { BookingQuoteService, BookingQuote } from '../../../bookings/services/booking-quote.service';

interface InfoItem {
  title: string;
  description: string;
  icon: string;
}


@Component({
  selector: 'app-experience-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvailabilityCheckerComponent,
    ReviewListComponent,
    MatIcon,
    MatIconButton,
    ExperienceCard,
    StarRating
  ],
  templateUrl: './experience-detail.html',
  styleUrls: ['./experience-detail.scss']
})
export class ExperienceDetailComponent implements OnInit {
  experienceId!: number;
  experience!: Experience;
  display!: ExperienceDisplayData;
  isLoading = true;
  agency: Agency | null = null;

  isFavorite = false;
  userId: number = Number(localStorage.getItem('userId')) || 1;

  adults = 1;
  selectedDate = '';
  showBookingCard = false;
  showAllSlots = false;
  addedMessage = '';

  quote: BookingQuote | null = null;
  quoteLoading = false;
  quoteError = '';

  suggestions: ExperienceCardData[] = [];

  private nextAvailability: Availability | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private experienceService: ExperienceService,
    private favoriteService: FavoriteService,
    private availabilityService: AvailabilityService,
    private cartService: CartService,
    private agencyService: AgencyService,
    private bookingQuoteService: BookingQuoteService
  ) {}

  ngOnInit(): void {
    this.experienceId = Number(this.route.snapshot.paramMap.get('id'));

    this.experienceService.getExperienceById(this.experienceId).subscribe({
      next: (data) => {
        this.experience = data;
        this.display = toDisplayData(data, data.id);
        this.isLoading = false;

        if (data.agencyId) {
          this.agencyService.getAgencyById(data.agencyId).subscribe({
            next: (agencyData) => this.agency = agencyData,
            error: (err) => console.error('Failed to load agency details', err)
          });
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.favoriteService.getByUser(this.userId).subscribe(favs => {
      this.isFavorite = favs.some(f => f.experienceId === this.experienceId);
    });

    this.availabilityService.getByExperienceId(this.experienceId).subscribe({
      next: (slots) => {
        this.nextAvailability = slots[0] ?? null;
        this.selectedDate = this.nextAvailability
          ? this.nextAvailability.startDateTime.substring(0, 10)
          : new Date().toISOString().substring(0, 10);
      },
      error: () => {
        this.selectedDate = new Date().toISOString().substring(0, 10);
      }
    });

    this.loadSuggestions();
  }

  get infoItems(): InfoItem[] {
    return [
      { title: 'Free cancellation', description: 'Cancel up to 48 hours in advance and get a full refund.', icon: 'free_cancellation' },
      { title: 'Book now, pay later', description: 'Plan your trip worry-free: secure your spot and pay later.', icon: 'calendar_month' },
      { title: `Duration ${this.experience?.duration || ''}`, description: 'Check availability for schedules and meeting points.', icon: 'schedule' },
      { title: 'Priority access to main events', description: 'Skip the lines and access preferential areas.', icon: 'offline_bolt' },
      { title: 'Bilingual guide', description: 'Available in Spanish and English.', icon: 'translate' },
      { title: 'Hotel pickup included', description: 'Pickup from hotels located downtown.', icon: 'directions_bus' },
      { title: 'Accessibility', description: 'This activity is partially accessible for people with reduced mobility.', icon: 'accessible' }
    ];
  }


  get selectedDateLabel(): string {
    if (!this.selectedDate) return '';
    const date = new Date(`${this.selectedDate}T00:00:00`);
    const time = this.nextAvailability
      ? new Date(this.nextAvailability.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '10:00';
    return `${date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} at ${time}`;
  }

  get totalPrice(): number {
    if (this.quote) {
      return this.quote.totalPrice;
    }
    return this.display.priceFrom * this.adults;
  }

  get unitPrice(): number {
    if (this.quote) {
      return this.quote.unitPrice;
    }
    return this.display.priceFrom;
  }

  get quoteCurrency(): string {
    return this.quote?.currency || 'PEN';
  }

  get stockAvailable(): boolean {
    return this.quote?.stockAvailable ?? true;
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.favoriteService.remove(this.userId, this.experienceId).subscribe(() => {
        this.isFavorite = false;
      });
    } else {
      this.favoriteService.add({ userId: this.userId, experienceId: this.experienceId }).subscribe(() => {
        this.isFavorite = true;
      });
    }
  }

  toggleBookingCard(): void {
    this.showBookingCard = !this.showBookingCard;
    if (this.showBookingCard && this.nextAvailability) {
      this.fetchQuote();
    }
    if (this.showBookingCard) {
      setTimeout(() => {
        const el = document.querySelector('.booking-selector');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  fetchQuote(): void {
    if (!this.nextAvailability) return;
    this.quoteLoading = true;
    this.quoteError = '';
    this.bookingQuoteService.getQuote(
      this.nextAvailability.id,
      1,
      this.adults
    ).subscribe({
      next: (q) => {
        this.quote = q;
        this.quoteLoading = false;
      },
      error: () => {
        this.quoteError = 'Could not fetch quote. Using estimated pricing.';
        this.quoteLoading = false;
      }
    });
  }

  private buildCartItem() {
    return {
      experienceId: this.experienceId,
      title: this.experience.title,
      imageUrl: this.display.imageUrl,
      date: this.selectedDate,
      adults: this.adults,
      pricePerPerson: this.display.priceFrom,
      rating: this.display.rating
    };
  }

  addToCart(): void {
    this.cartService.add({ ...this.buildCartItem(), availabilityId: this.nextAvailability?.id }).subscribe(() => {
      this.addedMessage = 'Added to cart';
      setTimeout(() => (this.addedMessage = ''), 2500);
    });
  }

  reserveNow(): void {
    this.cartService.add({ ...this.buildCartItem(), availabilityId: this.nextAvailability?.id }).subscribe((item) => {
      this.router.navigate(['/checkout', item.id]).then();
    });
  }

  onSuggestionFavoriteToggle(card: ExperienceCardData): void {
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

  private loadSuggestions(): void {
    this.experienceService.getAll().subscribe({
      next: (experiences) => {
        this.suggestions = experiences
          .filter(e => e.id !== this.experienceId)
          .slice(0, 3)
          .map((e, index) => toDisplayData(e, index));
      },
      error: () => {}
    });
  }
}

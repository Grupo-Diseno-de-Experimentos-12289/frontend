import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ItineraryService, Itinerary, Destination } from '../bookings/services/itinerary.service';
import { ExperienceService } from '../experience-detail/services/experience.service';
import { forkJoin } from 'rxjs';

interface CategoryOption {
  value: string;
  label: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './itinerary.html',
  styleUrls: ['./itinerary.scss']
}
)
export class ItineraryComponent implements OnInit {
  destinations: Destination[] = [];
  selectedDestinationId: number | null = null;
  numberOfDays = 3;
  loading = false;
  error = '';
  itinerary: Itinerary | null = null;

  categories: CategoryOption[] = [
    { value: 'CULTURA', label: 'Culture & History', icon: 'museum', selected: false },
    { value: 'GASTRONOMIA', label: 'Gastronomy & Food', icon: 'restaurant', selected: false },
    { value: 'NATURALEZA', label: 'Nature & Wildlife', icon: 'forest', selected: false },
    { value: 'DEPORTE', label: 'Sports & Adventure', icon: 'hiking', selected: false }
  ];

  constructor(
    private itineraryService: ItineraryService,
    private experienceService: ExperienceService
  ) {}

  ngOnInit(): void {
    forkJoin({
      destinations: this.itineraryService.getDestinations(),
      experiences: this.experienceService.getAll()
    }).subscribe({
      next: ({ destinations, experiences }) => {
        const activeIds = new Set<number>(
          experiences.map((exp: any) => exp.destinationId).filter(id => id != null)
        );
        const filtered = destinations.filter(dest => activeIds.has(dest.id));
        const seen = new Set<string>();
        
        this.destinations = filtered.filter(dest => {
          const label = this.getDestinationLabel(dest);
          if (seen.has(label)) {
            return false;
          }
          seen.add(label);
          return true;
        });

        if (this.destinations.length > 0) {
          this.selectedDestinationId = this.destinations[0].id;
        }
      },
      error: () => {
        this.error = 'Failed to load destinations. Please try again.';
      }
    });
  }

  toggleCategory(category: CategoryOption): void {
    category.selected = !category.selected;
  }

  getDestinationLabel(dest: Destination): string {
    if (dest.name.startsWith('Dest_') || dest.name.startsWith('Destination_') || dest.name.startsWith('Destino ')) {
      return `${dest.city}, ${dest.country}`;
    }
    return `${dest.name} (${dest.city}, ${dest.country})`;
  }

  generateItinerary(): void {
    if (!this.selectedDestinationId) {
      this.error = 'Please select a destination.';
      return;
    }

    const selectedCats = this.categories
      .filter(c => c.selected)
      .map(c => c.value);

    if (selectedCats.length === 0) {
      this.error = 'Please select at least one category.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.itinerary = null;

    const request = {
      destinationId: Number(this.selectedDestinationId),
      categories: selectedCats,
      numberOfDays: this.numberOfDays
    };

    this.itineraryService.generate(request).subscribe({
      next: (result) => {
        this.itinerary = result;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 400) {
          this.error = 'No experiences found matching the selected destination and categories. Please try other options.';
        } else {
          this.error = 'Failed to generate itinerary. Please try again.';
        }
        this.loading = false;
      }
    });
  }
}

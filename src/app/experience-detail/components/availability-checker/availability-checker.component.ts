import {Component, Input, OnInit} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {Availability, AvailabilityService} from '../../services/availability.services';

@Component({
  selector: 'app-availability-checker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './availability-checker.component.html',
  styleUrl: './availability-checker.component.scss'
})
export class AvailabilityCheckerComponent implements OnInit {
  @Input() experienceId!: number;
  availabilities: Availability[] = [];
  isLoading = true;

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.availabilityService.getByExperienceId(this.experienceId).subscribe({
      next: (data) => {
        this.availabilities = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString();
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../iam/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  userId = 0;
  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  profileType = 'tourist';
  avatarUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
  showSuccessBanner = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.authService.currentUserId.subscribe(id => {
      if (id) {
        this.userId = id;
        this.loadProfile();
      }
    });
  }

  loadProfile(): void {
    this.http.get<any>(`${environment.serverBasePath}/users/${this.userId}`).subscribe({
      next: (user) => {
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.phone = user.phone || '';
        this.email = user.email || '';
        this.profileType = localStorage.getItem('profileType') || 'tourist';
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.profileType = localStorage.getItem('profileType') || 'tourist';
      }
    });
  }

  changePhoto(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    localStorage.setItem('profileType', this.profileType);
    localStorage.setItem('passengerName', `${this.firstName} ${this.lastName}`.trim());
    localStorage.setItem('passengerEmail', this.email);
    localStorage.setItem('passengerPhone', this.phone);

    this.showSuccessBanner = true;
    setTimeout(() => (this.showSuccessBanner = false), 3000);
  }
}

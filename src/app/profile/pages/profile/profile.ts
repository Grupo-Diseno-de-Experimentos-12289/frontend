import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
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
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
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
    const body = {
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone
    };

    this.http.put<any>(`${environment.serverBasePath}/users/${this.userId}`, body).subscribe({
      next: (updatedUser) => {
        this.firstName = updatedUser.firstName || '';
        this.lastName = updatedUser.lastName || '';
        this.phone = updatedUser.phone || '';
        this.email = updatedUser.email || '';
        
        this.showSuccessBanner = true;
        setTimeout(() => (this.showSuccessBanner = false), 3000);
      },
      error: (err) => {
        console.error('Error saving user profile:', err);
      }
    });
  }
}

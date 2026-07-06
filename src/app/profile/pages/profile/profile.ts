import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../iam/services/auth.service';

// No hay endpoint de perfil en el backend todavía: el formulario opera con estado local
// prellenado desde AuthService, sin persistir a un servidor.
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  avatarUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

  showSuccessBanner = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUserMail.subscribe(email => {
      if (email) this.email = email;
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
    this.showSuccessBanner = true;
    setTimeout(() => (this.showSuccessBanner = false), 3000);
  }
}

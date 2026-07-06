import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SignUpRequest} from '../../model/sign-up.request';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp implements OnInit {
  form!: FormGroup;
  roles: string[] = ['ROLE_TOURIST', 'ROLE_ADMIN', 'ROLE_AGENCY_STAFF'];
  submitted = false;

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private authenticationService: AuthService) {
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      role: [this.roles[0], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password, firstName, lastName, phone } = this.form.value;
    const roles = [this.form.value.role];
    const signUpRequest = new SignUpRequest(email, password, firstName, lastName, phone, roles);
    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }

  navigateToLogin(): void {
    this.router.navigate(['/sign-in']).then();
  }

  get emailControl() { return this.form.controls['email']; }
  get passwordControl() { return this.form.controls['password']; }
  get firstNameControl() { return this.form.controls['firstName']; }
  get lastNameControl() { return this.form.controls['lastName']; }
  get phoneControl() { return this.form.controls['phone']; }
  get roleControl() { return this.form.controls['role']; }
}

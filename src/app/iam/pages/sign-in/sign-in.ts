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
import {SignInRequest} from '../../model/sign-in.request';

@Component({
  selector: 'app-sign-in',
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
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss'
})
export class SignIn implements OnInit {
  form!: FormGroup;
  submitted = false;
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private authenticationService: AuthService) {
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    const signInRequest = new SignInRequest(email, password);
    this.authenticationService.signIn(signInRequest);
    this.submitted = true;
  }

  navigateToRegister(): void {
    this.router.navigate(['/sign-up']).then();
  }

  get emailControl() { return this.form.controls['email']; }
  get passwordControl() { return this.form.controls['password']; }
}

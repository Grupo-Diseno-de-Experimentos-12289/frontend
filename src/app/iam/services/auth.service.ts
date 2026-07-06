import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import { SignUpRequest } from '../model/sign-up.request';
import { SignUpResponse } from '../model/sign-up.response';
import { SignInRequest } from '../model/sign-in.request';
import { SignInResponse } from '../model/sign-in.response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  basePath: string = `${environment.serverBasePath}`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInEmail: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private signedInRoles: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if(token) {
      this.signedIn.next(true);

      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const roles = localStorage.getItem('roles');
      if (userId) this.signedInUserId.next(+userId);
      if (email) this.signedInEmail.next(email);
      if (roles) this.signedInRoles.next(JSON.parse(roles));
    }
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  get currentUserMail() {
    return this.signedInEmail.asObservable();
  }

  get userRoles() {
    return this.signedInRoles.asObservable();
  }

  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  isRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  /**
   * Sign up a new user
   * @summary
   * The method sends a POST request to the server with the sign-up request.
   * It subscribes to the response and error and logs the response or error.
   * @param signUpRequest - The {@link SignUpRequest} object
   */
  signUp(signUpRequest: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.basePath}/authentication/sign-up`, signUpRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed Up as ${response.email} with ID: ${response.id}`);
          this.router.navigate(['/sign-in']).then();
        },
        error: (error) => {
          console.error(`Error signing up: ${error.error.message || error.message}`);
          throw new Error(error.error.message || 'Sign-up failed');
        },
      });
  }

  /**
   * Sign in a user
   * @summary
   * The method sends a POST request to the server with the sign-in request.
   * It subscribes to the response and error and logs the response or error.
   * @param signInRequest - The {@link SignInRequest} object
   */
  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log(`Signed In as ${response.email} with ID: ${response.id}`);
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          this.signedInEmail.next(response.email);
          this.signedInRoles.next(response.roles);
          localStorage.setItem('email', response.email);
          localStorage.setItem('token', response.token);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          console.log(`Signed in as ${response.email} with token ${response.token} and roles ${response.roles}`);
          if (response.roles.includes('ROLE_TOURIST')) {
            this.router.navigate(['/home']).then();
          } else if (response.roles.includes('ROLE_AGENCY_STAFF')) {
            this.router.navigate(['/agency/home']).then();
          } else {
            this.router.navigate(['/']).then();
          }
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          this.signedInEmail.next('');
          console.error(`Error while signing in: ${error.error.message || error.message}`);
          this.router.navigate(['/sign-in']).then();
        }
      });
  }

  private clearStorage() {
    ['token', 'userId', 'email'].forEach(key => localStorage.removeItem(key));
  }

  /**
   * Sign Out
   * @summary
   * This method signs out the user by clearing the local storage and redirecting to the sign-in page.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInEmail.next('');
    this.clearStorage();
    this.router.navigate(['/sign-in']).then();
  }
}

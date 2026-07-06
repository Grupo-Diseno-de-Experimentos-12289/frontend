import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {AuthService} from '../../../iam/services/auth.service';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
    NgOptimizedImage,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss'
})
export class PageNotFound implements OnInit {
  hovering: boolean = false;
  protected invalidUrl: string;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  constructor() {
    this.invalidUrl = '';
  }

  ngOnInit(): void {
    this.invalidUrl = this.route.snapshot.url.map(element => element.path).join('/');
  }

  goHome() {
    const userRoles = this.authService.getRoles();

    if (userRoles.includes('ROLE_TOURIST')) {
      this.router.navigate(['/home']).then();
    } else if (userRoles.includes('ROLE_AGENCY_STAFF')) {
      this.router.navigate(['/agency/home']).then();
    } else {
      this.router.navigate(['/sign-in']).then();
    }
  }
}

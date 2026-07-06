import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {HeaderContent} from "../../public/components/header-content/header-content";
import {Footer} from "../../public/components/footer/footer";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list"; // Importa MatListModule
import {MatDividerModule} from "@angular/material/divider"; // Importa MatDividerModule
import {CommonModule, NgOptimizedImage} from '@angular/common'; // Para ngSrc
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "../../iam/services/auth.service"; // Si usas ngx-translate

@Component({
  selector: 'app-tourist-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenavContent,
    HeaderContent,
    Footer,
    MatSidenav,
    MatIconButton,
    MatIcon,
    MatListModule,
    MatDividerModule,
    CommonModule,
    NgOptimizedImage,
    TranslateModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './tourist-layout.html',
  styleUrl: './tourist-layout.scss'
})
export class TouristLayout implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  isSignedIn: boolean = false;
  currentEmail: string = '';

  constructor(
      private bo: BreakpointObserver,
      private authenticationService: AuthService,
      private router: Router
  ) {}

  ngOnInit() {
    this.bo.observe([Breakpoints.Handset])
        .subscribe(r => (this.isMobile = r.matches));

    this.authenticationService.isSignedIn.subscribe(flag => this.isSignedIn = flag);
    this.authenticationService.currentUserMail.subscribe(email => this.currentEmail = email);
  }

  close() {
    if (this.sidenav) {
      this.sidenav.close().then();
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']).then();
  }

  onSignOut() {
    this.authenticationService.signOut();
  }
}

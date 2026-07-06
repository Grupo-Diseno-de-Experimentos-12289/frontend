import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {Router, RouterModule} from '@angular/router';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {AuthService} from '../../../iam/services/auth.service';

@Component({
  selector: 'app-header-content',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    RouterModule,
    LanguageSwitcher,
    TranslateModule,
    NgOptimizedImage
  ],
  templateUrl: './header-content.html',
  styleUrl: './header-content.scss'
})
export class HeaderContent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  @ViewChild('searchSidenav') searchSidenav!: MatSidenav;

  isMobile = false;
  isSignedIn: boolean = false;
  currentEmail: string = '';
  searchForm: FormGroup;
  filteredOptions: string[] = [];
  allOptions: string[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authenticationService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      date: [null]
    });

    this.filteredOptions = this.allOptions;
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
    this.authenticationService.isSignedIn.subscribe(flag => this.isSignedIn = flag);
    this.authenticationService.currentUserMail.subscribe(email => this.currentEmail = email);
    // Simular opciones (reemplazar con llamadas reales)
    this.allOptions = ['Cusco', 'Arequipa', 'Paracas', 'Montaña de 7 colores', 'Sandboarding'];

    this.searchForm.get('query')!.valueChanges.subscribe(value => {
      this.filteredOptions = this._filter(value || '');
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']).then();
  }

  onSignOut() {
    this.authenticationService.signOut();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allOptions.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSearch() {
    const query = this.searchForm.value.query;
    const date = this.searchForm.value.date;

    const params: any = {};
    if (query) params.query = query;
    if (date) params.date = date.toISOString().split('T')[0];

    if (this.isMobile && this.searchSidenav && this.searchSidenav.opened) {
      this.searchSidenav.close().then();
    }

    this.router.navigate(['/experiences'], { queryParams: params }).then();
  }

  openSearchSidenav() {
    if (this.isMobile && this.searchSidenav) {
      this.searchSidenav.open().then();
    }
  }

  closeSearchSidenav() {
    if (this.searchSidenav) {
      this.searchSidenav.close().then();
    }
  }
}

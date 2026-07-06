import { Routes } from '@angular/router';
import { authGuard } from './iam/guards/auth.guard';
import { preventAuthGuard } from './iam/guards/prevent-auth.guard';
import {agencyAuthGuard} from './iam/guards/agency-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/tourist-layout/tourist-layout').then(m => m.TouristLayout),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./public/pages/home/home').then(m => m.Home)
      },
      {
        path: 'experience-detail/:id',
        loadComponent: () =>
          import('../app/experience-detail/pages/experience-detail/experience-detail.component')
            .then(m => m.ExperienceDetailComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/pages/favorites/favorites').then(m => m.Favorites)
      },
      {
        path: 'carts',
        loadComponent: () => import('./cart/pages/cart/cart').then(m => m.Cart)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./bookings/pages/bookings/bookings').then(m => m.Bookings)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/pages/profile/profile').then(m => m.Profile)
      },
      {
        path: 'checkout/success',
        loadComponent: () =>
          import('./checkout/pages/checkout-success/checkout-success').then(m => m.CheckoutSuccess)
      },
      {
        path: 'checkout/:cartItemId',
        loadComponent: () =>
          import('./checkout/pages/checkout-review/checkout-review').then(m => m.CheckoutReview)
      },
      {
        path: 'checkout/:cartItemId/payment',
        loadComponent: () =>
          import('./checkout/pages/checkout-payment/checkout-payment').then(m => m.CheckoutPayment)
      }
    ]
  },
  {
    path: 'agency',
    canActivate: [agencyAuthGuard],
    loadComponent: () =>
      import('./layouts/agency-layout/agency-layout').then(m => m.AgencyLayout),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./public/pages/home-agency/home-agency').then(m => m.HomeAgency)
      }
    ]
  },
  {
    path: '',
    canActivate: [preventAuthGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./iam/pages/sign-up/sign-up').then(m => m.SignUp)
      },
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./iam/pages/sign-in/sign-in').then(m => m.SignIn)
      }
    ]
  },
  {
    path: '**',
    loadComponent: ()=>
      import('./public/pages/page-not-found/page-not-found').then(m => m.PageNotFound),
  }
];

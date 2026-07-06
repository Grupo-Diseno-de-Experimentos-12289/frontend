import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {map, take} from 'rxjs/operators';

export const agencyAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isSignedIn.pipe(
    take(1),
    map(isSignedIn => {
      const token = localStorage.getItem('token');
      if (isSignedIn && token && auth.isRole('ROLE_AGENCY_STAFF')) return true;
      router.navigate(['/sign-in']).then();
      return false;
    })
  );
};

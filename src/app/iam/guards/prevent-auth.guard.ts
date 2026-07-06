import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {map, take} from 'rxjs/operators';

export const preventAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isSignedIn.pipe(
    take(1),
    map(isSignedIn => {
      if (isSignedIn) {
        router.navigate(['/home']).then();
        return false;
      }
      return true;
    })
  );
};

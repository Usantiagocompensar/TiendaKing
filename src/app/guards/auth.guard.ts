import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {

    return new Promise((resolve) => {

      const auth = getAuth();

      auth.onAuthStateChanged(user => {

        if (user) {
          resolve(true);
        } else {
          this.router.navigateByUrl('/login');
          resolve(false);
        }

      });

    });

  }
}
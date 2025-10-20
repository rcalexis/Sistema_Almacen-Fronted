import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const platFormId = inject(PLATFORM_ID);
  let token: string | null = null;


  if (isPlatformBrowser (platFormId)) {
    token = localStorage.getItem('token');

  }
  if (!token) {

    const router = inject(Router);
    router.navigateByUrl('/login');
  }

return token ? true : false;
};

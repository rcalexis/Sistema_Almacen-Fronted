import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';

import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from './Layout/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'FrontAlmacen';
  private router = inject(Router);
  
  showNavbar = true;
  private routerSubscription: Subscription;

  constructor() {
    
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        this.updateNavbarVisibility(event.url);
      });

    
    this.updateNavbarVisibility(this.router.url);
  }

  private updateNavbarVisibility(url: string): void {
   
    this.showNavbar = !(url === '/login' || url === '/');
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
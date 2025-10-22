import { Routes } from '@angular/router';
import { LoginComponent } from './features/Auth/components/login/login.component';

export const routes: Routes = [

 { path: 'login', component: LoginComponent },

 
  { path: '', redirectTo: '/products', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' }
];

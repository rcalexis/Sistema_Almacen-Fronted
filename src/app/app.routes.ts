import { Routes } from '@angular/router';
import { ProductosListComponent } from './features/Productos/Components/productos-list/productos-list.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/Auth/components/login/login.component';
import { ProductosFormComponent } from './features/Productos/Components/productos-form/productos-form.component';

export const routes: Routes = [

 { path: 'login', component: LoginComponent },

 {
    path: 'products',
    canActivate: [authGuard],
    children: [
      { path: '', component: ProductosListComponent },
      { path: 'crear', component: ProductosFormComponent }, 
    ]
  },
 

  { path: '', redirectTo: '/products', pathMatch: 'full' },

  { path: '**', redirectTo: '/login' }
];

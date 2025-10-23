import { Component, inject, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  
  isMobileMenuOpen = false;
  usuarioRol: number = 0; 
  
 
  menuItems: any[] = [];

  ngOnInit(): void {
    this.cargarRolUsuario();
    this.actualizarMenuItems();
  }

  private cargarRolUsuario(): void {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      const usuarioObj = JSON.parse(usuarioStr);
      this.usuarioRol = usuarioObj.id_rol || 0;
    }
  }

  private actualizarMenuItems(): void {
  
    const itemsBase = [
      {
        label: 'Productos',
        icon: 'pi pi-box',
        routerLink: '/products',
        visible: true 
      },
      {
        label: 'Movimientos',
        icon: 'pi pi-chart-line',
        routerLink: '/movimientos',
        visible: true 
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        routerLink: '/usuarios',
        visible: this.usuarioRol === 1 
      }
    ];

    
    this.menuItems = itemsBase.filter(item => item.visible);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  cerrarSesion() {
    
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('usuario'); 
    
    
    this.router.navigate(['/login']);
  }

 
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }
}
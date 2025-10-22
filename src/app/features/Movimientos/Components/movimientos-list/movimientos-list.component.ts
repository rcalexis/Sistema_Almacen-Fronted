import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

// --- PrimeNG Modules ---
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

// --- Tus Servicios y Modelos ---
import { ApiService } from '../../../../core/services/api.service';
import { Movimiento } from '../../Models/Movimiento.model';

@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ToolbarModule,
    ToastModule, DropdownModule, TagModule, ButtonModule
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrls: ['./movimientos-list.component.css'],
  providers: [MessageService]
})
export class MovimientosListComponent implements OnInit {
  movimientos: Movimiento[] = [];
  usuarioRol: string = '';
  opcionesFiltro = [
    { label: 'Todos los Movimientos', value: '' },
    { label: 'Solo Entradas', value: 'entrada' },
    { label: 'Solo Salidas', value: 'salida' }
  ];
  filtroSeleccionado: string = '';
  private platformId = inject(PLATFORM_ID);

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        this.usuarioRol = usuario.id_rol === 1 ? 'Administrador' : 'Almacenista';
      }
    }
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    const params = this.filtroSeleccionado ? { tipo_movimiento: this.filtroSeleccionado } : {};
    
    this.apiService.getItems('movimientos', '', params).subscribe({
      next: (data) => {
        this.movimientos = data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.mensaje || 'No se pudo cargar el historial.'
        });
      }
    });
  }

  getSeverity(tipo: string): string {
    return tipo === 'entrada' ? 'success' : 'warning';
  }
}
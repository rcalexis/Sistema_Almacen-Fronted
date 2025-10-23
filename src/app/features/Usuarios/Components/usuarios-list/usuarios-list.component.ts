import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';


import { ApiService } from '../../../../core/services/api.service';
import { Usuario } from '../../Models/Usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [
    CommonModule, TableModule, ButtonModule, ToolbarModule,
    TooltipModule, TagModule, ToastModule, ConfirmDialogModule,
    InputTextModule
  ],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class UsuariosListComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.apiService.getItems('usuarios').subscribe({
      next: (data) => { this.usuarios = data; },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios.' });
      }
    });
  }

  crearUsuario(): void {
    this.router.navigate(['/usuarios/crear']);
  }

  editarUsuario(id: number): void {
    this.router.navigate([`/usuarios/editar/${id}`]);
  }

  confirmarBaja(usuario: Usuario): void {
    this.confirmationService.confirm({
      message: `¿Estas seguro de que quieres dar de baja a "${usuario.nombre}"?`,
      header: 'Confirmar Baja',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.darBajaUsuario(usuario.id_usuario),
    });
  }

  private darBajaUsuario(id: number): void {
    this.apiService.deleteItem('usuarios', id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario dado de baja.' });
        this.cargarUsuarios();
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje || 'Ocurrio un error.' })
    });
  }

  reactivarUsuario(id: number): void {
    this.apiService.patchItem('usuarios', id, 'reactivar').subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario reactivado.' });
        this.cargarUsuarios();
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje || 'Ocurrio un error.' })
    });
  }

  onSearch(table: Table, event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    table.filterGlobal(inputValue, 'contains');
  }
}
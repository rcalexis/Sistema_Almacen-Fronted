import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { ApiService } from '../../../../core/services/api.service';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../Models/Producto.model';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, TableModule, ButtonModule,
    ToolbarModule, TooltipModule, DialogModule, InputNumberModule,
    ToastModule, ConfirmDialogModule
  ],
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class ProductosListComponent implements OnInit {
  productos: Producto[] = [];
  usuarioRol: string = '';

  displayDialog: boolean = false;
  cantidadForm: FormGroup;
  productoSeleccionado: Producto | null = null;
  accionInventario: 'aumentar' | 'sacar' | null = null;
  
  cantidadInput: number = 1;
  
  private platformId = inject(PLATFORM_ID);
  public router = inject(Router);

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.cantidadForm = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]] // Valor por defecto 1
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const usuarioStr = localStorage.getItem('usuario');
      if (usuarioStr) {
        const usuarioObj = JSON.parse(usuarioStr);
        if (usuarioObj.id_rol === 1) this.usuarioRol = 'Administrador';
        else if (usuarioObj.id_rol === 2) this.usuarioRol = 'Almacenista';
      }
    }
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.apiService.getItems('productos').subscribe({
      next: (data) => { this.productos = data; },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos.' });
      }
    });
  }

  confirmarBaja(producto: Producto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres dar de baja el producto "${producto.nombre}"?`,
      header: 'Confirmar Baja', icon: 'pi pi-exclamation-triangle',
      accept: () => this.darBaja(producto.id_producto),
    });
  }

  private darBaja(id: number): void {
    this.apiService.patchItem('productos', id, 'baja').subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto dado de baja.' });
        this.cargarProductos();
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje || 'Ocurrió un error.' })
    });
  }

  reactivar(id: number): void {
    this.apiService.patchItem('productos', id, 'reactivar').subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto reactivado.' });
        this.cargarProductos();
      },
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje || 'Ocurrió un error.' })
    });
  }

  abrirDialogo(producto: Producto, accion: 'aumentar' | 'sacar'): void {
    this.productoSeleccionado = producto;
    this.accionInventario = accion;
    this.cantidadInput = 1; 
    this.cantidadForm.patchValue({ cantidad: 1 }); 
    this.displayDialog = true;
  }
  
  onCantidadChange(event: any): void {
    const valor = event.value;
    this.cantidadInput = valor;
    this.cantidadForm.patchValue({ cantidad: valor });
  }

  gestionarInventario(): void {
    if (!this.cantidadInput || this.cantidadInput < 1 || !this.productoSeleccionado || !this.accionInventario) {
      console.log('Datos inválidos:', {
        cantidad: this.cantidadInput,
        producto: this.productoSeleccionado,
        accion: this.accionInventario
      });
      return;
    }

    const id = this.productoSeleccionado.id_producto;
    const data = { cantidad: this.cantidadInput };
    
    console.log('Enviando datos:', {
      modulo: 'productos',
      data: data,
      accion: `${id}/${this.accionInventario}`
    });

    this.apiService.postItem('productos', data, `${id}/${this.accionInventario}`).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Éxito', 
          detail: 'Inventario actualizado correctamente.' 
        });
        this.displayDialog = false;
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error en la petición:', err);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: err.error?.mensaje || 'Ocurrió un error al actualizar el inventario.' 
        });
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-productos-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.css'],
  providers: [MessageService]
})
export class ProductosFormComponent implements OnInit {
  
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      console.warn('Modo Edición: Endpoint de actualización no implementado en el backend.');
    }
  }

  guardarProducto(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.productId) {
      this.messageService.add({ severity: 'warn', summary: 'Pendiente', detail: 'La función de editar no está implementada en el backend.' });
    } else {
      this.apiService.postItem('productos', this.productForm.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado correctamente.' });
          setTimeout(() => this.router.navigate(['/products']), 1500);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.mensaje || 'No se pudo crear el producto.' });
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/products']);
  }
}
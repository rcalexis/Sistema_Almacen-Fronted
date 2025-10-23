import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-usuarios-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CardModule, InputTextModule,
    PasswordModule, DropdownModule, ButtonModule, ToastModule
  ],
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css'],
  providers: [MessageService]
})
export class UsuariosFormComponent implements OnInit {
  usuarioForm: FormGroup;
  isEditMode = false;
  currentUserId: number | null = null;
  roles = [
    { label: 'Administrador', value: 1 },
    { label: 'Almacenista', value: 2 }
  ];
  
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.minLength(6)]],
      id_rol: [null, [Validators.required]]
    });
  }
  cancelar() {
  this.router.navigate(['/usuarios']);
}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentUserId = +id;
   
      this.usuarioForm.get('contrasena')?.clearValidators();
      this.usuarioForm.get('contrasena')?.updateValueAndValidity();
      this.cargarUsuario(this.currentUserId);
    } else {
      this.usuarioForm.get('contrasena')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.usuarioForm.get('contrasena')?.updateValueAndValidity();
    }
  }

  cargarUsuario(id: number): void {
    this.apiService.getItem('usuarios', id).subscribe({
      next: (data) => {
        const { contrasena, ...usuarioData } = data;
        this.usuarioForm.patchValue(usuarioData);
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el usuario.' })
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formData = this.usuarioForm.value;
    if (this.isEditMode && !formData.contrasena) {
      delete formData.contrasena;
    }
    
    const request = this.isEditMode
      ? this.apiService.updateItem('usuarios', this.currentUserId!, formData)
      : this.apiService.postItem('usuarios', formData);

    request.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Usuario ${this.isEditMode ? 'actualizado' : 'creado'} correctamente.` });
        setTimeout(() => this.router.navigate(['/usuarios']), 1500);
      },
      error: (err) => {
        const detail = err.error?.mensaje || `Ocurrio un error al ${this.isEditMode ? 'actualizar' : 'crear'} el usuario.`;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
      }
    });
  }
}
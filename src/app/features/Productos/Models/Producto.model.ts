export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  cantidad_actual: number;
  estatus: boolean;
  fecha_creacion: string;
  usuario_creacion_id: number;
  nombre_creador: string;
}
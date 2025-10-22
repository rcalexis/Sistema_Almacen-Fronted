export interface Movimiento {
  id_movimiento: number;
  producto_id: number;
  nombre_producto: string;
  usuario_id: number;
  nombre_usuario: string;
  tipo_movimiento: 'entrada' | 'salida'; 
  cantidad: number;
  fecha_movimiento: string; 
}
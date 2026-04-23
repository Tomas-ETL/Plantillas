export type Producto = {
  id: string;
  nombre: string;
  sku: string | null;
  descripcion: string | null;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  categoria: string | null;
  ubicacion: string | null;
  created_at: string;
};

export type Categoria = {
  id: string;
  nombre: string;
  created_at: string;
};

export type Movimiento = {
  id: string;
  producto_id: string;
  cantidad: number;
  tipo: 'entrada' | 'salida' | 'ajuste';
  fecha: string;
};

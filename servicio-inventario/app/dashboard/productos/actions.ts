'use server'

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProducto(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const sku = formData.get('sku') as string;
  const descripcion = formData.get('descripcion') as string;
  const precio = parseFloat(formData.get('precio') as string) || 0;
  const stock_actual = parseInt(formData.get('stock_actual') as string) || 0;
  const stock_minimo = parseInt(formData.get('stock_minimo') as string) || 5;
  const categoria = formData.get('categoria') as string;

  const { error } = await supabase.from('productos').insert({
    nombre,
    sku: sku ? sku : null, // Si está vacío pasamos null para evitar errores de Unique constraint
    descripcion,
    precio,
    stock_actual,
    stock_minimo,
    categoria,
  });

  if (error) {
    console.error('Error insertando producto:', error);
    // En un entorno de producción manejaríamos esto mejor para la UI
    throw new Error('Error al crear el producto: ' + error.message);
  }

  // Revalidar la página de productos para que se vean los cambios nuevos
  revalidatePath('/dashboard/productos');
  
  // Redirigir de vuelta a la lista
  redirect('/dashboard/productos');
}

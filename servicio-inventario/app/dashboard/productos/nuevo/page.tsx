import { createProducto } from '../actions';
import Link from 'next/link';

export default function NuevoProductoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Nuevo Producto</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Registra un nuevo artículo en tu inventario.</p>
        </div>
        <Link 
          href="/dashboard/productos" 
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Volver a productos
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <form action={createProducto} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="nombre" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nombre del producto *</label>
              <input type="text" id="nombre" name="nombre" required placeholder="Ej. Zapatillas Nike Air Max" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="sku" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">SKU (Código único)</label>
              <input type="text" id="sku" name="sku" placeholder="Ej. NKE-AM-001" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="categoria" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Categoría</label>
              <input type="text" id="categoria" name="categoria" placeholder="Ej. Calzado" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500" />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="descripcion" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción</label>
              <textarea id="descripcion" name="descripcion" rows={3} placeholder="Detalles del producto..." className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"></textarea>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="precio" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Precio de Venta ($) *</label>
              <input type="number" step="0.01" min="0" id="precio" name="precio" required defaultValue="0.00" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="stock_actual" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Stock Inicial</label>
              <input type="number" min="0" id="stock_actual" name="stock_actual" defaultValue="0" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="stock_minimo" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Alerta de Stock Mínimo</label>
              <input type="number" min="0" id="stock_minimo" name="stock_minimo" defaultValue="5" className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500" />
            </div>
          </div>
          
          <div className="pt-6 flex items-center justify-end border-t border-zinc-200 dark:border-zinc-800 mt-6 gap-4">
            <Link href="/dashboard/productos" className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

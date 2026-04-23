import { supabase } from '@/lib/supabase';
import { Producto } from '@/types/database.types';
import Link from 'next/link';

export default async function ProductosPage() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Productos</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Gestiona el catálogo y el stock de tus productos.</p>
        </div>
        <Link href="/dashboard/productos/nuevo" className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        {error ? (
          <div className="p-6 text-red-500 font-medium">
            Error al cargar productos: {error.message}
          </div>
        ) : !productos || productos.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
            <p className="mb-4">No hay productos registrados en el inventario.</p>
            <Link href="/dashboard/productos/nuevo" className="inline-block text-sm bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-md font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              Crear el primero
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-500 bg-zinc-50/50 dark:bg-zinc-800/50 dark:text-zinc-400 uppercase border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Nombre</th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Categoría</th>
                  <th className="px-6 py-4 font-medium">Precio</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {productos.map((producto: Producto) => (
                  <tr key={producto.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{producto.nombre}</td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{producto.sku || '-'}</td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {producto.categoria ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                          {producto.categoria}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-zinc-900 dark:text-zinc-300">${producto.precio}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${producto.stock_actual <= producto.stock_minimo ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        <span className={producto.stock_actual <= producto.stock_minimo ? 'text-red-600 dark:text-red-400 font-medium' : 'text-zinc-900 dark:text-zinc-300'}>
                          {producto.stock_actual}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium text-sm">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

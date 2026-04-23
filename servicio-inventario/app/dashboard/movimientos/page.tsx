export default function MovimientosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Movimientos</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Historial de entradas, salidas y ajustes de inventario.</p>
        </div>
        <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
          Registrar Movimiento
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {/* Placeholder para la tabla de movimientos */}
        <div className="p-12 text-center text-zinc-500 dark:text-zinc-400">
          <p>Aquí irá el historial de la tabla `movimientos` de Supabase.</p>
        </div>
      </div>
    </div>
  );
}

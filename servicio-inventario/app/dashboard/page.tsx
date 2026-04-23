export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Resumen del Inventario</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Visión general de tus productos y movimientos recientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjetas de estadísticas (Placeholders) */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Productos</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Movimientos Hoy</h3>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">--</p>
        </div>
      </div>
    </div>
  );
}

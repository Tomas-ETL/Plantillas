import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar sidebar básico */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Inventario</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300">
            Resumen
          </Link>
          <Link href="/dashboard/productos" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300">
            Productos
          </Link>
          <Link href="/dashboard/movimientos" className="block px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors dark:text-zinc-300">
            Movimientos
          </Link>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Móvil y Usuario */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold md:hidden">Inventario</h1>
          <div className="flex items-center ml-auto">
            {/* Aquí iría el perfil de usuario */}
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

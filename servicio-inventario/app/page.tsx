'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  topCategory: { nombre: string; count: number } | null;
  bottomCategory: { nombre: string; count: number } | null;
  totalValue: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    topCategory: null,
    bottomCategory: null,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // 1. Fetch Productos
      const { data: products, error: pError } = await supabase
        .from('productos')
        .select('*');
      
      if (pError) throw pError;

      // 2. Fetch Categorías
      const { data: categories, error: cError } = await supabase
        .from('categorias')
        .select('*');
      
      if (cError) throw cError;

      // Calcular Estadísticas
      const totalProducts = products?.length || 0;
      const totalCategories = categories?.length || 0;
      const totalValue = products?.reduce((acc, p) => acc + (Number(p.precio) * Number(p.stock_actual)), 0) || 0;

      // Calcular Categorías (Mayor y Menor)
      const categoryCounts: { [key: string]: number } = {};
      products?.forEach(p => {
        if (p.categoria) {
          categoryCounts[p.categoria] = (categoryCounts[p.categoria] || 0) + 1;
        }
      });

      const sortedCats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
      
      setStats({
        totalProducts,
        totalCategories,
        totalValue,
        topCategory: sortedCats.length > 0 ? { nombre: sortedCats[0][0], count: sortedCats[0][1] } : null,
        bottomCategory: sortedCats.length > 0 ? { nombre: sortedCats[sortedCats.length - 1][0], count: sortedCats[sortedCats.length - 1][1] } : null,
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl">
        {/* Welcome Section */}
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">¡Hola, Bienvenido!</h1>
              <p className="text-zinc-500 dark:text-zinc-400">Aquí tienes el resumen actualizado de tu inventario.</p>
            </div>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-500 mb-1">Total de Productos</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalProducts}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium">
              <span>Gestionar stock</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <p className="text-sm font-medium text-zinc-500 mb-1">Categorías Activas</p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-white">{stats.totalCategories}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 font-medium">
              <span>Ver categorías</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </div>
          </div>

          <div className="rounded-3xl bg-blue-600 p-6 shadow-xl shadow-blue-200 dark:shadow-none">
            <p className="text-sm font-medium text-blue-100 mb-1">Valor Estimado</p>
            <p className="text-3xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
            <p className="mt-4 text-sm text-blue-100 opacity-80 italic">Calculado según stock actual</p>
          </div>
        </div>

        {/* Insights Section */}
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Análisis del Inventario</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Top Category Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="relative z-10">
              <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4">
                CATEGORÍA LÍDER
              </span>
              <h3 className="text-4xl font-black text-zinc-900 dark:text-white mb-2">
                {stats.topCategory?.nombre || 'Ninguna'}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Esta es tu categoría con mayor variedad: <strong>{stats.topCategory?.count} productos</strong> registrados.
              </p>
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-50 dark:bg-emerald-900/10"></div>
          </div>

          {/* Bottom Category Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="relative z-10">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 mb-4">
                BAJA VARIEDAD
              </span>
              <h3 className="text-4xl font-black text-zinc-900 dark:text-white mb-2">
                {stats.bottomCategory?.nombre || 'Ninguna'}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Categoría con menor cantidad: <strong>{stats.bottomCategory?.count} productos</strong>. Podría necesitar refuerzo.
              </p>
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-50 dark:bg-orange-900/10"></div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-sm text-zinc-400">
          <p>© 2026 Sistema de Inventario Pro - Sincronizado con Supabase</p>
        </footer>
      </div>
    </div>
  );
}

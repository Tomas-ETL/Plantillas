import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Producto } from '../types/database.types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getProductos() {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) throw error;
    return data as Producto[];
  }

  async addProducto(producto: Partial<Producto>) {
    const { data, error } = await this.supabase
      .from('productos')
      .insert(producto)
      .select()
      .single();
    
    if (error) throw error;
    return data as Producto;
  }

  async updateProducto(id: string, updates: Partial<Producto>) {
    const { data, error } = await this.supabase
      .from('productos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Producto;
  }

  async deleteProducto(id: string) {
    const { error } = await this.supabase
      .from('productos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Métodos para Categorías
  async getCategorias() {
    const { data, error } = await this.supabase
      .from('categorias')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) throw error;
    return data as any[];
  }

  async addCategoria(nombre: string) {
    const { data, error } = await this.supabase
      .from('categorias')
      .insert({ nombre })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateCategoria(id: string, nombre: string) {
    const { data, error } = await this.supabase
      .from('categorias')
      .update({ nombre })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteCategoria(id: string) {
    const { error } = await this.supabase
      .from('categorias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

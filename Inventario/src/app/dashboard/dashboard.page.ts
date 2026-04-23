import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { SupabaseService } from '../services/supabase.service';
import { Producto } from '../types/database.types';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonHeader, IonToolbar, IonContent]
})
export class DashboardPage implements OnInit, AfterViewInit {
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef;

  barChart: any = null;
  pieChart: any = null;

  products: Producto[] = [];
  filteredProducts: Producto[] = [];
  categorias: any[] = [];

  stats = {
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
    recentMovements: 0
  };

  isModalOpen = false;
  isCategoryModalOpen = false;
  editingProductId: string | null = null;
  editingCategoryId: string | null = null;
  categoryName: string = '';

  productForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    sku: new FormControl(''),
    categoria: new FormControl('', Validators.required),
    ubicacion: new FormControl(''),
    stock_actual: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    stock_minimo: new FormControl<number>(0, [Validators.required, Validators.min(0)]),
    precio: new FormControl<number>(0, [Validators.required, Validators.min(0)])
  });

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    await this.loadProducts();
    await this.loadCategories();
  }

  ngAfterViewInit() {
    // Los gráficos se actualizarán cuando se carguen los productos
  }

  async loadProducts() {
    try {
      this.products = await this.supabaseService.getProductos();
      this.filteredProducts = [...this.products];
      this.updateDashboard();
      this.updateCharts();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  async loadCategories() {
    try {
      this.categorias = await this.supabaseService.getCategorias();
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  updateDashboard() {
    this.stats.totalProducts = this.products.length;
    this.stats.lowStock = this.products.filter(p => p.stock_actual <= p.stock_minimo).length;
    this.stats.totalValue = this.products.reduce((sum, p) => sum + (p.stock_actual * p.precio), 0);
    if (this.stats.recentMovements === 0) {
      this.stats.recentMovements = Math.floor(Math.random() * 50) + 20;
    }
  }

  updateCharts() {
    if (!this.barChartCanvas || !this.pieChartCanvas || this.products.length === 0) return;

    const categoryMap = new Map<string, number>();

    this.products.forEach(product => {
      const cat = product.categoria || 'Sin Categoría';
      const current = categoryMap.get(cat) || 0;
      categoryMap.set(cat, current + product.stock_actual);
    });

    const labels = Array.from(categoryMap.keys());
    const data = Array.from(categoryMap.values());
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad',
          data: data,
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true, grid: { display: true } },
          x: { grid: { display: false } }
        }
      }
    });

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(this.pieChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        }
      }
    });
  }

  handleSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
      (product.categoria && product.categoria.toLowerCase().includes(searchTerm))
    );
  }

  openAddProductModal() {
    this.editingProductId = null;
    this.productForm.reset({ stock_actual: 0, stock_minimo: 0, precio: 0 });
    this.isModalOpen = true;
  }

  editProduct(product: Producto) {
    this.editingProductId = product.id;
    this.productForm.patchValue({
      nombre: product.nombre,
      sku: product.sku,
      categoria: product.categoria,
      ubicacion: product.ubicacion,
      stock_actual: product.stock_actual,
      stock_minimo: product.stock_minimo,
      precio: product.precio
    });
    this.isModalOpen = true;
  }

  closeProductModal() {
    this.isModalOpen = false;
    this.productForm.reset();
    this.editingProductId = null;
  }

  async handleFormSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValues = this.productForm.value;
    const productData: Partial<Producto> = {
      nombre: formValues.nombre!,
      sku: formValues.sku || null,
      categoria: formValues.categoria!,
      ubicacion: formValues.ubicacion || null,
      stock_actual: Number(formValues.stock_actual),
      stock_minimo: Number(formValues.stock_minimo),
      precio: Number(formValues.precio)
    };

    try {
      if (this.editingProductId) {
        await this.supabaseService.updateProducto(this.editingProductId, productData);
      } else {
        await this.supabaseService.addProducto(productData);
      }
      await this.loadProducts();
      this.closeProductModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    }
  }

  async deleteProduct(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await this.supabaseService.deleteProducto(id);
        await this.loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  }

  // Gestión de Categorías
  openCategoryModal() {
    this.isCategoryModalOpen = true;
  }

  closeCategoryModal() {
    this.isCategoryModalOpen = false;
    this.editingCategoryId = null;
    this.categoryName = '';
  }

  editCategory(cat: any) {
    this.editingCategoryId = cat.id;
    this.categoryName = cat.nombre;
  }

  async saveCategory() {
    if (!this.categoryName.trim()) return;

    try {
      if (this.editingCategoryId) {
        await this.supabaseService.updateCategoria(this.editingCategoryId, this.categoryName);
      } else {
        await this.supabaseService.addCategoria(this.categoryName);
      }
      await this.loadCategories();
      this.categoryName = '';
      this.editingCategoryId = null;
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría');
    }
  }

  async deleteCategory(id: string) {
    if (confirm('¿Estás seguro? Los productos con esta categoría no se borrarán, pero se quedarán sin categoría vinculada.')) {
      try {
        await this.supabaseService.deleteCategoria(id);
        await this.loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error al eliminar la categoría');
      }
    }
  }
}

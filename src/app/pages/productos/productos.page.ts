import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CarritoService, Producto } from '../../services/carrito.service';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Página que muestra el catálogo de productos desde la API REST
@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class ProductosPage implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  busqueda: string = '';
  isLoading: boolean = true;
  totalCarrito: number = 0;

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService,
    private toastController: ToastController,
    private router: Router,
    private cdr: ChangeDetectorRef // ✅ detector de cambios
  ) {}

  async ngOnInit() {
    this.carritoService.carrito$.subscribe(() => {
      this.totalCarrito = this.carritoService.getTotalItems();
      this.cdr.detectChanges();
    });
    await this.cargarProductos();
  }

  async cargarProductos() {
    this.isLoading = true;
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = [...this.productos];
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ fuerza actualizar la vista
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar(evento: any) {
    const texto = evento.target.value.toLowerCase();
    this.productosFiltrados = this.productos.filter(p =>
      p.title.toLowerCase().includes(texto)
    );
    this.cdr.detectChanges();
  }

  async agregar(producto: Producto) {
    await this.carritoService.agregarProducto(producto);
    const toast = await this.toastController.create({
      message: `✅ ${producto.title.substring(0, 30)}... agregado`,
      duration: 1500,
      position: 'bottom',
      cssClass: 'toast-success'
    });
    await toast.present();
  }

  irCarrito() { this.router.navigateByUrl('/carrito'); }
  irHome() { this.router.navigateByUrl('/home'); }
}


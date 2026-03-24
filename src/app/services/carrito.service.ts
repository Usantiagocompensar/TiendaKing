import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

// Interfaz que define la estructura de un producto
export interface Producto {
  id: number;
  title: string;
  price: number;
  thumbnail: string; // ✅ dummyjson usa thumbnail en vez de image
  category: string;
}

// Interfaz que define un item del carrito
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

// Servicio global para gestión del carrito de compras
// Usa Capacitor Preferences para persistencia local
@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoSubject = new BehaviorSubject<ItemCarrito[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

  async cargarCarrito() {
    const { value } = await Preferences.get({ key: 'carrito' });
    if (value) {
      this.carritoSubject.next(JSON.parse(value));
    }
  }

  private async guardarCarrito(items: ItemCarrito[]) {
    await Preferences.set({
      key: 'carrito',
      value: JSON.stringify(items)
    });
    this.carritoSubject.next(items);
  }

  async agregarProducto(producto: Producto) {
    const items = this.carritoSubject.value;
    const index = items.findIndex(i => i.producto.id === producto.id);
    if (index >= 0) {
      items[index].cantidad++;
    } else {
      items.push({ producto, cantidad: 1 });
    }
    await this.guardarCarrito([...items]);
  }

  async eliminarProducto(productoId: number) {
    const items = this.carritoSubject.value.filter(
      i => i.producto.id !== productoId
    );
    await this.guardarCarrito(items);
  }

  async incrementar(productoId: number) {
    const items = this.carritoSubject.value;
    const index = items.findIndex(i => i.producto.id === productoId);
    if (index >= 0) items[index].cantidad++;
    await this.guardarCarrito([...items]);
  }

  async decrementar(productoId: number) {
    const items = this.carritoSubject.value;
    const index = items.findIndex(i => i.producto.id === productoId);
    if (index >= 0) {
      items[index].cantidad--;
      if (items[index].cantidad <= 0) {
        items.splice(index, 1);
      }
    }
    await this.guardarCarrito([...items]);
  }

  async vaciarCarrito() {
    await this.guardarCarrito([]);
  }

  getTotalItems(): number {
    return this.carritoSubject.value.reduce((sum, i) => sum + i.cantidad, 0);
  }

  getTotalPrecio(): number {
    return this.carritoSubject.value.reduce(
      (sum, i) => sum + i.producto.price * i.cantidad, 0
    );
  }
}
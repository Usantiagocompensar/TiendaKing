import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from './carrito.service';

// Servicio para consumo de la API REST de productos (DummyJSON)
// Implementa el consumo de servicios API REST con HttpClient
@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  // URL base de la API REST de productos
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  // Obtiene todos los productos desde la API REST
  getProductos(): Observable<Producto[]> {
    return this.http.get<any>(`${this.apiUrl}?limit=30`).pipe(
      map((res: any) => res.products) // DummyJSON retorna { products: [...] }
    );
  }

  // Obtiene productos filtrados por categoría
  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<any>(`${this.apiUrl}/category/${categoria}`).pipe(
      map((res: any) => res.products)
    );
  }
}
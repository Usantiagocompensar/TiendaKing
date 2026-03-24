import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService, ItemCarrito } from '../../services/carrito.service';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Página del carrito de compras con almacenamiento local
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarritoPage implements OnInit {

  items: ItemCarrito[] = [];
  total: number = 0;

  constructor(
    private carritoService: CarritoService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => {
      this.items = items;
      this.total = this.carritoService.getTotalPrecio();
    });
  }

  async incrementar(productoId: number) {
    await this.carritoService.incrementar(productoId);
  }

  async decrementar(productoId: number) {
    await this.carritoService.decrementar(productoId);
  }

  async eliminar(productoId: number) {
    await this.carritoService.eliminarProducto(productoId);
  }

  async comprar() {
    const alert = await this.alertController.create({
      header: '¡Confirmar compra!',
      message: `Total: $${this.total.toFixed(2)} ¿Deseas confirmar tu pedido?`,
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-cancel' },
        {
          text: 'Confirmar',
          cssClass: 'alert-confirm',
          handler: async () => {
            await this.carritoService.vaciarCarrito();
            const toast = await this.toastController.create({
              message: '🎉 ¡Compra realizada con éxito!',
              duration: 2500,
              position: 'bottom',
              cssClass: 'toast-success'
            });
            await toast.present();
            this.router.navigateByUrl('/productos');
          }
        }
      ]
    });
    await alert.present();
  }

  irProductos() { this.router.navigateByUrl('/productos'); }
}

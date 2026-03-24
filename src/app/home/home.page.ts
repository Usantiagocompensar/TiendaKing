import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Componente standalone de la página principal (galería de fotos)
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {

  // Arreglo de fotos con ID y base64
  photos: { id: string, image: string }[] = [];

  // Correo del usuario autenticado
  userEmail: string = '';

  // Controla el spinner de carga inicial
  isLoading: boolean = true;

  constructor(
    private photoService: PhotoService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public router: Router, // ✅ public para usarlo desde el HTML
    private alertController: AlertController,
    private cdr: ChangeDetectorRef // detector de cambios
  ) {}

  // Espera a que Firebase confirme la sesión antes de cargar fotos
  async ngOnInit() {
    await new Promise<void>((resolve) => {
      const auth = getAuth();
      const unsub = onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userEmail = user.email ?? '';
          this.cdr.detectChanges(); // notifica el cambio de correo
          unsub();
          resolve();
        }
      });
    });

    await this.loadPhotos();
  }

  // Carga inicial de fotos desde Firestore
  async loadPhotos() {
    try {
      this.isLoading = true;
      this.photos = await this.firestoreService.getUserPhotos();
    } catch (error) {
      console.error('Error cargando fotos:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // fuerza actualizar la vista
    }
  }

  // Captura foto y la muestra inmediatamente sin esperar a Firestore
  async addPhoto() {
    try {
      const base64 = await this.photoService.takePhoto();
      if (!base64) return;

      const docRef = await this.firestoreService.savePhoto(base64);
      if (!docRef) return;

      // Agrega localmente al inicio del arreglo — aparece de inmediato
      this.photos = [{ id: docRef.id, image: base64 }, ...this.photos];
      this.cdr.detectChanges(); // actualiza la vista

    } catch (error) {
      console.error('Error tomando foto:', error);
    }
  }

  // Elimina la foto localmente de inmediato y luego en Firestore
  async confirmDelete(photoId: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar foto',
      message: '¿Estás seguro de que deseas eliminar esta foto?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-cancel' },
        {
          text: 'Eliminar',
          cssClass: 'alert-delete',
          handler: async () => {
            this.photos = this.photos.filter(p => p.id !== photoId);
            this.cdr.detectChanges(); // actualiza la vista
            await this.firestoreService.deletePhoto(photoId);
          }
        }
      ]
    });
    await alert.present();
  }

  // Muestra confirmación antes de cerrar sesión
  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Deseas cerrar tu sesión?',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'alert-cancel' },
        {
          text: 'Cerrar sesión',
          cssClass: 'alert-delete',
          handler: async () => {
            await this.authService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });
    await alert.present();
  }
}

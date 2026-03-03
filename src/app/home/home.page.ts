import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';       // Servicio para capturar fotos
import { AuthService } from '../services/auth.service';         // Servicio de autenticación
import { FirestoreService } from '../services/firestore.service'; // Servicio de base de datos
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// Componente standalone de la página principal (galería de fotos)
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {

  // Arreglo que almacena las fotos en formato base64
  photos: string[] = [];

  constructor(
    private photoService: PhotoService,       // Inyección del servicio de cámara
    private authService: AuthService,         // Inyección del servicio de autenticación
    private firestoreService: FirestoreService, // Inyección del servicio Firestore
    private router: Router                    // Inyección del router para navegación
  ) {}

  // Se ejecuta al iniciar el componente, carga las fotos del usuario
  async ngOnInit() {
    await this.loadPhotos();
  }

  // Obtiene las fotos del usuario desde Firestore
  async loadPhotos() {
    try {
      this.photos = await this.firestoreService.getUserPhotos();
    } catch (error) {
      console.error('Error cargando fotos:', error);
    }
  }

  // Captura una foto con la cámara y la guarda en Firestore
  async addPhoto() {
    try {
      const base64 = await this.photoService.takePhoto();
      if (!base64) return; // Si no se tomó foto, no hace nada

      await this.firestoreService.savePhoto(base64); // Guarda en Firestore
      await this.loadPhotos(); // Recarga la galería

    } catch (error) {
      console.error('Error tomando foto:', error);
    }
  }

  // Cierra la sesión del usuario y redirige al login
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

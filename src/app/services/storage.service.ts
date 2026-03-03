import { Injectable } from '@angular/core';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Servicio para subir imágenes a Firebase Storage
// Almacena fotos en la nube y retorna la URL de descarga
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class StorageService {

  private storage = getStorage(); // Instancia de Firebase Storage
  private auth = getAuth();       // Instancia de Firebase Auth

  // Sube una imagen en base64 a Firebase Storage
  // Retorna la URL pública de descarga o null si falla
  async uploadPhoto(base64Image: string): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (!user) return null; // No sube si no hay usuario autenticado

      // Ruta única por usuario y timestamp para evitar colisiones
      const filePath = `users/${user.uid}/${Date.now()}.jpg`;
      const storageRef = ref(this.storage, filePath);

      // Sube la imagen en formato base64 (data_url)
      await uploadString(storageRef, base64Image, 'data_url');

      // Obtiene y retorna la URL pública de la imagen subida
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  }
}
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Servicio para captura de fotos usando el plugin Capacitor Camera
// Compatible con Android, iOS y navegador web
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class PhotoService {

  // Abre la cámara del dispositivo y retorna la foto en formato base64 (DataUrl)
  async takePhoto(): Promise<string | null> {

    const image = await Camera.getPhoto({
      quality: 70,                          // Calidad de imagen al 70% para optimizar almacenamiento
      allowEditing: false,                  // No permite edición previa
      resultType: CameraResultType.DataUrl, // Retorna la imagen como DataUrl (base64)
      source: CameraSource.Camera           // Usa la cámara del dispositivo
    });

    return image.dataUrl ?? null; // Retorna null si no se obtuvo imagen
  }
}

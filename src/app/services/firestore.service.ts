import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Servicio para gestión de datos en Firebase Firestore
// Almacena y recupera fotos asociadas al usuario autenticado
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class FirestoreService {

  private db = getFirestore();   // Instancia de Firestore
  private auth = getAuth();      // Instancia de Firebase Auth

  // Guarda una foto en formato base64 en la colección 'photos' de Firestore
  // Asocia la foto al UID del usuario autenticado
  async savePhoto(base64: string) {
    const user = this.auth.currentUser;
    if (!user) return; // No guarda si no hay usuario autenticado

    await addDoc(collection(this.db, 'photos'), {
      uid: user.uid,          // ID único del usuario
      image: base64,          // Imagen en formato base64
      createdAt: Date.now()   // Timestamp para ordenar por fecha
    });
  }

  // Obtiene todas las fotos del usuario autenticado ordenadas por fecha descendente
  async getUserPhotos(): Promise<string[]> {
    const user = this.auth.currentUser;
    if (!user) return []; // Retorna vacío si no hay usuario

    // Consulta con filtro por UID y orden por fecha
    const q = query(
      collection(this.db, 'photos'),
      where('uid', '==', user.uid),       // Solo fotos del usuario actual
      orderBy('createdAt', 'desc')        // Más recientes primero
    );

    const querySnapshot = await getDocs(q);
    const photos: string[] = [];

    // Extrae el campo 'image' de cada documento
    querySnapshot.forEach(doc => {
      photos.push(doc.data()['image']);
    });

    return photos;
  }
}
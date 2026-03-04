import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc, DocumentReference } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Servicio para gestión de datos en Firebase Firestore
// Almacena y recupera fotos asociadas al usuario autenticado
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private db = getFirestore();   // Instancia de Firestore
  private auth = getAuth();      // Instancia de Firebase Auth

  // Guarda una foto y retorna el DocumentReference para obtener el ID
  async savePhoto(base64: string): Promise<DocumentReference | null> {
    const user = this.auth.currentUser;
    if (!user) return null;

    const docRef = await addDoc(collection(this.db, 'photos'), {
      uid: user.uid,          // ID único del usuario
      image: base64,          // Imagen en formato base64
      createdAt: Date.now()   // Timestamp para ordenar por fecha
    });

    return docRef; // ✅ retorna la referencia con el ID generado
  }

  // Obtiene todas las fotos del usuario con su ID de documento incluido
  async getUserPhotos(): Promise<{ id: string, image: string }[]> {
    const user = this.auth.currentUser;
    if (!user) return [];

    const q = query(
      collection(this.db, 'photos'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const photos: { id: string, image: string }[] = [];

    // Retorna el ID del documento junto con la imagen
    querySnapshot.forEach(d => {
      photos.push({ id: d.id, image: d.data()['image'] });
    });

    return photos;
  }

  // Elimina una foto de Firestore por su ID de documento
  async deletePhoto(photoId: string) {
    await deleteDoc(doc(this.db, 'photos', photoId));
  }
}
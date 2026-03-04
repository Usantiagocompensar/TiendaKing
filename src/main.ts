import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { defineCustomElements } from '@ionic/pwa-elements/loader'; // ✅ nuevo

// 🔥 CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCkNHZm0PcVUOFHCLQmZ2L05rqTcim44ls",
  authDomain: "tiendaking-1f90f.firebaseapp.com",
  projectId: "tiendaking-1f90f",
  storageBucket: "tiendaking-1f90f.firebasestorage.app",
  messagingSenderId: "1095056520607",
  appId: "1:1095056520607:web:6d301cb3c5a06f5fca79aa",
  measurementId: "G-ZZJYN32GVD"
};

// 🔥 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Inicializar servicios que vamos a usar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 🚀 Arrancar Angular
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));

// 📷 Habilitar cámara en navegador web
defineCustomElements(window);
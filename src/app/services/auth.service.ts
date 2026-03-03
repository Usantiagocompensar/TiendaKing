import { Injectable } from '@angular/core';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Servicio global de autenticación con Firebase Auth
// Implementa arquitectura JWT para gestión de sesiones
@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class AuthService {

  private auth = getAuth();           // Instancia de Firebase Auth
  private currentUser: User | null = null; // Usuario autenticado actual

  constructor() {
    // Escucha cambios de estado de autenticación en tiempo real
    // Actualiza el usuario actual automáticamente
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      console.log('Estado auth cambió:', user);
    });
  }

  // ============================
  // 🟢 REGISTRO
  // Crea un nuevo usuario con correo y contraseña en Firebase Auth
  // ============================
  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error; // Relanza el error para manejo en el componente
    }
  }

  // ============================
  // 🔵 LOGIN
  // Autentica un usuario existente con correo y contraseña
  // ============================
  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error; // Relanza el error para manejo en el componente
    }
  }

  // ============================
  // 🔴 LOGOUT
  // Cierra la sesión del usuario actual
  // ============================
  async logout() {
    await signOut(this.auth);
  }

  // ============================
  // 🟣 OBTENER USUARIO ACTUAL
  // Retorna el objeto User de Firebase del usuario autenticado
  // ============================
  getUser() {
    return this.currentUser;
  }

  // ============================
  // 🟡 OBTENER JWT TOKEN
  // Obtiene el token JWT del usuario para consumo de APIs REST
  // ============================
  async getToken(): Promise<string | null> {
    if (this.currentUser) {
      return await this.currentUser.getIdToken(); // Token JWT de Firebase
    }
    return null;
  }

  // ============================
  // 🟠 VERIFICAR SI ESTÁ LOGUEADO
  // Retorna true si hay un usuario autenticado actualmente
  // ============================
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}

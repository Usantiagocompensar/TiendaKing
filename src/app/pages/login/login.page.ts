import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Componente standalone de la página de Login y Registro
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {

  email: string = '';         // Campo de correo electrónico
  password: string = '';      // Campo de contraseña
  isLoginMode: boolean = true; // true = Login, false = Registro
  errorMessage: string = '';  // Mensaje de error visible en pantalla
  isSubmitting: boolean = false; // Evita redirección automática durante el submit

  constructor(
    private authService: AuthService,   // Inyección del servicio de autenticación
    private router: Router,             // Inyección del router para navegación
    private cdr: ChangeDetectorRef      // Detector de cambios para actualizar la vista
  ) {
    const auth = getAuth();

    // Escucha el estado de autenticación de Firebase
    // Si el usuario ya tiene sesión activa, redirige al Home
    onAuthStateChanged(auth, (user) => {
      if (user && !this.isSubmitting) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  // Maneja el envío del formulario (login o registro según el modo)
  async submit() {
    this.errorMessage = '';
    this.isSubmitting = true; // Bloquea la redirección automática

    // Validación de campos vacíos
    if (!this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      this.cdr.detectChanges();
      this.isSubmitting = false;
      return;
    }

    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email, this.password); // Inicia sesión
      } else {
        await this.authService.register(this.email, this.password); // Registra usuario
      }

      // Limpia los campos y redirige al Home
      this.email = '';
      this.password = '';
      this.router.navigateByUrl('/home');

    } catch (error: any) {
      // Captura errores de Firebase y muestra mensaje amigable
      this.errorMessage = this.getFirebaseErrorMessage(error.code);
      this.cdr.detectChanges(); // Fuerza actualización de la vista
    } finally {
      this.isSubmitting = false; // Siempre se resetea al terminar
    }
  }

  // Alterna entre modo Login y modo Registro
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  // Traduce los códigos de error de Firebase a mensajes en español
  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos';
      case 'auth/email-already-in-use':
        return 'El correo ya está registrado';
      case 'auth/invalid-email':
        return 'Correo inválido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      default:
        return 'Ocurrió un error. Intenta nuevamente';
    }
  }
}
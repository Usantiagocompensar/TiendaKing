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

  email: string = '';
  password: string = '';
  isLoginMode: boolean = true;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const auth = getAuth();

    // Solo redirige si ya hay sesión activa al entrar al login
    // y no se está procesando un submit
    onAuthStateChanged(auth, (user) => {
      if (user && !this.isSubmitting && this.email === '' && this.password === '') {
        // Solo redirige si los campos están vacíos (sesión preexistente)
        this.router.navigateByUrl('/home');
      }
    });
  }

  // Maneja el envío del formulario (login o registro según el modo)
  async submit() {
    this.errorMessage = '';
    this.isSubmitting = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      this.cdr.detectChanges();
      this.isSubmitting = false;
      return;
    }

    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password);
      }

      this.email = '';
      this.password = '';
      this.router.navigateByUrl('/home');

    } catch (error: any) {
      this.errorMessage = this.getFirebaseErrorMessage(error.code);
      this.cdr.detectChanges();
    } finally {
      this.isSubmitting = false;
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
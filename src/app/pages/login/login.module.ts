import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Directivas comunes de Angular
import { FormsModule } from '@angular/forms';   // Necesario para ngModel en los inputs
import { IonicModule } from '@ionic/angular';    // Componentes UI de Ionic

import { LoginRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';

// Módulo que agrupa la página Login y sus dependencias
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginRoutingModule,
    LoginPage // Componente standalone importado directamente
  ]
})
export class LoginPageModule {}

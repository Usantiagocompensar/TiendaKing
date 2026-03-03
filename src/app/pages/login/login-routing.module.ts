import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login.page';

// Definición de rutas para el módulo Login
const routes: Routes = [
  {
    path: '',
    component: LoginPage // Ruta raíz carga directamente el LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
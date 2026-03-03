import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../guards/auth.guard';

// Definición de rutas para el módulo Home
const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [AuthGuard] // Protege la ruta con autenticación
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
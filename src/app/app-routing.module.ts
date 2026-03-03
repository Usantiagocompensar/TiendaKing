import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Configuración de rutas principales de la aplicación
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Ruta por defecto redirige al Login
    pathMatch: 'full'
  },
  {
    path: 'login',
    // Carga lazy del módulo Login (mejora el rendimiento inicial)
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    // Carga lazy del módulo Home (solo se carga cuando el usuario navega)
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Módulo base para apps web
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';   // Permite hacer peticiones HTTP

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Módulo raíz de la aplicación
// Configura Ionic, el enrutador y los módulos globales
@NgModule({
  declarations: [AppComponent], // Componente raíz de la app
  imports: [
    BrowserModule,               // Módulo base para navegadores web
    IonicModule.forRoot(),       // Inicializa Ionic con configuración global
    AppRoutingModule,            // Módulo de rutas de la aplicación
    HttpClientModule             // Habilita peticiones HTTP para consumo de APIs REST
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Estrategia de rutas de Ionic
  ],
  bootstrap: [AppComponent], // Componente de arranque de la aplicación
})
export class AppModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Directivas comunes de Angular (*ngIf, *ngFor)
import { FormsModule } from '@angular/forms';   // Soporte para formularios y ngModel
import { IonicModule } from '@ionic/angular';    // Componentes UI de Ionic

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

// Módulo que agrupa la página Home y sus dependencias
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    HomePage 
  ]
})
export class HomePageModule {}

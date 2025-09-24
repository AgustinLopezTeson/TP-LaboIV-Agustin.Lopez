import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';

const routes: Routes = [
  { path: '', redirectTo: 'ahorcado', pathMatch: 'full' },
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
];

@NgModule({
  declarations: [AhorcadoComponent, MayorMenorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class JuegosModule {}

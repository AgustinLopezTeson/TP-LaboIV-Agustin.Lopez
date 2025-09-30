import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AhorcadoComponent } from './ahorcado/ahorcado.component';
import { MayorMenorComponent } from './mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './preguntados/preguntados.component';
import { SimonComponent } from './simon/simon.component';

const routes: Routes = [
  { path: '', redirectTo: 'ahorcado', pathMatch: 'full' },
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-menor', component: MayorMenorComponent },
  { path: 'preguntados', component: PreguntadosComponent },
  { path: 'simon', component: SimonComponent },
];

@NgModule({
  declarations: [AhorcadoComponent, MayorMenorComponent, PreguntadosComponent, SimonComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class JuegosModule {}

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy';
import { RegistroComponent } from './pages/registro/registro';

export const routes: Routes = [
  // público
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // info
  { path: 'home', component: HomeComponent },
  { path: 'quien-soy', component: QuienSoyComponent },

  // lazy
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat').then((m) => m.ChatComponent),
  },

  // juegos (módulo lazy con loadChildren)
  {
    path: 'juegos',
    loadChildren: () => import('./juegos/juegos.module').then((m) => m.JuegosModule),
  },
  // página no encontrada
  { path: '**', redirectTo: '' },
];

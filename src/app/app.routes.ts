import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy';
import { RegistroComponent } from './pages/registro/registro';
import { inject } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
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
    canMatch: [
      () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        if (auth.current) return true; // deja pasar
        router.navigateByUrl('/login'); // redirige al login
        auth.signOut();
        return false;
      },
    ],
    loadChildren: () => import('./juegos/juegos.module').then((m) => m.JuegosModule),
  },

  // cuando no encuentra
  { path: '**', redirectTo: '' },
];

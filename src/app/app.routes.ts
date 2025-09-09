import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'quien-soy', component: QuienSoyComponent },
  { path: '**', redirectTo: '' },
];

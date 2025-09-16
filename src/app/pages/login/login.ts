import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  loading = false;
  errorMsg = '';
  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit(email: string, password: string) {
    this.errorMsg = '';
    this.loading = true;
    try {
      await this.auth.signIn(email, password);
      this.router.navigateByUrl('/home');
    } catch (e: any) {
      this.errorMsg = e?.message;
    } finally {
      this.loading = false;
    }
  }

  cargaRapida(emailInput: HTMLInputElement, passwordInput: HTMLInputElement) {
    emailInput.value = 'test@labo4.com';
    passwordInput.value = '123456';
  }
}

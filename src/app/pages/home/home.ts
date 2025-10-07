import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ChatComponent } from '../../chat/chat';
import { ResultadosService } from '../../core/resultado.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ChatComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  ultimos: any[] = [];
  loadingUlt = false;
  constructor(public auth: AuthService, private resultados: ResultadosService) {
    this.cargarUltimos();
  }

  async cargarUltimos() {
    this.loadingUlt = true;
    try {
      this.ultimos = await this.resultados.misResultados(5);
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingUlt = false;
    }
  }
}

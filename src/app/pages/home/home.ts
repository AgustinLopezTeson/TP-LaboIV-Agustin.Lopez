import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ChatComponent } from '../../chat/chat';
import { ResultadosService } from '../../core/resultado.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ChatComponent,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  displayedColumns = ['juego', 'puntaje', 'fecha'];
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

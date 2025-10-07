import { Component } from '@angular/core';
import { PreguntadosService, Round } from './preguntados.service';
import { ResultadosService } from '../../core/resultado.service';

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss'],
})
export class PreguntadosComponent {
  loadingApi = false;
  imgLoading = false;
  private imgTimer: any = null;

  errorMsg = '';
  score = 0;
  lives = 3;
  readonly maxLives = 3;

  round: Round | null = null;
  picked: string | null = null;
  correct = false;
  locked = false;

  deckLeft = 0;

  constructor(private svc: PreguntadosService, private resultados: ResultadosService) {
    this.reset();
  }

  reset(count = 30) {
    this.loadingApi = true;
    this.imgLoading = false;
    this.clearImgTimer();

    this.score = 0;
    this.lives = this.maxLives;
    this.errorMsg = '';
    this.picked = null;
    this.correct = false;
    this.round = null;

    console.time('prepare');
    this.svc.prepare(count).subscribe({
      next: (n) => {
        console.timeEnd('prepare');
        this.deckLeft = n;
        this.loadingApi = false;
        this.nextRound();
      },
      error: (e) => {
        console.error('prepare error:', e);
        this.errorMsg = 'No se pudo preparar el juego. Reintentar.';
        this.loadingApi = false;
      },
    });
  }

  nextRound() {
    this.locked = false;
    this.picked = null;
    this.correct = false;

    const r = this.svc.getNextRound();
    if (!r) {
      this.loadingApi = true;
      this.svc.prepare(30).subscribe({
        next: (n) => {
          this.deckLeft = n;
          this.loadingApi = false;
          const r2 = this.svc.getNextRound();
          this.showRound(r2);
        },
        error: (e) => {
          console.error('re-prepare error:', e);
          this.errorMsg = 'No se pudo recargar el mazo.';
          this.loadingApi = false;
        },
      });
      return;
    }
    this.showRound(r);
  }

  private showRound(r: Round | null) {
    this.round = r;
    if (!r) return;

    this.imgLoading = true;
    this.clearImgTimer();

    this.imgTimer = setTimeout(() => {
      console.warn('⌛ Timeout 10 segundos sin cargar la imagen:', this.round?.imageUrl);
      this.imgLoading = false;
      this.nextRound();
    }, 10000);
  }

  onImgLoad() {
    console.log('Iamagen cargada:', this.round?.imageUrl);
    this.imgLoading = false;
    this.clearImgTimer();
  }

  onImgError() {
    console.warn('Error de imagen:', this.round?.imageUrl);
    this.imgLoading = false;
    this.clearImgTimer();
    this.nextRound();
  }

  private clearImgTimer() {
    if (this.imgTimer) {
      clearTimeout(this.imgTimer);
      this.imgTimer = null;
    }
  }

  choose(elegido: string) {
    if (!this.round || this.locked) return;
    this.locked = true;
    this.picked = elegido;
    this.correct = elegido === this.round.correctName;

    if (this.correct) {
      this.score += 1;
    } else {
      this.lives -= 1;
    }

    setTimeout(() => {
      if (this.lives <= 0) {
        this.finDePartida();
        return;
      }
      this.nextRound();
    }, 800);
  }

  private async finDePartida() {
    await this.resultados.guardar('Preguntados', this.score, { lives: this.lives });
  }
  get gameOver() {
    return this.lives <= 0;
  }
}

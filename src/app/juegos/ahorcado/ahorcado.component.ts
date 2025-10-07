import { Component } from '@angular/core';
import { PalabrasService } from './palabras.service';
import { ResultadosService } from '../../core/resultado.service';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
})
export class AhorcadoComponent {
  // Letras (incluye Ñ)
  letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  record = 0; // record personal
  score = 0; // puntaje total
  error = 0; // errores de la ronda
  erroresMaximos = 6; // vidas
  final = false; // terminó la ronda
  ganar = false; // gana la ronda

  // Palabras / ronda
  queue: string[] = [];
  word = '';
  picked = new Set<string>();

  constructor(private palabras: PalabrasService, private resultados: ResultadosService) {
    this.reset();
  }

  get maskedWord(): string {
    return this.word
      .split('')
      .map((c) => (this.picked.has(c) ? c : '_'))
      .join(' ');
  }
  get palabraSecreta(): string {
    return this.maskedWord;
  }

  /*Reinicia el juego cmopleto*/
  reset(): void {
    this.score = 0;
    this.error = 0;
    this.final = false;
    this.ganar = false;
    this.picked.clear();

    this.cargarLote(() => this.siguientePalabra());
  }

  /*Pasa a la siguiente palabra */
  siguientePalabra(): void {
    this.error = 0;
    this.final = false;
    this.ganar = false;
    this.picked.clear();

    if (!this.queue.length) {
      this.cargarLote(() => this.siguientePalabra());
      return;
    }

    const idx = Math.floor(Math.random() * this.queue.length);
    this.word = (this.queue.splice(idx, 1)[0] || '').toUpperCase();

    this.logSolution('siguientePalabra');
  }

  private logSolution(context: string) {
    console.log(`[${context}]`, this.word);
  }

  private cargarLote(cb?: () => void): void {
    this.palabras.traer({ cantidad: 20, min: 3, max: 9 }).subscribe((lista) => {
      const fallback = [
        'ANGULAR',
        'TECLADO',
        'JUEGO',
        'FIREBASE',
        'SUPABASE',
        'SERVICIO',
        'CASA',
        'LIMPIADOR',
        'MONITOR',
      ];
      const fuente = (lista?.length ? lista : fallback).map((w) => (w || '').toUpperCase());
      this.queue.push(...fuente);
      cb?.();
    });
  }

  /** Procesa una letra elegida */
  guess(l: string): void {
    if (this.final || this.picked.has(l)) return;

    this.picked.add(l);
    if (this.word.includes(l)) {
      const completa = this.word.split('').every((c) => this.picked.has(c));
      if (completa) {
        this.score += 1;
        this.ganar = true;
        this.final = true;
      }
    } else {
      this.error += 1;
      if (this.error >= this.erroresMaximos) {
        this.ganar = false;
        this.final = true; // Game Over
      }
    }
    this.finDePartida();
  }

  private async finDePartida() {
    await this.resultados.guardar('Ahorcado', this.score, { word: this.word, error: this.error });
    if (this.score > this.record) this.record = this.score;
  }

  get gameOver() {
    return this.final && !this.ganar;
  }
}

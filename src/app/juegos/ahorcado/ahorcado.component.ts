import { Component } from '@angular/core';
import { PalabrasService } from '../ahorcado/palabras.service';

@Component({
  selector: 'app-ahorcado',
  standalone: false,
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss'],
})
export class AhorcadoComponent {
  pool = [
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
  letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  word = '';
  picked = new Set<string>();
  error = 0;
  erroresMaximos = 6;
  final = false;
  ganar = false;

  constructor(private palabras: PalabrasService) {
    this.reset();
  }

  get palabraSecreta() {
    return this.word
      .split('')
      .map((c) => (this.picked.has(c) ? c : '_'))
      .join(' ');
  }

  reset() {
    this.palabras.traer({ cantidad: 20, min: 3, max: 9 }).subscribe((lista) => {
      const fuente = lista.length ? lista : this.pool.filter((w) => w.length <= 9); // fallback local
      console.log('Palabras fuente:', fuente);
      const pick = fuente[Math.floor(Math.random() * fuente.length)];
      this.word = pick;
      this.picked.clear();
      this.error = 0;
      this.final = false;
      this.ganar = false;
    });
  }

  guess(l: string) {
    if (this.final || this.picked.has(l)) return;
    this.picked.add(l);
    if (!this.word.includes(l)) this.error++;
    const all = this.word.split('').every((c) => this.picked.has(c));
    if (all) {
      this.final = true;
      this.ganar = true;
    }
    if (this.error >= this.erroresMaximos) {
      this.final = true;
      this.ganar = false;
    }
  }
}

import { Component } from '@angular/core';
import { BarajaService, SpanishCard } from './baraja.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss'],
})
export class MayorMenorComponent {
  deck: SpanishCard[] = [];
  current: SpanishCard | null = null;

  score = 0;

  errores = 0;
  erroresMax = 3;

  ended = false;
  empatesNoCuentan = true;

  constructor(private baraja: BarajaService) {
    this.reset();
  }

  reset() {
    this.deck = this.baraja.buildDeck();
    this.baraja.shuffle(this.deck);
    this.current = this.deck.pop() ?? null;
    this.score = 0;
    this.errores = 0;
    this.ended = false;
    this.logProxima();
  }

  private proxima(): SpanishCard | null {
    return this.deck.length ? this.deck[this.deck.length - 1] : null;
  }
  private logProxima() {
    const p = this.proxima();
    console.log(`[PROXIMA]`, p?.etiqueta);
  }

  play(choice: 'mayor' | 'menor') {
    if (this.ended || !this.current) return;

    const next = this.deck.pop() ?? null;
    if (!next) {
      this.ended = true;
      return;
    }

    const cmp = next.valor - this.current.valor;

    if (cmp === 0 && this.empatesNoCuentan) {
      this.current = next;
      this.logProxima();
      return;
    }

    const ok = choice === 'mayor' ? cmp > 0 : cmp < 0;
    if (ok) {
      this.score++;
    } else {
      this.errores++;
    }

    this.current = next;

    if (this.errores >= this.erroresMax) {
      this.ended = true;
    }
    if (!this.ended) {
      this.logProxima();
    }
  }

  get gameOver() {
    return (this.ended = true);
  }
}

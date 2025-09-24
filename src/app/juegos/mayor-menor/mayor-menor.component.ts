import { Component } from '@angular/core';

type Card = { v: number; label: string };

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss'],
})
export class MayorMenorComponent {
  deck: Card[] = [];
  current: Card | null = null;
  score = 0;
  ended = false;

  constructor() {
    this.reset();
  }

  reset() {
    const base = Array.from({ length: 10 }, (_, i) => i + 1);
    const oneSuit = base.map((v) => ({ v, label: String(v) }));

    this.deck = [...oneSuit, ...oneSuit, ...oneSuit, ...oneSuit];

    this.shuffle(this.deck);
    this.current = this.deck.pop() ?? null;
    this.score = 0;
    this.ended = false;
  }

  play(choice: 'mayor' | 'menor') {
    if (this.ended || !this.current) return;
    const next = this.deck.pop();
    if (!next) {
      this.ended = true;
      return;
    }
    const ok = choice === 'mayor' ? next.v > this.current.v : next.v < this.current.v;
    if (ok) {
      this.score++;
      this.current = next;
    } else {
      this.current = next;
      this.ended = true;
    }
  }

  private shuffle<T>(a: T[]): void {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
}

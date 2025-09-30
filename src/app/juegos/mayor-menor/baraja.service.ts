import { Injectable } from '@angular/core';

export type Palo = 'oros' | 'copas' | 'espadas' | 'bastos';
export interface SpanishCard {
  id: string;
  palo: Palo;
  valor: number;
  etiqueta: string;
  img: string;
}

const BASE = 'assets/baraja';
const EXT = 'png';

@Injectable({ providedIn: 'root' })
export class BarajaService {
  private urlFor(p: Palo, v: number): string {
    const nn = String(v).padStart(2, '0');
    return `${BASE}/${nn}-${p}.${EXT}`;
  }

  buildDeck(): SpanishCard[] {
    const palos: Palo[] = ['bastos', 'copas', 'espadas', 'oros'];
    const valores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    let i = 0;
    return palos.flatMap((p) =>
      valores.map((v) => ({
        id: `${p}-${v}-${i++}`,
        palo: p,
        valor: v,
        etiqueta: `${v} de ${p}`,
        img: this.urlFor(p, v),
      }))
    );
  }

  shuffle<T>(a: T[]): void {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
}

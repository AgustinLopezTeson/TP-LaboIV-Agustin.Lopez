import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

type ApiCharacter = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl: string;
};

export type Round = {
  imageUrl: string;
  correctName: string;
  options: string[];
};

@Injectable({ providedIn: 'root' })
export class PreguntadosService {
  private base = 'https://thronesapi.com/api/v2/Characters';
  private characters$!: Observable<ApiCharacter[]>;

  // Mazo y puntero
  private all: ApiCharacter[] = [];
  private deck: ApiCharacter[] = [];
  private ptr = 0;

  constructor(private http: HttpClient) {
    this.characters$ = this.http.get<ApiCharacter[]>(this.base).pipe(
      map((list) => list.filter((c) => !!c.imageUrl && !!c.fullName)),
      shareReplay(1)
    );
  }

  /* Prepara un mazo de 30 personasjes*/
  prepare(count = 10): Observable<number> {
    return this.characters$.pipe(
      map((list) => {
        this.all = list;
        const n = Math.min(count, list.length);
        this.deck = this.shuffle([...list]).slice(0, n);
        this.ptr = 0;
        return n;
      })
    );
  }

  getNextRound(): Round | null {
    if (!this.deck.length || this.ptr >= this.deck.length) return null;

    const correct = this.deck[this.ptr++];

    const distractors = this.pickN(
      this.all.filter((c) => c.id !== correct.id),
      3
    );

    const options = this.shuffle([correct.fullName, ...distractors.map((d) => d.fullName)]);

    return {
      imageUrl: correct.imageUrl,
      correctName: correct.fullName,
      options,
    };
  }

  private shuffle<T>(a: T[]): T[] {
    const copy = [...a];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  private pickN<T>(arr: T[], n: number): T[] {
    const copy = [...arr];
    this.shuffle(copy);
    return copy.slice(0, Math.min(n, copy.length));
  }
}

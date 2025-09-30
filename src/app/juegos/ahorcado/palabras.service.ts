import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PalabrasService {
  private API = 'https://random-word-api.herokuapp.com/word';

  constructor(private http: HttpClient) {}

  /** Trae palabras en español y filtra por largo (min/max). */
  traer({ cantidad = 100, min = 3, max = 9 } = {}) {
    const url = `${this.API}?number=${cantidad}&lang=es`;
    return this.http.get<string[]>(url).pipe(
      map((arr) =>
        arr
          // solo letras (incluye tildes y ñ)
          .filter((w) => /^[a-záéíóúüñ]+$/i.test(w))
          .map((w) =>
            w
              .replace(/á/gi, 'a')
              .replace(/é/gi, 'e')
              .replace(/í/gi, 'i')
              .replace(/ó/gi, 'o')
              .replace(/ú/gi, 'u')
              .replace(/ü/gi, 'u')
              .toUpperCase()
          )
          .filter((w) => w.length >= min && w.length <= max)
      ),
      // si falla la API
      catchError(() => of<string[]>([]))
    );
  }
}

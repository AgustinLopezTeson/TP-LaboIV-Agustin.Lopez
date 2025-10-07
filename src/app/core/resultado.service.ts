import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

export type GameName = 'Ahorcado' | 'Mayor-menor' | 'Preguntados' | 'Simon';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  async guardar(game: GameName, score: number, details?: any) {
    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) throw new Error('not_logged');

    const row = {
      user_id: user.id,
      user_email: user.email,
      game,
      score,
      details: details ?? null,
    };
    const { error } = await supabase.from('resultados_juegos').insert(row);
    if (error) throw error;
  }

  async misResultados(limit = 30) {
    const { data, error } = await supabase
      .from('resultados_juegos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  }
}

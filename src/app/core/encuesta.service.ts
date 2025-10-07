import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

export type Encuesta = {
  full_name: string; // nombre y apellido
  age: number; // 18–99
  phone: string; // hasta 10 dígitos
  q1: string; // texto libre
  modo_claro: boolean; // checkbox
  gusto_pagina: number; // 1–10
};

@Injectable({ providedIn: 'root' })
export class EncuestaService {
  async enviar(data: Encuesta) {
    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) throw new Error('not_logged');

    const row = {
      user_id: user.id,
      user_email: user.email,
      full_name: data.full_name,
      age: data.age,
      phone: data.phone,
      q1: data.q1,
      modo_claro: data.modo_claro,
      gusto_pagina: data.gusto_pagina,
    };

    const { error } = await supabase.from('encuesta').insert(row);
    if (error) throw error;
  }
}

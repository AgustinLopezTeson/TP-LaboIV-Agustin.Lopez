import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from './supabase.client';
import type { User } from '@supabase/supabase-js';

export type AppUser = {
  id: string;
  email: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  age?: number | null;
} | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<AppUser>(null);
  user$ = this._user$.asObservable();

  constructor() {
    supabase.auth.getUser().then(({ data }) => this.traerInfo(data.user ?? null));
    supabase.auth.onAuthStateChange((_e, session) => this.traerInfo(session?.user ?? null));
  }

  get current() {
    return this._user$.value;
  }
  private traerInfo(u: User | null) {
    if (!u) {
      this._user$.next(null);
      return;
    }

    const meta = (u.user_metadata ?? {}) as any;
    const laEdad = meta.age;
    const edadNum = typeof laEdad === 'number' ? laEdad : Number(laEdad);
    const age = Number.isFinite(edadNum) ? edadNum : null;

    this._user$.next({
      id: u.id,
      email: u.email ?? null,
      display_name: meta.display_name ?? null,
      avatar_url: meta.avatar_url ?? null,
      age,
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  async signUp(email: string, password: string, displayName: string, age?: number) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          ...(age ? { age } : {}),
        },
      },
    });
    if (error) throw error;
    return data.user;
  }

  async signOut() {
    await supabase.auth.signOut();
  }
}

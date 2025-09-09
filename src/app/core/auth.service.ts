import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from './supabase.client';

export type AppUser = { id: string; email: string | null; display_name?: string | null } | null;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<AppUser>(null);
  user$ = this._user$.asObservable();

  constructor() {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      this._user$.next(
        u
          ? {
              id: u.id,
              email: u.email ?? null,
              display_name: (u.user_metadata as any)?.display_name,
            }
          : null
      );
    });
    // Escuchar cambios de sesión
    supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      this._user$.next(
        u
          ? {
              id: u.id,
              email: u.email ?? null,
              display_name: (u.user_metadata as any)?.display_name,
            }
          : null
      );
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  async signOut() {
    await supabase.auth.signOut();
  }
}

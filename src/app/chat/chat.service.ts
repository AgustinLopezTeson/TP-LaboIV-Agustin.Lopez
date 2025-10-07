import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../core/supabase.client';

export type ChatMsg = {
  id: string;
  created_at: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  text: string;
};

@Injectable({ providedIn: 'root' })
export class ChatService {
  private _msgs$ = new BehaviorSubject<ChatMsg[]>([]);
  msgs$ = this._msgs$.asObservable();

  private _subscribed = false;
  private _canal: ReturnType<typeof supabase.channel> | null = null;

  private _intentos = 0;
  private _timerReconexion: any = null;

  private _initOnce = false;
  private _gen = 0;
  private _lastCreatedAt: string | null = null;

  constructor() {
    supabase.auth.getSession().then(({ data }) => {
      supabase.realtime.setAuth(data.session?.access_token ?? '');
    });

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        supabase.realtime.setAuth(session?.access_token ?? '');
      }
    });

    window.addEventListener('online', () => this.programarReconexion());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.programarReconexion();
    });
  }

  async init() {
    if (this._initOnce) return;
    this._initOnce = true;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) console.error('History error:', error);
    const list = data ?? [];
    this._msgs$.next(list);
    this._lastCreatedAt = list.length ? list[list.length - 1].created_at : null;

    await this.suscribirRealtime();
  }
  /* No es necesario porque supabase-js ya maneja el token internamente pero lo usaba por que el token se me pisaba
  private async setRealtimeToken() {
    const { data } = await supabase.auth.getSession();
    supabase.realtime.setAuth(data.session?.access_token ?? '');
  }
*/
  private async suscribirRealtime() {
    const gen = ++this._gen;
    await this._canal?.unsubscribe();
    this._canal = null;
    console.log('VECES QUE SE CORTO (' + gen + ')');
    this._subscribed = false;

    const ch = supabase
      .channel('realtime:public:chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          this.pusheoUnico(payload.new as ChatMsg);
        }
      )
      .subscribe(async (status) => {
        console.log('Realtime status:', status);

        if (status === 'SUBSCRIBED') {
          this._subscribed = true;
          this._intentos = 0;

          // En el caso de que se caiga el realtime, cuando vuelva traigo los mensajes que me perdí
          if (this._lastCreatedAt) {
            const { data: missing, error } = await supabase
              .from('chat_messages')
              .select('*')
              .gt('created_at', this._lastCreatedAt)
              .order('created_at', { ascending: true })
              .limit(200);
            (missing ?? []).forEach((row) => this.pusheoUnico(row as ChatMsg));
          }
        } else if (status === 'CLOSED' || status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          this._subscribed = false;
          this.programarReconexion();
        }
      });

    this._canal = ch;
  }

  private programarReconexion(delayMs?: number) {
    if (this._subscribed) return;
    if (this._timerReconexion) return;

    if (!navigator.onLine) {
      const onBack = () => {
        window.removeEventListener('online', onBack);
        this.programarReconexion();
      };
      window.addEventListener('online', onBack);
      return;
    }
    // Si la pestaña está oculta, espero a que vuelva a primer plano

    const delay = delayMs ?? Math.min(1000 * Math.pow(2, this._intentos++), 10000);

    this._timerReconexion = setTimeout(async () => {
      this._timerReconexion = null;
      await this.suscribirRealtime();
    }, delay);
  }

  private pusheoUnico(m: ChatMsg) {
    const actual = this._msgs$.value;
    if (!actual.some((x) => x.id === m.id)) {
      const next = [...actual, m];
      this._msgs$.next(next);
      if (!this._lastCreatedAt || m.created_at > this._lastCreatedAt) {
        this._lastCreatedAt = m.created_at;
      }
    }
  }

  async send(text: string) {
    const t = text.trim();
    if (!t) return;

    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) throw new Error('not_logged');

    const meta: any = user.user_metadata ?? {};
    const { data: inserted, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        display_name: meta.display_name ?? null,
        email: user.email ?? null,
        text: t,
      })
      .select()
      .single();

    if (inserted) this.pusheoUnico(inserted as ChatMsg);
  }
}

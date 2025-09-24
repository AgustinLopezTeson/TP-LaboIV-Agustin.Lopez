import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { supabase } from '../../core/supabase.client';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class RegistroComponent {
  msg = '';
  msgType: 'ok' | 'error' | '' = '';
  loading = false;
  constructor(private auth: AuthService, private router: Router) {}

  async onSubmit(
    displayName: string,
    email: string,
    password: string,
    age: number,
    avatarFile: File | null
  ) {
    this.loading = true;
    this.msg = '';
    this.msgType = '';

    displayName = (displayName || '').trim();
    email = (email || '').trim();

    if (!displayName || displayName.length < 2) {
      this.setMsg('Ingresá un nombre válido.', 'error');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      this.setMsg('Email inválido.', 'error');
      this.loading = false;
      return;
    }
    if (!password || password.length < 6) {
      this.setMsg('La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }
    if (!Number.isFinite(age) || age < 18 || age > 99) {
      this.setMsg('La edad debe estar entre 18 y 99.', 'error');
      return;
    }
    if (!avatarFile) {
      this.setMsg('Seleccioná una imagen para tu avatar.', 'error');
      return;
    }
    if (!avatarFile.type.startsWith('image/')) {
      this.setMsg('El archivo debe ser una imagen.', 'error');
      return;
    }

    try {
      const user = await this.auth.signUp(email, password, displayName, age);

      if (!user) {
        this.setMsg('No se pudo crear el usuario.', 'error');
        return;
      }

      const path = `${displayName}/avatar-${Date.now()}.png`;
      const up = await supabase.storage.from('images').upload(path, avatarFile);

      const { data: pub } = supabase.storage.from('images').getPublicUrl(path);
      const upd = await supabase.auth.updateUser({ data: { avatar_url: pub.publicUrl } });

      this.setMsg('¡Cuenta creada', 'ok');
      setTimeout(() => this.router.navigateByUrl('/home'), 500);
    } catch (e: any) {
      const raw = String(e?.message || e?.error_description || e?.code || '').toLowerCase();
      let ui = 'No se pudo completar el registro.';
      if (raw.includes('user already registered')) ui = 'El usuario ya está registrado.';
      if (raw.includes('invalid email')) ui = 'El correo no es válido.';
      this.setMsg(ui, 'error');
    } finally {
      this.loading = false;
    }
  }

  private setMsg(text: string, type: 'ok' | 'error' | '') {
    this.msg = text;
    this.msgType = type;
  }
}

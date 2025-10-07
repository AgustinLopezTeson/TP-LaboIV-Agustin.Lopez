import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncuestaService } from '../../core/encuesta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encuesta.html',
  styleUrls: ['./encuesta.scss'],
})
export class EncuestaComponent {
  loading = false;
  msg = '';
  msgType: '' | 'ok' | 'error' = '';

  constructor(private svc: EncuestaService, private router: Router) {}

  async onSubmit(
    fullNameInp: HTMLInputElement,
    ageInp: HTMLInputElement,
    phoneInp: HTMLInputElement,
    q1Inp: HTMLTextAreaElement,
    q2Inp: HTMLInputElement, // checkbox
    likeInp: HTMLInputElement // range 1–10
  ) {
    this.msg = '';
    this.msgType = '';

    const full_name = fullNameInp.value.trim();
    const age = Number(ageInp.value);
    const phone = phoneInp.value.trim();
    const q1 = q1Inp.value.trim();
    const q2 = q2Inp.checked;
    const like = Number(likeInp.value);

    // Validaciones
    if (!full_name) return this.setMsg('Nombre y apellido es requerido.', 'error');
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(full_name))
      return this.setMsg('Nombre y apellido: solo letras y espacios.', 'error');

    if (!Number.isFinite(age) || age < 18 || age > 99)
      return this.setMsg('Edad entre 18 y 99.', 'error');

    if (!/^\d{1,10}$/.test(phone)) return this.setMsg('Teléfono: solo números (máx. 10).', 'error');

    if (!q1) return this.setMsg('La respuesta de la pregunta 1 es requerida.', 'error');

    if (!Number.isFinite(like) || like < 1 || like > 10)
      return this.setMsg('Indicá cuánto te gustó la página (1 a 10).', 'error');

    this.loading = true;
    try {
      await this.svc.enviar({
        full_name,
        age,
        phone,
        q1,
        modo_claro: q2,
        gusto_pagina: like,
      });
      this.setMsg('¡Encuesta enviada!', 'ok');

      // limpiar
      fullNameInp.value = '';
      ageInp.value = '';
      phoneInp.value = '';
      q1Inp.value = '';
      q2Inp.checked = false;
      likeInp.value = '5';
      (document.getElementById('likeRange') as HTMLInputElement)?.dispatchEvent(new Event('input'));
      const checked = document.querySelector<HTMLInputElement>('input[name="q4"]:checked');
      if (checked) checked.checked = false;
      setTimeout(() => this.router.navigateByUrl('home'), 1000);
    } catch (e) {
      console.error(e);
      this.setMsg('No se pudo enviar la encuesta.', 'error');
    } finally {
      this.loading = false;
    }
  }

  private setMsg(t: string, k: 'ok' | 'error' | '') {
    this.msg = t;
    this.msgType = k;
  }
}

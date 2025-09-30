import { Component } from '@angular/core';

@Component({
  selector: 'app-simon-dice',
  standalone: false,
  templateUrl: './simon.component.html',
  styleUrls: ['./simon.component.scss'],
})
export class SimonComponent {
  //Config
  readonly maxLives = 3;
  readonly activeMs = 550; // tiempo encendido
  readonly pauseMs = 180; // pausa
  readonly baseDelay = 600; // delay
  locked = true;
  playing = false;

  score = 0;
  lives = this.maxLives;
  seq: number[] = [];
  step = 0;
  activePad: number | null = null;
  wrongPad: number | null = null;
  gameOver = false;

  ngOnInit() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.lives = this.maxLives;
    this.seq = [];
    this.step = 0;
    this.gameOver = false;
    this.locked = true;
    this.nextRound();
  }

  private nextRound() {
    this.seq.push(this.randPad());
    this.step = 0;
    setTimeout(() => this.playSequence(), this.baseDelay);
  }

  private randPad() {
    return Math.floor(Math.random() * 4);
  }

  private async playSequence() {
    this.locked = true;
    this.playing = true;
    for (const idx of this.seq) {
      await this.flash(idx);
      await this.delay(this.pauseMs);
    }
    this.playing = false;
    this.locked = false;
  }

  private async flash(idx: number) {
    this.activePad = idx;
    await this.delay(this.activeMs);
    this.activePad = null;
  }

  async press(idx: number) {
    if (this.locked || this.gameOver) return;

    this.activePad = idx;
    setTimeout(() => (this.activePad = null), 120);

    const expected = this.seq[this.step];
    const ok = idx === expected;

    if (!ok) {
      this.wrongPad = idx;
      this.lives--;
      this.locked = true;
      setTimeout(() => (this.wrongPad = null), 300);

      if (this.lives <= 0) {
        this.gameOver = true;
        return;
      }
      setTimeout(() => this.playSequence(), 650);
      return;
    }

    this.step++;

    if (this.step >= this.seq.length) {
      this.score++;
      this.locked = true;
      setTimeout(() => this.nextRound(), 600);
    }
  }

  private delay(ms: number) {
    return new Promise<void>((res) => setTimeout(res, ms));
  }
}

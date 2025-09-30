import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService, ChatMsg } from './chat.service';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [CommonModule, DatePipe],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @Input() height = 200;
  @ViewChild('list') listRef!: ElementRef<HTMLDivElement>;

  private sub?: Subscription;

  constructor(public svc: ChatService, public auth: AuthService) {}

  ngOnInit() {
    this.svc.init();
  }

  ngAfterViewInit() {
    this.sub = this.svc.msgs$.subscribe(() => this.scrollToBottom());
  }

  async envio(inp: HTMLInputElement) {
    const v = inp.value.trim();
    if (!v) return;
    try {
      await this.svc.send(v);
      inp.value = '';
      this.scrollToBottom();
    } catch (e) {
      console.error(e);
    }
  }

  private scrollToBottom() {
    queueMicrotask(() => {
      const el = this.listRef?.nativeElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  }

  msjPropio(m: ChatMsg, myId: string | null | undefined) {
    return !!myId && m.user_id === myId;
  }

  colorFor(uid: string | null | undefined) {
    if (!uid) return '#2a2a2a';
    let h = 0;
    for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) >>> 0;
    const hue = h % 360;
    return `hsl(${hue} 70% 32%)`;
  }

  //trackById = (_: number, m: { id: string }) => m.id;
}

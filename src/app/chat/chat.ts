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
import { ChatService } from './chat.service';

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

  constructor(public svc: ChatService) {}

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

  //trackById = (_: number, m: { id: string }) => m.id;
}

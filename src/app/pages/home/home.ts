import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ChatComponent } from '../../chat/chat';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ChatComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  constructor(public auth: AuthService) {}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: `./header.html`,
  styleUrl: './header.scss',
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent {
  // Mobile menu state
  isMenuOpen = false;

  constructor(public themeService: ThemeService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Close menu when navigation occurs or when resizing to large screens
  closeMenu() {
    this.isMenuOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

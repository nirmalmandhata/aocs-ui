import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'aocs-theme';
  
  themeSignal = signal<Theme>('dark');
  
  constructor() {
    this.initializeTheme();
  }
  
  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      this.setTheme(savedTheme);
    } else {
      // Default to dark theme
      this.setTheme('dark');
    }
  }
  
  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }
  
  toggleTheme() {
    const newTheme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
  
  private applyTheme(theme: Theme) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}

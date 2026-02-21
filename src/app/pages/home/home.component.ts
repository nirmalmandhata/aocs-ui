import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Primary conversion action: navigate to contact page where the assessment form lives
  bookAssessment() {
    // In future we can open a modal or capture lead directly on this page.
    this.router.navigate(['/contact']);
  }

  // Scroll to anchored section on this page
  scrollTo(selector: string) {
    try {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      // fallback: navigate to the page and let the browser handle the anchor
      console.warn('scrollTo failed', e);
    }
  }
}

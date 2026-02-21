import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from '../../components/header.component';
import { FooterComponent } from '../../components/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  pageTitle = 'Dashboard';

  private pageTitles: Record<string, string> = {
    '': 'Home',
    '/': 'Home',
    '/ai-development': 'AI Development',
    '/services': 'Services',
    '/use-cases': 'Use Cases',
    '/about': 'About',
    '/contact': 'Contact'
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const path = event.urlAfterRedirects;
      this.pageTitle = this.pageTitles[path] || 'Home';
    });

    // Set initial page title
    const currentPath = this.router.url;
    this.pageTitle = this.pageTitles[currentPath] || 'Home';
  }
}

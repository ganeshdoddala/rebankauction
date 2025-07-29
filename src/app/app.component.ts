import { Component } from '@angular/core';
import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Roshan Enterprises';

  showHeaderFooter = true;

constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const hiddenRoutes = ['/login', '/dashboard', '/dashboard']; // Routes where header/footer should NOT be shown
      this.showHeaderFooter = !this.router.url.startsWith('/dashboard');
    });
  }
}

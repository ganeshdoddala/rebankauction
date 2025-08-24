import { DatePipe } from '@angular/common';
import { Component, Pipe, PipeTransform } from '@angular/core';
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

@Pipe({ name: 'safeDate' })
export class SafeDatePipe implements PipeTransform {
  transform(value: any, format: string = 'dd-MM-yyyy hh:mm a'): string {
    if (!value) return '-';

    let date: Date;
    if (typeof value === 'string' && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3 && parts[0].length === 2) {
        const [day, month, year] = parts;
        date = new Date(`${year}-${month}-${day}`);
      } else {
        date = new Date(value);
      }
    } else {
      date = new Date(value);
    }

    return isNaN(date.getTime()) ? '-' : new DatePipe('en-US').transform(date, format) || '-';
  }
}

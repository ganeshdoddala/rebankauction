// sidebar-toggle.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {
  private sideNavStatus = new BehaviorSubject<boolean>(false);

  isSearchPriction: boolean = false;
  getSideNavStatus() {
    return this.sideNavStatus.asObservable();
  }

  toggleSideNav(isOpen: boolean) {
    this.sideNavStatus.next(isOpen);
  }
  private loadSecondComponent = new BehaviorSubject<boolean>(false);
  loadSecond$ = this.loadSecondComponent.asObservable();

  triggerLoadSecondComponent(load: boolean) {
    this.loadSecondComponent.next(load);
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { UserService } from '../../../../agent/core/user/user.service';
import { AuthService } from '../../../../agent/auth/services/auth.service';
import { SidebarToggleService } from '../../../../services/side-navbar/sidenavbar.service';
import { StorageService } from '../../../../agent/core/storage/storage.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})

export class SideNavbarComponent implements OnInit {
  @Input() isOpen: boolean = true;
  isSideNavOpen: boolean = false;
  fullname: any;
  email: any;
  userProfileImage: any;
  constructor(
    private _user: UserService,
    public sidebarService: SidebarToggleService,
    private _storage: StorageService,
  ) {}
  ngOnInit(): void {
    this.fullname = this._user.fullname();
    this.email = this._user.getUserInfoByKey('email');
    this.userProfileImage = this._storage.getLocalObject('profile_photo');
    this.sidebarService.getSideNavStatus().subscribe(status => {
      this.isSideNavOpen = status;
    });
  }
  triggerLoad() {
    this.sidebarService.triggerLoadSecondComponent(true);
  }
  menuItems = [
    { name: 'Home', icon: 'home', path: 'dashboard' },
    { name: 'Consultations', icon: 'assignment', path: 'precription' }
  ];
}

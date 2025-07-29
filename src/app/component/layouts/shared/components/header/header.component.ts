import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  Injectable
} from '@angular/core';
import { UserService } from '../../../../agent/core/user/user.service';
import { AuthService } from '../../../../agent/auth/services/auth.service';
import { Router } from '@angular/router';
import { SidebarToggleService } from '../../../../services/side-navbar/sidenavbar.service';
import { StorageService } from '../../../../agent/core/storage/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  fullname: any;
  email: any;
  userProfileImage: any;
  title: string = 'EMR Dashboard';
  constructor(
    private _user: UserService,
    private _auth: AuthService,
    private _storage: StorageService,
    private router: Router,
    public sidebarService: SidebarToggleService
  ) {}
  isSideNavOpen: boolean = false;
  toggleNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
    this.sidebarService.toggleSideNav(this.isSideNavOpen);
  }

  ngOnInit(): void {
    this.fullname = this._user.fullname();
    this.email = this._user.getUserInfoByKey('email');
    this.userProfileImage = this._storage.getLocalObject('profile_photo');
    // this.userProfileImage = this._user.getUserInfoByKey('image');
    // console.log("this.userProfileImage",this._user.getUserInfoByKey('image'))
  }
  logout(event: Event) {
    console.log('logout');
    this._user.logoutUser();
    this._auth.logoutUser();
  }
}

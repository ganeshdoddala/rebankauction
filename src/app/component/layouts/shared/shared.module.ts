import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../../app-routing.module';

@NgModule({
  declarations: [HeaderComponent, SideNavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    AppRoutingModule
  ],
  exports: [HeaderComponent, SideNavbarComponent]
})
export class SharedModule {}

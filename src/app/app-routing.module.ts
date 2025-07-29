import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/website/home/home.component';
import { AboutComponent } from './component/website/about/about.component';
import { ContactComponent } from './component/website/contact/contact.component';
import { LoginComponent } from './component/agent/login/login.component';
import { PropertiesComponent } from './component/website/properties/properties.component';
import { ForgotPasswordComponent } from './component/agent/forgotPassword/forgotPassword.component';
import { DashboardComponent } from './component/layouts/dashboard/dashboard.component';
import { FullwidthComponent } from './component/layouts/fullwidth/fullwidth.component';
import { AuthService } from './component/agent/auth/services/auth.service';
import { PropertyDetailsComponent } from './component/website/property-details/property-details.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'dashboard', loadChildren: () => import('./component/layouts/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'property-details/:id', component: PropertyDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

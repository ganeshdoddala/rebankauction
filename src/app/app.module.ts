import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/website/home/home.component';
import { HeaderComponent } from './component/website/header/header.component';
import { FooterComponent } from './component/website/footer/footer.component';
import { AboutComponent } from './component/website/about/about.component';
import { ContactComponent } from './component/website/contact/contact.component';
import { LoginComponent } from './component/agent/login/login.component';
import { PropertiesComponent } from './component/website/properties/properties.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GALLERY_CONFIG, GalleryComponent, GalleryModule } from  'ng-gallery';
import { LIGHTBOX_CONFIG, LightboxModule } from  'ng-gallery/lightbox';
import { config } from 'rxjs';
import { LightgalleryModule } from 'lightgallery/angular';
import { PropertyDetailsComponent } from './component/website/property-details/property-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    FooterComponent,
    HeaderComponent,
    PropertiesComponent,
    LoginComponent,
    PropertyDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LightboxModule,
    GalleryModule,
    LightgalleryModule
  ],
  providers:[
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: false
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

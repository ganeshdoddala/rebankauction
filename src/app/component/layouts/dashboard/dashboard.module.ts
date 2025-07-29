import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../../component/agent/auth/services/auth.service';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { PrivatePropertiesComponent } from './private-properties/private-properties.component';
import { AgentsComponent } from './agents/agents.component';
import { SettingsComponent } from './settings/settings.component';
import { AddPropertiesComponent } from './add-properties/add-properties.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ViewPropertiesComponent,
    PrivatePropertiesComponent,
    AgentsComponent,
    SettingsComponent,
    AddPropertiesComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { 

}

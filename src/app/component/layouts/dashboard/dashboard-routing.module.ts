import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { PrivatePropertiesComponent } from './private-properties/private-properties.component';
import { AgentsComponent } from './agents/agents.component'
import { SettingsComponent } from './settings/settings.component'
import { AddPropertiesComponent } from './add-properties/add-properties.component';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'getproperties', component: ViewPropertiesComponent },
      { path: 'privateproperties', component: PrivatePropertiesComponent },
      { path: 'agents', component: AgentsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'addproperties', component: AddPropertiesComponent },
      { path: 'editproperties/:id', component: AddPropertiesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

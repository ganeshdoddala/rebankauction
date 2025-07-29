import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../agent/core/storage/storage.service';
import { AgentsService } from '../../services/agents/agents.service';
import { PropertiesService } from '../../services/properties/properties.service';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allProperties: any;
  allPropertiesTypes: any;
  stateNames: any;
  defaultImage: string = '../../../assets/img/property-1.jpg';
  listPrivateProperties: any = {};

  constructor( private _properties: PropertiesService,private _settings: SettingsService,private _agent: AgentsService,
          private _storage:StorageService, private _router: Router,private _propery: PropertiesService) { 
          this._properties.getProperties()?.subscribe({
            next: (res: any) => {
              console.log(res)
              this.allProperties=res;
            }
          })
          this._settings.getPropertyTypeAndCount()?.subscribe({
              next: (res: any) => {
                console.log(res)
                this.allPropertiesTypes=Object.values(res);
              }
            })
            
            this._settings.getSates()?.subscribe({
              next: (res: any) => {
                console.log(res[0].states)
                this.stateNames=res[0].states
              }
            })
            const getPPdata:any = {
              admin_approval:"approved",
              sale_type:"private"
            };
            this._properties.getPrivateProperties(getPPdata)?.subscribe({
            next: (res: any) => {
              console.log(res)
              this.listPrivateProperties=res;
            }
          })
    }

  ngOnInit(): void {
  }

  viewProperty(id: any) {
    console.log(id);
    const url = this._router.serializeUrl(
    this._router.createUrlTree(['/property-details', id])
  );
  window.open(url, '_blank');
  }
}

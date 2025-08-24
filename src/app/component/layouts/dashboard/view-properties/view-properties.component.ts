import { Component } from '@angular/core';
import { PropertiesService } from '../../../services/properties/properties.service'
import { Router } from '@angular/router';
import { StorageService } from 'src/app/component/agent/core/storage/storage.service';
@Component({
  selector: 'app-view-properties',
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.css']
})
export class ViewPropertiesComponent {
  allProperties:any;
  
  constructor(
    private _properties: PropertiesService,private router: Router, private _storage: StorageService
  ){
    const propertyPayload = {
      admin_approval:"approved",
      sale_type:"auction",
      postedBy: typeof this._storage.getLocalvalue('email') === 'string'
        ? (this._storage.getLocalvalue('email') as string).replace(/^["']|["']$/g, '')
        : ''
    }
    this._properties.getAuctionProperties(propertyPayload)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.allProperties=res;
          }
        })
  }

  ngOnInit() {
  }

  

  delProperty(id:String){
    this._properties.delProperty(id)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.allProperties=res;
            this.reloadComponent();
          }
        })
  }

  reloadComponent() {
  const currentUrl = this.router.url;
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
}

viewProperty(id:any){
    this._properties.getPropertyDetails(id)?.subscribe({
          next: (res: any) => {
            const url = this.router.serializeUrl(
            this.router.createUrlTree(['/property-details', id])
          );
          window.open(url, '_blank');
          }
        })
  }

  editProperty(id: String){
    this.router.navigate(['/dashboard/editproperties', id]);
  }
}

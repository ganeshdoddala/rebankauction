import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/component/agent/core/storage/storage.service';
import { AgentsService } from 'src/app/component/services/agents/agents.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent {
allAgents:any;
agentUploadRes:String | undefined;
addAgentRes:String | undefined;
addAgentblock:boolean = false;
viewAgentblock:boolean = true;
updateAgentblock:boolean = false
  constructor(
    private _agent: AgentsService,
    private _storage:StorageService,
    private router: Router
  ){
    this._agent.getAgents()?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.allAgents=res;
          }
        })
  }
 viewAgent(){
   this.addAgentblock = true;
   this.viewAgentblock = false;
   this.updateAgentblock = false;
 }

  cancel(){
    this.agentDetailsForm.reset();
  }

  agentDetailsForm = new FormGroup({
      agentName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      location: new FormControl('', Validators.required),
      password: new FormControl('')
    });

    editAgentDetailsForm = new FormGroup({
      id:new FormControl(''),
      agentName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      location: new FormControl('', Validators.required),
    });

    submitForm() {
      console.log(this.agentDetailsForm.value);
      var payload:any = this.agentDetailsForm.value;
      payload.createdBy = this._storage.getLocalvalue('user_type');
      console.log(payload)
      this._agent.postAgents(payload)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.addAgentRes=res.message;
          }
        })
    }

    editAgent(agentId: any) {
      this.addAgentblock = false;
      this.viewAgentblock = false;
      this.updateAgentblock = true;
      this._agent.getAgentsById(agentId)?.subscribe({
          next: (res: any) => {
            console.log(res)
            this.editAgentDetailsForm.patchValue({
              id:res._id,
              agentName:res.name,
              email: res.email,
              location: res.location,
            })
          }
        })
    }

    submitEditAgentForm(){
      console.log(this.editAgentDetailsForm.value)
      var payload:any = this.editAgentDetailsForm.value;
      payload.updatedBy = this._storage.getLocalvalue('user_type');
      this._agent.updateAgentsById(payload)?.subscribe({
          next: (res: any) => {
            this.addAgentRes=res.message;
            this.addAgentblock = false;
            this.viewAgentblock = true;
            this.updateAgentblock = false;
          }
        })
    }

  deleteAgent(id:String){
    console.log(id)
    this._agent.delAgent(id)?.subscribe({
          next: (res: any) => {
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
}

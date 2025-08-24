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
  updateAgentblock:boolean = false;
  isagentDetailsFormSubmitting:boolean = false;
  constructor(
    private _agent: AgentsService,
    private _storage:StorageService,
    private router: Router
  ){
    this.getAgents();
  }
  getAgents(){this._agent.getAgents()?.subscribe({
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

  cancel() {
    this.agentDetailsForm.reset();
    this.viewAgentblock = true;
    this.addAgentblock = false;
    this.updateAgentblock = false;
  }

  agentDetailsForm = new FormGroup({
      agentName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      location: new FormControl('', Validators.required),
    }
  );

    editAgentDetailsForm = new FormGroup({
      id:new FormControl(''),
      agentName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      location: new FormControl('', Validators.required),
    }
  );

    submitForm() {
      this.isagentDetailsFormSubmitting = true;
      console.log(this.agentDetailsForm.value);
      if (this.agentDetailsForm.invalid) {
        this.agentDetailsForm.markAllAsTouched();
        return;
      }

      const payload = {
        ...this.agentDetailsForm.value,
        createdBy: this._storage.getLocalvalue('user_type')
      };

      this._agent.postAgents(payload)?.subscribe({
        next: (res: any) => {
          console.log('Agent added:', res);
          this.addAgentRes = res.message;
          this.agentDetailsForm.reset();
          this.viewAgentblock = true;
          this.addAgentblock = false;
          this.isagentDetailsFormSubmitting = false;
          this.getAgents();
        },
        error: (err: any) => {
          console.error('Error adding agent:', err);
          this.addAgentRes = 'Something went wrong. Please try again.';
          this.isagentDetailsFormSubmitting = false;
        }
      });
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
            console.log(res)
            this.agentUploadRes=res.message;
            this.getAgents();
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

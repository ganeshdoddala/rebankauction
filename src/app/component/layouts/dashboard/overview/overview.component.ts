import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

// import 'bootstrap';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
   styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor(
  ) {
  }

  ngOnInit() {
    console.log("overview component")
  }
  
}

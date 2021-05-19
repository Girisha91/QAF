import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'work-order-form-general-info',
  templateUrl: './work-order-form.general.component.html',
  styleUrls: [('./work-order-form.general.component.css').toString()]
})

export class WorkOrderGeneralInfoComponent implements OnInit {

  environment: any = environment;
  wo:any;
  opr: any;
  ItemLocationList: any[];
  UserType: any[];
  ExchangeStatus: any[];
  UnitList: any[];
  SetType: any[];
  PriorityList: any[];
  ActNo: any[];
  NodeNo: any[];
  purchaseOrderList: any[];
  isTelephoneReadOnly : Boolean = false;
  Id:any;
  title:string;
  isReadOnly:Boolean = false;
  isUniqueValue: Boolean = false;
  errorTelephone_no:any;
  errorRequest_from:any;
  errorRequest_to:any;
  errorRequested_by:any;
  errorApproved_by:any;
  errorStore_demand_no:any;
  errorRecord_file_no:any;
  errorCable_no:any;
  currentLanguage:string;
  isLangArabic: Boolean= false;

  constructor(private cookieService: CookieService,private http:Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.wo = {};
 // giri commented 
    // distinguish between edit, view and add functionality 
    if(action == 'edit' && param ){
      this.title = 'Update wo';
      this.isReadOnly = false;
      this.Id = param;
      this.opr = 1;
      this.isUniqueValue=true;
      this.getGeneralInfo('edit');

    }else if(action== 'view' && param ){
      this.title = 'View wo';
      this.isReadOnly = true;
      this.Id = param;
      this.opr = 2;
      this.isUniqueValue=true;
      this.isTelephoneReadOnly = true;
      this.getGeneralInfo('view');
    }
    else {
      this.title = 'Add wo';
      this.isReadOnly = false;
      this.Id = param;
      this.opr = 0;
    }
    this.purchaseOrderList= [];
    this.ItemLocationList = [];

      this.SetType = [
        {
          label:'ANALOG',
          value:"ANALOG"
        },
        {
          label:"FAX",
          value:"FAX"
        },
        {
          label:"DIGITAL 4039",
          value:"DIGITAL 4039"
        },
        {
          label:"DIGITAL 8039",
          value:"DIGITAL 8039"
        },
        {
          label:"IP Touch 4039",
          value:"IP Touch 4039"
        },
        {
          label:"IP Touch 4068",
          value:"IP Touch 4068"
        },
        {
          label:"IP Touch 8082",
          value:"IP Touch 8082"
        },
        {
          label:"HOT-LINE",
          value:"HOT-LINE"
        }
      ];

    this.NodeNo = [
      {
        label:"Node 01",
        value:"Node 01"
      },
      {
        label:"Node 02",
        value:"Node 02"
      },
      {
        label:"Node 03",
        value:"Node 03"
      }
    ];
    this.ActNo = [
      {
        label:"ACT 0",
        value:"ACT 0"
      },
      {
        label:"ACT 1",
        value:"ACT 1"
      },
      {
        label:"ACT 2",
        value:"ACT 2"
      },
      {
        label:"ACT 3",
        value:"ACT 3"
      }
    ];

    this.UserType = [
      {
        label:"Officer",
        value:"Officer"
      },
      {
        label:"Non-Officer",
        value:"Non-Officer"
      }
    ];

    this.ExchangeStatus = [
      {
        label:"Active",
        value:"Active"
      },
      {
        label:"InActive",
        value:"InActive"
      }
    ];
   }

  ngOnInit() {
    // giri commented 
    // getting the values from cookie and storing it in user cookie variable 
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined"){
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if(userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1){

      }
    }else {
      this.router.navigate(['/login']);
    }

  }

  // giri commented 
  // to check wheather all the required feilds have valid data 
  // if there is an invalid data or any required field is left empty then it will throw error to user 
  // in html file 
  isModelValid(wo: any) {
    let isValid = true;

    this.errorTelephone_no ='';
    this.errorRequest_from ='';
    this.errorRequest_to ='';
    this.errorRequested_by ='';
    this.errorApproved_by ='';
    this.errorStore_demand_no ='';
    this.errorRecord_file_no ='';
    this.errorCable_no ='';


    
    if (Object.keys(wo).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

     if (Object.keys(wo).length && typeof wo.telephone_no == 'undefined') {
       this.errorTelephone_no = 'Telephone no is Required';
       isValid = false;
     }
    // if (Object.keys(wo).length && typeof wo.request_from  == 'undefined') {
    //   this.errorRequest_from = 'Requested from is Required';
    //   isValid = false;
    // }
    // if (Object.keys(wo).length && typeof wo.request_to == 'undefined') {
    //   this.errorRequest_to = 'Requested to is Required';
    //   isValid = false;
    // }

    // if (Object.keys(wo).length && typeof wo.requested_by == 'undefined') {
    //   this.errorRequested_by = 'Requested by is Required';
    //   isValid = false;
    // }
    // if (Object.keys(wo).length && typeof wo.approved_by == 'undefined') {
    //   this.errorApproved_by = 'Approved by is Required';
    //   isValid = false;
    // }

    // if (Object.keys(wo).length && typeof wo.store_demand_no == 'undefined') {
    //   this.errorStore_demand_no = 'Store demand no is Required';
    //   isValid = false;
    // }
    // if (Object.keys(wo).length && typeof wo.record_file_no == 'undefined') {
    //   this.errorRecord_file_no = 'Record file no is Required';
    //   isValid = false;
    // }
    // if (Object.keys(wo).length && typeof wo.cable_no == 'undefined') {
    //   this.errorCable_no = 'Cable no is Required';
    //   isValid = false;
    // }
    return isValid;
  }

// giri commented 
  // getting the value of selected row through api 
  getGeneralInfo(method: any) {

    let body = new URLSearchParams();
    body.append('action', 'getSingleRecord');
    body.append('table', 'wo_general_info');
    body.append('primary_key', 'id');
    body.append('primary_key_value', this.Id);
    this.http.post(environment.apikey + '/CrudApplication.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.wo = res;
          if (this.Id !=""){
          if (method === "add" || method === "edit"){
            this.isTelephoneReadOnly = true;
            this.wo = res;
          }
        }
        }
      }, error => {
        console.log(error.json());
      });
  }
   // giri commented 
  // adding the values to Exchange info table
  AddGeneralInfo(wo:any){
    let isModelValid = this.isModelValid(wo);
    if(!isModelValid){
      return ;
    }
    wo.status='active';
    let body = new URLSearchParams();
    body.append('action', 'add');
    body.append('table', 'wo_general_info');
    body.append('data', JSON.stringify(wo));
    this.http.post(environment.apikey + '/CrudApplication.php', body)
      .subscribe(data => {
        this.wo = data;
        this.closeAndRedirect();
      }, error => {
          console.log(error.json());
      });
  }

  // giri commented 
  // updating the values in Exchange info 
  UpdateGeneralInfo(wo: any) {

    let isModelValid = this.isModelValid(wo);
    if(!isModelValid){
      return ;
    }
    wo.status='active';
    let body = new URLSearchParams();
    body.append('action', 'update');
    body.append('table', 'wo_general_info');
    body.append('data', JSON.stringify(wo));
    body.append('primary_key', 'id');
    body.append('primary_key_value', wo.id);
    this.http.post(environment.apikey + '/CrudApplication.php', body)
      .subscribe(data => {
        data = data;
        this.closeAndRedirect();
      }, error => {
        console.log(error.json());
      });
    }
    
// giri commented 
// navigating back to work order landing page 
  closeAndRedirect(){
    this.router.navigate(['/workOrder']);
  }
}

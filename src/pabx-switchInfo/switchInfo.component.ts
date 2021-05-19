import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'pabx-switchInfo',
  templateUrl: './switchInfo.component.html',
  styleUrls: [('./switchInfo.component.css').toString()]
})
export class SwitchInfoComponent implements OnInit {

  environment: any = environment;
  sw:any;
  Id:any;
  title:string;
  isReadOnly:Boolean = false;
  opr:any;
  StatusList: any[];
  ServiceList: any[];
  CatList: any[];

  errorSiteName: string = '';
  errorLocation: string = '';
  errorSwitchName: string = '';
  errorTypeSwitch: string = '';
  errorVersion: string = '';
  errorModelNo: string = '';
  errorManagement: string = '';
  errorSerialNo: string = '';
  errorPartNo: string = '';
  errorSpoused: string = '';
  errorRemarks: string = '';
  errorStatus: string = '';

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.sw = {};

    this.StatusList = [
      {
        label:"OK",
        value:"OK"
      },{
        label:"Down",
        value:"Down"
      }
    ];

    /*this.CatList = [
      {
        label:"CAT1",
        value:"CAT1"
      },{
        label:"CAT2",
        value:"CAT2"
      },
      {
        label:"CAT3",
        value:"CAT3"
      }
    ];

    this.Location = [
      {
        label:"Loc 1",
        value:"Loc 1"
      },{
        label:"Loc 2",
        value:"Loc 2"
      },
      {
        label:"Loc 3",
        value:"Loc 3"
      }
    ];

    this.ServiceList = [
      {
        label:"GSM",
        value:"GSM"
      },{
        label:"Direct Line",
        value:"Direct Line"
      },
      {
        label:"Direct Line+ ADSL",
        value:"Direct Line+ ADSL"
      },
      {
        label:"IP VPN",
        value:"IP VPN"
      },{
        label:"INT VPN",
        value:"INT VPN"
      },
      {
        label:"ISDN PRI",
        value:"ISDN PRI"
      }
    ];*/

    if(action == 'edit' && param ){
      this.Id = param;
      this.title = 'Update Hardware Info';
      this.opr = 1;
      this.isReadOnly = false;
      this.getExternalData();
    }else if(action== 'view' && param ){
      this.Id = param;
      this.title = 'View Hardware Info';
      this.opr = 2;
      this.isReadOnly = true;
      this.getExternalData();
    }else {
      this.opr = 0;
      this.title = 'Add Hardware Info';
      this.isReadOnly = false;
    }
  }

  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

  getExternalData() {
    let body = new URLSearchParams();
    body.append('action', 'get_sw_data');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
    .map(res => res.json())
    .subscribe((res: any) => {
        if (!!res) {
          this.sw = res.data;
        }
      }, error => {
        console.log(error.json());
      });
  }

  isModelValid(sw: any) {

    let isValid = true;
    this.errorSiteName = '';
    this.errorLocation = '';
    this.errorSwitchName = '';
    this.errorTypeSwitch = '';
    this.errorVersion = '';
    this.errorModelNo = '';
    this.errorManagement = '';
    this.errorSerialNo = '';
    this.errorPartNo = '';
    this.errorSpoused = '';
    this.errorRemarks = '';
    this.errorStatus = '';

    if(Object.keys(sw).length == 0){
      alert('Please Fill all the required fields');
      return false;
    }

    if(Object.keys(sw).length && typeof sw.site_name == 'undefined'){
       this.errorSiteName = 'Site Name is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.location == 'undefined'){
       this.errorLocation= 'Location is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.switch_name == 'undefined'){
       this.errorSwitchName = 'Switch Name is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.type_switch == 'undefined'){
       this.errorTypeSwitch= 'Type Switch is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.sw_version == 'undefined'){
       this.errorVersion = 'Version is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.sw_model_no == 'undefined'){
       this.errorModelNo= 'Model No is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.management == 'undefined'){
       this.errorManagement = 'Management is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.serial_no == 'undefined'){
       this.errorSerialNo= 'Serial No is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.part_no == 'undefined'){
       this.errorPartNo = 'Part No is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.sdh_spo_used == 'undefined'){
       this.errorSpoused = 'SPO used is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.remarks == 'undefined'){
       this.errorRemarks = 'Remarks is Required';
       isValid =  false;
    }

    if(Object.keys(sw).length && typeof sw.status == 'undefined'){
       this.errorStatus = 'Status is Required';
       isValid =  false;
    }

    return isValid;
  }

  AddSW(sw:any){

    var isModelValid = this.isModelValid(sw);
    if(!isModelValid){
      return ;
    }

    let body = new URLSearchParams();
    body.append('action', 'addSwitchInfo');
    body.append('data',JSON.stringify(sw));

    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if(data.code == 100){
          //alert('Ex Order Created')
          this.closeAndRedirect();
        }else{
          alert(data.message);
        }
      }, error => {
          console.log(error.json());
      });
  }

  UpdateSW(sw:any){

    var isModelValid = this.isModelValid(sw);
    if(!isModelValid){
      return ;
    }

    let body = new URLSearchParams();
    body.append('data',JSON.stringify(sw));
    body.append('action','updateSwitchInfo');

    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {

        if(data.code == 100){
          //alert('Purchase Order Updated')
          this.closeAndRedirect();
        }else{
          alert(data.message);
        }
      }, error => {
          console.log(error.json());
      });
  }

  closeAndRedirect(){
    this.router.navigate(['/pabx/switch-info']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'pabx-configuration',
  templateUrl: './configurationInfo.component.html',
  styleUrls: [('./configurationInfo.component.css').toString()]
})
export class ConfigurationInfoComponent implements OnInit {

  environment: any = environment;
  ci:any;
  Id:any;
  title:string;
  isReadOnly:Boolean = false;
  opr:string = '0';
  StatusList: any[];
  // isLangArabic: Boolean = false;
  //ServiceList: any[];
  //CatList: any[];

  currentLanguage:string;

  errorSiteName: string = '';
  errorLocation: string = '';
  errorHostName: string = '';
  errorVlanId: string = '';
  errorVlanName: string = '';
  errorIpAddress: string = '';
  errorSubnetMask: string = '';
  errorAreaNo: string = '';
  errorRouterId: string = '';
  errorRemarks: string = '';
  errorStatus: string = '';

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.ci = {};

    if(action == 'edit' && param ){
      this.Id = param;
      this.title = 'Update Software Info';
      this.opr = '1';
      this.isReadOnly = false;
      this.getExternalData();
    }else if(action== 'view' && param ){
      this.Id = param;
      this.title = 'View Software Info';
      this.opr = '2';
      this.isReadOnly = true;
      this.getExternalData();
    }else {
      this.opr = '0';
      this.title = 'Add Software Info';
      this.isReadOnly = false;
    }

    this.StatusList = [
      {
        label:"In Service",
        value:"In Service"
      },{
        label:"Down",
        value:"Down"
      },
      {
        label:"Disabled",
        value:"Disabled"
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
    body.append('action', 'get_cg_data');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
    .map(res => res.json())
    .subscribe((res: any) => {
        if (!!res) {
          this.ci = res.data;
        }
      }, error => {
        console.log(error.json());
      });
  }

  isModelValid(ci: any){

    let isValid = true;
    this.errorSiteName = '';
    this.errorLocation = '';
    this.errorHostName = '';
    this.errorVlanId = '';
    this.errorVlanName = '';
    this.errorIpAddress = '';
    this.errorSubnetMask = '';
    this.errorAreaNo = '';
    this.errorRouterId = '';
    this.errorRemarks = '';
    this.errorStatus = '';

    if(Object.keys(ci).length == 0){
      alert('Please Fill all the required fields');
      return false;
    }

    if(Object.keys(ci).length && typeof ci.site_name == 'undefined'){
       this.errorSiteName = 'Site Name is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.location == 'undefined'){
       this.errorLocation= 'Location is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.host_name == 'undefined'){
       this.errorHostName = 'Host Name is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.location == 'undefined'){
       this.errorVlanId= 'Vlan ID is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.vlan_name == 'undefined'){
       this.errorVlanName = 'Vlan Name is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.ip_address == 'undefined'){
       this.errorIpAddress= 'Ip Address is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.subnet_mask == 'undefined'){
       this.errorSubnetMask = 'Subnet mask is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.area_no == 'undefined'){
       this.errorAreaNo= 'Area No is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.router_id == 'undefined'){
       this.errorRouterId = 'Router Id is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.remarks == 'undefined'){
       this.errorRemarks = 'Remarks is Required';
       isValid =  false;
    }

    if(Object.keys(ci).length && typeof ci.status == 'undefined'){
       this.errorStatus = 'Status is Required';
       isValid =  false;
    }

    return isValid;
  }

  AddCI(ci:any){

    var isModelValid = this.isModelValid(ci);
    if(!isModelValid){
      return ;
    }

    let body = new URLSearchParams();
    body.append('action', 'addConfigurationInfo');
    body.append('data',JSON.stringify(ci));

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

  UpdateCI(ci:any){

    var isModelValid = this.isModelValid(ci);
    if(!isModelValid){
      return ;
    }

    let body = new URLSearchParams();
    body.append('data',JSON.stringify(ci));
    body.append('action','updateConfigurationInfo');

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
    this.router.navigate(['/pabx/configuration-info']);
  }
}

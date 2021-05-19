import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';


declare var $: any;

@Component({
  selector: 'externalLines',
  templateUrl: './externalLines.component.html',
  styleUrls: [('./externalLines.component.css').toString()]
})


export class ExternalLinesComponent implements OnInit {
  environment: any = environment;
  el: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  opr: any;
  StatusList: any[];
  ServiceList: any[];
  CatList: any[];
  Location: any[];
  rent_items: any[];
showtable: boolean = false;
  distributionList : any[]= [];
  distributionListArabic : any[]= [];
  distributionUnit : any[]= [];
  distributionUnitArabic : any[]= [];

  errorCategory: string = '';
  errorAccountNo: string = '';
  errorTelephone: string = '';
  errorOreCuscNo: string = '';
  errorAuthority: string = '';
  errorDateIns: string = '';
  errorDistMenu: string = '';
  errorDistUnit: string = '';
  errorLocation: string = '';
  errorRef: string = '';
  errorUsername: string = '';
  errorTypeService: string = '';
  errorCustomerName: string = '';
  errorMdfInfo: string = '';
  errorDpInfo: string = '';
  errorConnectedWallSocketInfo: string = '';
  errorDidNumberRange: string = '';
  errorPackage: string = '';
  errorStatus: string = '';


  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.el = {};

    this.getDistributionList();
    this.StatusList = [
      {
        label: "Active",
        value: "Active"
      }, {
        label: "Pending",
        value: "Pending"
      },
      {
        label: "Done",
        value: "Done"
      }
    ];

    this.CatList = [
      {
        label: "CAT-1",
        value: "CAT-1"
      }, {
        label: "CAT-2",
        value: "CAT-2"
      },
      {
        label: "CAT-3",
        value: "CAT-3"
      }
    ];

    this.Location = [
      {
        label: "Loc 1",
        value: "Loc 1"
      }, {
        label: "Loc 2",
        value: "Loc 2"
      },
      {
        label: "Loc 3",
        value: "Loc 3"
      }
    ];

    this.ServiceList = [
      {
        label: "GSM",
        value: "GSM"
      }, {
        label: "Direct Line",
        value: "Direct Line"
      },
      {
        label: "Direct Line+ ADSL",
        value: "Direct Line+ ADSL"
      },
      {
        label: "IP VPN",
        value: "IP VPN"
      }, {
        label: "INT VPN",
        value: "INT VPN"
      },
      {
        label: "ISDN PRI",
        value: "ISDN PRI"
      },
      {
        label: "Broadband",
        value: "Broadband"
      },
      {
        label: "GSM-Encryption",
        value: "GSM-Encryption"
      },
      {
        label: "Intelligence",
        value: "Intelligence"
      }
    ];

    if (action == 'edit' && param) {
      this.Id = param;
      this.title = 'تحديث الخطوط الخارجية';
      this.opr = 1;
      this.isReadOnly = false;
      this.getExternalData('edit');
    } else if (action == 'view' && param) {
      this.Id = param;
      this.title = 'عرض الخطوط الخارجية';
      this.opr = 2;
      this.isReadOnly = true;
      this.getExternalData('view');
      
    } else {
      this.opr = 0;
      this.title = 'إضافة خطوط خارجية';
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

  getExternalData(method: any) {
    let body = new URLSearchParams();
    body.append('action', 'get_el_data');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.el = res.data;
          this.onChange(this.el.Distribution_Menu,'ar');
          if (method == 'view') {
            let body = new URLSearchParams();
            body.append('action', "externalLinesListRents");
            body.append('telephone_no', this.el.telephone_no);

            this.http.post(environment.apikey + '/generateJsonUrl.php', body)
              .map(res => res.json())
              .subscribe((res: any) => {
                if (res.code == 100) {
                  this.rent_items = res.data;
                  this.showtable = true;
                } else {
                  this.rent_items = [];
                }
              });
          }
        }
      }, error => {
        console.log(error.json());
      });

  }

  isModelValid(el: any) {
    let isValid = true;
    this.errorCategory = '';
    this.errorAccountNo = '';
    this.errorTelephone = '';
    this.errorOreCuscNo = '';
    this.errorAuthority = '';
    this.errorDateIns = '';
    this.errorDistMenu= '';
    this.errorDistUnit= '';
    this.errorLocation = '';
    this.errorRef = '';
    this.errorUsername = '';
    this.errorTypeService = '';
    this.errorCustomerName = '';
    this.errorDidNumberRange = '';
    this.errorPackage = '';
    this.errorStatus = '';
    this.errorDpInfo = '';
    this.errorConnectedWallSocketInfo = '';
    this.errorMdfInfo = '';


    if (Object.keys(el).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    // if (Object.keys(el).length && typeof el.category == 'undefined') {
    //   this.errorCategory = 'Category is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.account_no == 'undefined') {
    //   this.errorAccountNo = 'Account No is Required';
    //   isValid = false;
    // }

    if (Object.keys(el).length && typeof el.telephone_no == 'undefined') {
      this.errorTelephone = 'Telephone is Required';
      isValid = false;
    }

    // if (Object.keys(el).length && typeof el.Ooredoo_Customer_no == 'undefined') {
    //   this.errorOreCuscNo = 'Ooredoo Customer no is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.authority == 'undefined') {
    //   this.errorAuthority = 'Authority is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.date_installation == 'undefined') {
    //   this.errorDateIns = 'Date Installation is Required';
    //   isValid = false;
    // }
    // if (Object.keys(el).length && typeof el.Distribution_Menu == 'undefined') {
    //   this.errorDistMenu = 'Distribution menu is Required';
    //   isValid = false;
    // }
    // if (Object.keys(el).length && typeof el.Distribution_Unit == 'undefined') {
    //   this.errorDistUnit = 'Distribution unit is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.location == 'undefined') {
    //   this.errorLocation = 'Location is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.request_refe_no == 'undefined') {
    //   this.errorRef = ' Request Reference is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.username == 'undefined') {
    //   this.errorUsername = 'User Name is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.type_service == 'undefined') {
    //   this.errorTypeService = 'Type Service is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.customer_name == 'undefined') {
    //   this.errorCustomerName = 'Customer Name is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.did_number_range == 'undefined') {
    //   this.errorDidNumberRange = 'DID Number Range is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.package == 'undefined') {
    //   this.errorPackage = 'Package  is Required';
    //   isValid = false;
    // }
    // if (Object.keys(el).length && typeof el.mdf_info == 'undefined') {
    //   this.errorMdfInfo = 'mdf info is Required';
    //   isValid = false;
    // }
    // if (Object.keys(el).length && typeof el.dp_info == 'undefined') {
    //   this.errorDpInfo = 'dp info is Required';
    //   isValid = false;
    // }
    // if (Object.keys(el).length && typeof el.connected_wall_socket_info == 'undefined') {
    //   this.errorConnectedWallSocketInfo = 'connected wall socket info is Required';
    //   isValid = false;
    // }

    // if (Object.keys(el).length && typeof el.status == 'undefined') {
    //   this.errorStatus = 'Status is Required';
    //   isValid = false;
    // }

    return isValid;
  }

  getDistributionList(){
    this.http.get(environment.apikey+"/masterData.php?oper=getDistributionList&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.distributionList.push(data[item].name);
          this.distributionListArabic.push(data[item].nameArabic);
     }
            }
    });
  }

  

  getDistributionUnit(Id:any,lang:any){
    this.distributionUnit = [];
    this.distributionUnitArabic = [];
    this.http.get(environment.apikey+"/masterData.php?oper=getDistributionUnitList&language="+ lang+"&id="+encodeURI(Id))
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        data.sort((a: any,b: any) => a.unit_order - b.unit_order );
        for(var item in data){
          this.distributionUnit.push(data[item].name);
          this.distributionUnitArabic.push(data[item].nameArabic);
     }
            }
    });
  }

  onChange(id:any,lang:any){
    this.getDistributionUnit(id,lang);
  }

  AddEL(el: any) {
    var isModelValid = this.isModelValid(el);
    if (!isModelValid) {
      return;
    }
    el.date_installation = $('#date_installation').val();
    
    let body = new URLSearchParams();
    body.append('action', 'addExternalLines');
    body.append('data', JSON.stringify(el));

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          //alert('Ex Order Created')
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  UpdateEL(el: any) {

    var isModelValid = this.isModelValid(el);
    if (!isModelValid) {
      return;
    }
   
    el.date_installation = $('#date_installation').val();

    let body = new URLSearchParams();
    body.append('data', JSON.stringify(el));
    body.append('action', 'updateExternalLines');

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {

        if (data.code == 100) {
          //alert('Purchase Order Updated')
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  closeAndRedirect() {
    this.router.navigate(['/pabx/external-lines']);
  }
}

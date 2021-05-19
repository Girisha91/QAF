import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'supplier',
  templateUrl: './supplier.component.html',
  styleUrls: [('./supplier.component.css').toString()]
})
export class SupplierComponent implements OnInit {
  environment: any = environment;
  ss: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  opr: any;
  backButton:any;
  Action: any;
  statusList: any[];
  userPermissionInfo: any;
  userRoleName: any;
  // ServiceList: any[];
  // CatList: any[];
  // Location: any[];
  // rent_items: any[];

  // distributionList : any[]= [];
  // distributionListArabic : any[]= [];
  // distributionUnit : any[]= [];
  // distributionUnitArabic : any[]= [];

  errorSup_bus_name: string = '';
  errorSup_ref_name: string = '';
  errorContact_person_name1: string = '';
  errorAddress1: string = '';
  errorCountry: string = '';
  errorContact_person_name2: string = '';
  errorAddress2: string = '';
  errorPo_box_no: string = '';
  errorTelephone1: string = '';
  errorTelephone2: string = '';
  errorTelephone3: string = '';
  errorFax_no_1: string = '';
  errorFax_no_2: string = '';
  errorFax_no_3: string = '';
  errorEmail1: string = '';
  errorEmail2: string = '';
  errorWebsite: string = '';
  errorDescriptions: string = '';
  errorStatus: string = '';
  redirectToMateraialAdd:any;

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private _localStorageService: LocalStorageService ,private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.ss = {};
    if (action == 'edit' && param) {
      this.Id = param;
      this.title = 'Update supplier';
      this.opr = 1;
      this.isReadOnly = false;
      this.getSupplierData('edit');
    } else if (action == 'view' && param) {
      this.Id = param;
      this.title = 'View supplier';
      this.opr = 2;
      this.isReadOnly = true;
      this.getSupplierData('view');

    } else if (action == 'add') {
      this.opr = 0;
      this.title = 'Add supplier';
      this.isReadOnly = false;
    }else if (action == 'redirectToPo') {
      this.backButton = 0;
      this.title = 'Add supplier';
      this.isReadOnly = false;
      this.Action = action;
    } else if (action == 'redirectToMateraialAdd') {
      this.Action = action;
      this.redirectToMateraialAdd = 0;
    }

    this.statusList = [
      {
        label: "Active",
        value: "1"
      },
      {
        label: "Inactive",
        value: "0"
      }
    ];
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

  getSupplierData(method: any) {
    let body = new URLSearchParams();
    body.append('action', 'get_supplier_data');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.ss = res.data;
        }
      }, error => {
        console.log(error.json());
      });
  }

 

  isModelValid(ss: any) {
    let isValid = true;
    this.errorSup_bus_name = '';
    this.errorSup_ref_name = '';
    this.errorContact_person_name1 = '';
    this.errorAddress1 = '';
    this.errorCountry = '';
    // this.errorContact_person_name2 = '';
    // this.errorAddress2 = '';
    this.errorPo_box_no = '';
    this.errorTelephone1 = '';
    // this.errorTelephone2 = '';
    // this.errorTelephone3 = '';
    this.errorFax_no_1 = '';
    // this.errorFax_no_2 = '';
    // this.errorFax_no_3 = '';
    this.errorEmail1 = '';
    // this.errorEmail2 = '';
    this.errorWebsite = '';
    this.errorDescriptions = '';
    this.errorStatus = '';
    if (Object.keys(ss).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(ss).length && typeof ss.sup_bus_name == 'undefined') {
      this.errorSup_bus_name = 'Sup Bus Name is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.sup_ref_name == 'undefined') {
      this.errorSup_ref_name = 'Sup Ref Name is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.contact_person_name1 == 'undefined') {
      this.errorContact_person_name1 = 'Contact Person Name 1 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.address1 == 'undefined') {
      this.errorAddress1 = 'Address 1 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.country == 'undefined') {
      this.errorCountry = 'Country is Required';
      isValid = false;
    }

    // if (Object.keys(ss).length && typeof ss.contact_person_name2 == 'undefined') {
    //   this.errorContact_person_name2 = 'Contact person name 2 is Required';
    //   isValid = false;
    // }
    // if (Object.keys(ss).length && typeof ss.address2 == 'undefined') {
    //   this.errorAddress2 = 'Address 2 is Required';
    //   isValid = false;
    // }
    if (Object.keys(ss).length && typeof ss.po_box_no == 'undefined') {
      this.errorPo_box_no = 'Po Box No is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.telephone1 == 'undefined') {
      this.errorTelephone1 = 'Telephone 1 is Required';
      isValid = false;
    }

    // if (Object.keys(ss).length && typeof ss.telephone2 == 'undefined') {
    //   this.errorTelephone2 = ' Telephone 2 is Required';
    //   isValid = false;
    // }

    // if (Object.keys(ss).length && typeof ss.telephone3 == 'undefined') {
    //   this.errorTelephone3 = 'Telephone 3 is Required';
    //   isValid = false;
    // }

    if (Object.keys(ss).length && typeof ss.fax_no_1 == 'undefined') {
      this.errorFax_no_1 = 'Fax No 1 is Required';
      isValid = false;
    }

    // if (Object.keys(ss).length && typeof ss.fax_no_2 == 'undefined') {
    //   this.errorFax_no_2 = 'fax no 2 is Required';
    //   isValid = false;
    // }

    // if (Object.keys(ss).length && typeof ss.fax_no_3 == 'undefined') {
    //   this.errorFax_no_3 = 'Fax no 3 is Required';
    //   isValid = false;
    // }

    if (Object.keys(ss).length && typeof ss.email1 == 'undefined') {
      this.errorEmail1 = 'Email 1  is Required';
      isValid = false;
    } 
    if(ss.email1.length >= 1){
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(ss.email1)){
      }else {
        this.errorEmail1 = 'Please Enter Valid E-mail-id'
        isValid = false;
      }
    }
    // if (Object.keys(ss).length && typeof ss.email2 == 'undefined') {
    //   this.errorEmail2 = 'Email 2 is Required';
    //   isValid = false;
    // }
    if (Object.keys(ss).length && typeof ss.website == 'undefined') {
      this.errorWebsite = 'Website is Required';
      isValid = false;
    }
    if (Object.keys(ss).length && typeof ss.descriptions == 'undefined') {
      this.errorDescriptions = 'Descriptions is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.status == 'undefined') {
      this.errorStatus = 'Status is Required';
      isValid = false;
    }

    return isValid;
  }

  AddSS(ss: any) {
    let isModelValid = this.isModelValid(ss);
    if (!isModelValid) {
      return;
    }
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    ss.username = userRoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('action', 'addSupplier');
    body.append('data', JSON.stringify(ss));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          //alert('Ex Order Created')
          if (this.Action == 'redirectToPo'){
            this.closeAndRedirectToPo();
          } else if(this.Action == 'redirectToMateraialAdd'){
            this.closeAndRedirectToMaterial();
          } else{
            this.closeAndRedirect();
          }
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  UpdateSS(ss: any) {

    let isModelValid = this.isModelValid(ss);
    if (!isModelValid) {
      return;
    }
    // this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    // let userPermissionDataInfo = this.userPermissionInfo;
    // let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    // ss.username = userRoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('data', JSON.stringify(ss));
    body.append('action', 'updateSupplier');
    body.append('sessionId', userCookie.sessionId);
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
    this.router.navigate(['/store/supplier']);
  }
  closeAndRedirectToPo() {
    this.router.navigate(['/store/purchase-order/add']);
  }
  closeAndRedirectToMaterial() {
    this.router.navigate(['/StoreMaterialForm/add']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'StoreMaterialForm',
  templateUrl: './store-material.component.html',
  styleUrls: [('./store-material.component.css').toString()]
})
export class StoreMaterialFormComponent implements OnInit {
  environment: any = environment;
  sm: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  isUpdateReadOnly : Boolean = false;
  opr: any;
  backButton: any;
  Action: any;
  selectedFile: File;
  materialCatList: any[];
  suprefnameList: any[];
  DepartmentList: any[];
  userPermissionInfo: any;
  userRoleName: any;
  errorItemName: string = '';
  errorWarranty: string = '';
  errorItemNo: string = '';
  errorPartNo: string = '';
  errorDescription: string = '';
  errorDept: string = '';
  errorManuf: string = '';
  errorVendor: string = '';
  errorSup_ref_name: string = '';
  errorCategory: string = '';
  errorReorderQty: string = '';
  errorImage: string = '';
  response: any;


  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private _localStorageService: LocalStorageService, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];

    this.sm = {};
    if (action == 'edit' && param) {
      this.opr = 1;
      this.Id = param;
      this.title = 'Update Material';
      this.isReadOnly = false;
      this.isUpdateReadOnly = true;
      this.loadData('edit');
    } else if (action == 'view' && param) {
      this.opr = 2;
      this.Id = param;
      // alert(this.Id);
      this.title = 'View Material';
      this.isReadOnly = true;
      this.loadData('view');
    }

    // } else {
    //   this.opr = 0;
    //   this.title = 'Add Material';
    //   this.isReadOnly = false;
    // }
    else if (action == 'add') {
      this.opr = 0;
      this.title = 'Add Material';
      this.isReadOnly = false;
    } else if (action == 'redirectToPo') {
      this.backButton = 0;
      this.title = 'Add Material';
      this.isReadOnly = false;
      this.Action = action;
    }
    this.materialCatList = [
      {
        value: "0",
        label: "Controllable"

      },
      {
        value: "1",
        label: "Non-Controllable"

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
    this.getSupplierList();
    this.getDepartmentList();
  }

  loadData(sm: any) {

    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('sessionId', userCookie.sessionId);
    body.append('action', 'get_store_material');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.sm = res.data;
        }
      }, error => {
        console.log(error.json());
      });
  }

  getDepartmentList() {
    let body = new URLSearchParams();
    body.append('action', 'getDepartmentList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.DepartmentList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }


  valuedd(event: any) {
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0]
    const uploadData = new FormData();
    uploadData.append('action', "ItemPic");
    uploadData.append('ItemPic', this.selectedFile, this.selectedFile.name);
    let headers = new Headers()  
		let options = new RequestOptions({ headers: headers });  
          this.http.post(environment.apikey + "/generateJsonUrl.php", uploadData, options)
        .map(res => res.json())
        .subscribe(dataRes => {
          let ItemPicPath = environment.apikey + dataRes.data;
       //   console.log(ItemPicPath);
          this.sm['itempic'] = ItemPicPath;
        }, error => {
          console.log(error.json());
        });
  }

  isModelValid(StoreMaterial: any) {
    let isValid = true;
    this.errorItemName = '';
    this.errorItemNo = '';
    this.errorPartNo = '';
    this.errorWarranty ='';
    this.errorDescription = '';
    this.errorDept = '';
    this.errorManuf = '';
    this.errorVendor = '';
    this.errorSup_ref_name = '';
    this.errorCategory = '';
    this.errorReorderQty = '';
    this.errorImage = '';
    if (Object.keys(StoreMaterial).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.item_name == 'undefined') {
      this.errorItemName = 'Item Name is Required';
      isValid = false;
    }

    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.item_no == 'undefined') {
      this.errorItemNo = 'Item No is Required';
      isValid = false;
    }

    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.part_no == 'undefined') {
      this.errorPartNo = 'Part No is Required';
      isValid = false;
    }

    // if (Object.keys(StoreMaterial).length && typeof StoreMaterial.description == 'undefined') {
    //   this.errorDescription = 'Description  is Required';
    //   isValid = false;
    // }

    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.department == 'undefined') {
      this.errorDept = 'Department is Required';
      isValid = false;
    }

    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.manufacture == 'undefined') {
      this.errorManuf = 'Manufature is Required';
      isValid = false;
    }
    // if (Object.keys(StoreMaterial).length && typeof StoreMaterial.vendor == 'undefined') {
    //   this.errorVendor = 'Vendor is Required';
    //   isValid = false;
    // }
    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.supplier_id == 'undefined') {
      this.errorSup_ref_name = 'Supplier Ref Name is Required';
      isValid = false;
    }
    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.category == 'undefined') {
      this.errorCategory = 'Category is Required';
      isValid = false;
    }
    if (Object.keys(StoreMaterial).length && typeof StoreMaterial.reorder_qty == 'undefined') {
      this.errorReorderQty = 'Reorder qty is Required';
      isValid = false;
    }

    // if (Object.keys(StoreMaterial).length && typeof StoreMaterial.itempic == 'undefined') {
    //   this.errorImage = ' Image is Required';
    //   isValid = false;
    // }
    return isValid;
  }
  AddStoreMaterial(StoreMaterial: any) {
    var isModelValid = this.isModelValid(StoreMaterial);
    if (!isModelValid) {
      return;
    }
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('action', "addStoreMaterial");
    body.append('data', JSON.stringify(StoreMaterial));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((res: any) => {
        this.response = JSON.parse(res._body);
        if (this.response.code == 100) {
          if (this.Action == 'redirectToPo') {
            this.closeAndRedirectToPo();
          } else {
            this.closeAndRedirect();
          }
        } else {
           alert("there is a " + " "+this.response.message);
          // alert(res._body.message);
        }
      },error => {
        console.log(error.json());
      });
  }

  addSupplier($event: any, redirectToMateraialAdd: any) {
    if ($event.target.value == '') {
      this.router.navigate(['/store/supplier/', redirectToMateraialAdd]);
    }
  }

  getSupplierList() {
    let body = new URLSearchParams();
    body.append('action', 'getSupplierList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.suprefnameList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }

  UpdateStoreMaterial(StoreMaterial: any) {
    var isModelValid = this.isModelValid(StoreMaterial);
    if (!isModelValid) {
      return;
    }
    delete StoreMaterial["supplierName"];
    delete StoreMaterial["hideInnerEmpRow"];
    delete StoreMaterial["highLightRow1"];
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('action', "updateStoreMaterial");
    body.append('data', JSON.stringify(StoreMaterial));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          this.closeAndRedirect();
        } else {
          alert(res.message);
        }
      }, error => {
        console.log(error.json());
      });
  }


  closeAndRedirect() {
    this.router.navigate(['/StoreItemList']);
  }
  closeAndRedirectToPo() {
    this.router.navigate(['/store/purchase-order/add']);
  }
}

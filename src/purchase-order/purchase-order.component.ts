import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from 'angular-2-local-storage';
declare var $: any;
@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: [('./purchase-order.component.css').toString()]
})
export class PurchaseOrderComponent implements OnInit {

  private fieldArray: Array<any> = [];
  private newAttribute: any = {};
  orderForm: FormGroup;
  items: FormArray;
  environment: any = environment;
  po: any;
  CategoryList: any[];
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  itemIsReadOnly: Boolean = false;
  errorPurchase_order_no: any;
  errorSup_ref_name: any;
  errorDepartment: any;
  errorDelivery_note_no: any;
  errorSup_ord_ref_no: any;
  userPermissionInfo: any;
  errorVendor_name: any;
  errorQAF_ord_ref_no: any;
  errorDelivery_date: any;
  errorRequested_by: any;
  errorDescription: any;
  countEmpty: number;
  currentLanguage: string;
  isLangArabic: Boolean = false;



  ItemLocationList: any[];
  MethodList: any[];
  UnitList: any[];
  DepartmentList: any[];
  PriorityList: any[];
  ItemStatusList: any[];
  CurrencyList: any[];
  suprefnameList: any[];
  store_items: any[];
  materialList: any[];
  materialData: any[];
  replacematerialData: any[];
  itemlist: any[];
  date: any;
opr: any;
  constructor(private cookieService: CookieService, private formBuilder: FormBuilder, private _localStorageService: LocalStorageService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.po = {};

    this.CategoryList = [
      {
        CategoryLabel: "Controlled",
        value: "1"
      },
      {
        CategoryLabel: "UnControlled",
        value: "0"
      }
    ];

    this.getSupplierList();
    this.getMaterailList();
    this.getDepartmentList();
    if (action == 'edit' && param) {
      this.Id = param;
      this.opr = 1;
      this.title = 'Update Order';
      this.isReadOnly = false;
      this.itemIsReadOnly = false;
      this.getOrderData();
    } else if (action == 'view' && param) {
      this.opr = 2;
      this.Id = param;
      this.title = 'View Order';
      this.isReadOnly = true;
      this.itemIsReadOnly = true;
      this.getOrderData();
    } else {
      this.opr = 0;
      this.title = 'Add Order';
      this.isReadOnly = false;
      this.itemIsReadOnly = false;
    }
  }

  ngOnInit() {
    this.po.department = "Select a Department";
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      let today = new Date();
      this.date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
      this.po.delivery_date = this.date;
    } else {
      this.router.navigate(['/login']);
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
  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
  }

  deleteFieldValue(index: any) {
    this.fieldArray.splice(index, 1);
  }

  getMaterailList() {
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }
  addMaterial(redirectToPo: any) {
    console.log('value of addMaterial is',redirectToPo);
    this.router.navigate(['/StoreMaterialForm', redirectToPo]);
  }
  changeItemList(event: any, i: any) {
    let material_id = event.label.material_id;
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialData = res;
          for (let itemname in this.materialData) {
            if (this.materialData[itemname].material_id == material_id) {
              var object = {
                material_id: "",
                label: "",
                part_no: "",
                item_no: "",
                description: "",
                department: "",
                category: "",
                expireDate:"",
                quantity: ""
              };
              object.material_id = this.materialData[itemname].material_id;
              object.label = this.materialData[itemname].label;
              object.part_no = this.materialData[itemname].part_no;
              object.item_no = this.materialData[itemname].item_no;
              object.description = this.materialData[itemname].description;
              object.department = this.materialData[itemname].department;
              object.category = this.materialData[itemname].category;
              object.expireDate = this.materialData[itemname].expireDate;
              object.quantity = "";
              this.fieldArray.splice(i, 1, object);
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }
  getItemList(event: any) {
    let value = event.target.value;
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialData = res;
          for (let itemname in this.materialData) {
            if (this.materialData[itemname].value == value) {
              this.fieldArray.push(this.materialData[itemname]);
            }
          }
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


  getOrderData() {
    let body = new URLSearchParams();
    body.append('action', 'get_purchase_order');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.po = res.data;
          for (let item in this.po.store_item) {
            this.po.store_item[item].label = this.po.store_item[item].item_name;
            this.fieldArray.push(this.po.store_item[item]);
          }
        }
      }, error => {
        console.log(error.json());
      });
  }

  isModelValid(po: any) {
    let isValid = true;
    this.errorPurchase_order_no = '';
    this.errorSup_ref_name = '';
    this.errorDepartment = '';
    this.errorDelivery_note_no = '';
    this.errorSup_ord_ref_no = '';
    this.errorVendor_name = '';
    this.errorQAF_ord_ref_no = '';
    this.errorDelivery_date = '';
    this.errorRequested_by = '';
    this.errorDescription = '';

    if (Object.keys(po).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(po).length && typeof po.purchase_order_no == 'undefined') {
      this.errorPurchase_order_no = 'Purchase Order No is Required';
      isValid = false;
    }

    if (Object.keys(po).length && typeof po.sup_ref_name == 'undefined') {
      this.errorSup_ref_name = ' Supplier Reference Name is Required';
      isValid = false;
    }

    if ((Object.keys(po).length && typeof po.department == 'undefined') || (po.department == 'Select a Department')|| (po.department == 'Select Department')){
      this.errorDepartment = 'Department is Required';
      isValid = false;
    }

    if (Object.keys(po).length && typeof po.delivery_note_no == 'undefined') {
      this.errorDelivery_note_no = 'Delivery Note No is Required';
      isValid = false;
    }

    // if (Object.keys(po).length && typeof po.sup_ord_ref_no == 'undefined') {
    //   this.errorSup_ord_ref_no = ' Supplier Order Reference No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(po).length && typeof po.vendor_name == 'undefined') {
    //   this.errorVendor_name = 'Vendor Name is Required';
    //   isValid = false;
    // }
    // if (Object.keys(po).length && typeof po.QAF_ord_ref_no == 'undefined') {
    //   this.errorQAF_ord_ref_no = 'QAF Order Reference No is Required';
    //   isValid = false;
    // }
    // if (Object.keys(po).length && typeof po.delivery_date == 'undefined') {
    //   this.errorDelivery_date = ' Delivery date is Required';
    //   isValid = false;
    // }

    // if (Object.keys(po).length && typeof po.requested_by == 'undefined') {
    //   this.errorRequested_by = 'Requested by is Required';
    //   isValid = false;
    // }

    // if (Object.keys(po).length && typeof po.description == 'undefined') {
    //   this.errorDescription = ' Description of purchase is Required';
    //   isValid = false;
    // }
    return isValid;
  }

  AddPO(po: any) {
    // this.po.sup_ref_name = po.sup_ref_name.label;
    // console.log(po);
    console.log("value of po is",po)
    var isModelValid = this.isModelValid(po);
    if (!isModelValid) {
      return;
    }
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    po.userName = userRoleName;
    po.delivery_date = $('#delivery_date').val();
    po.store_item = this.fieldArray;
    if (po.store_item.length == 0) {
      alert("please add material");
    } else {
      let countValidate: number = 0;
      for (let k = 0; k < this.fieldArray.length; k++) {
        if ((this.fieldArray[k].quantity == undefined) || (this.fieldArray[k].quantity == "")) {
          countValidate++;
        }
        this.countEmpty = countValidate;
      }
      if (this.countEmpty >= 1) {
        alert("please enter quantity required");
      }
      else {
        let body = new URLSearchParams();
        body.append('action', 'addStorePO');
        body.append('data', JSON.stringify(po));
        body.append('sessionId', userCookie.sessionId);
        this.http.post(environment.apikey + '/generateJsonUrl.php', body)
          .map(res => res.json())
          .subscribe(data => {
            if (data.code == 100) {
              alert('Purchase Order Created');
              this.closeAndRedirect();
            } else {
              alert("there is a " + " " + data.message);
            }
          }, error => {
            console.log(error.json());
          });
      }
    }
  }

  UpdatePO(po: any) {

    var isModelValid = this.isModelValid(po);
    if (!isModelValid) {
      return;
    }
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    //  po.userName = userRoleName;
    po.delivery_date = $('#delivery_date').val();
    let body = new URLSearchParams();
    body.append('data', JSON.stringify(po));
    body.append('action', 'updateStorePO');
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          alert('Purchase Order Updated')
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }
  addSupplier(redirectToPo: any) {
    this.router.navigate(['/store/supplier', redirectToPo]);
  }
  closeAndRedirect() {
    this.router.navigate(['/store']);
  }
  ViewPO(id: string) {
    this.router.navigate(['/store/purchase-order/view/' + id]);
  }
  AddItem(id: string) {
    this.router.navigate(['/store/purchase-item/add/' + id]);
  }
}

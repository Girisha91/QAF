import { Pipe } from '@angular/core';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUtil } from '../app/file.util';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { Constants } from '../app/csv.constants';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderrByPipe } from '../app/orderBy.pipe';
import { StoreSearchPipe } from '../app/storepipes/store.pipe';
import { FilterPipe } from '../app/genericSearch.pipe';

Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'StoreItemList',
  templateUrl: './store-itemList.component.html',
  styleUrls: [('./store-itemList.component.css').toString()]
})
export class StoreItemListComponent {
  @ViewChildren('someVar') filteredItems: any;
  environment: any = environment;
  showHideAllRows: boolean;
  selectedDeactivateEmployee: any;
  isDesc: boolean = false;
  column: string = 'supplier';
  subscription: Subscription;
  showAdvanceSearch: boolean;
  queryString: any = '';
  showImage: boolean = false;
  angularLogo = './src/assets/mobile.gif';
  sm: any;
  StoreMaterial: any;
  title: any;
  isReadOnly: boolean;
  Id: any;
  opr: any;
  sm1:any;
  MaterialName:any;
  MaterialNumber:any;
  MaterialImage:any;
  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;
  selectedMaterialDelete: any;
  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];
  pager: any = {};// pager object
  PopupItemId: any;
  PopupItemName: any;
  PopupItemNo: any;
  PopupPartNo: any;
  PopupDescription: any;
  PopupCategory: any;
  PopupDepartment: any;
  PopupManufature: any;
  PopupVendor: any;
  fileList: any;
  PopupSupplier: any;
  PopupReOrderQuantity: any;
  userPermissionInfo: any;
  userRoleName: any;
  // paged items
  pagedItems: any[];
  searchPurchaseOrderNo: any;
  searchSupplier: any;
  searchDepartment: any;
  searchDeliveryNoteNo: any;
  searchSupplierOrderRefNo: any;
  searchVendorName: any;
  searchQAFOrderRefNo: any;
  searchDeliveryDate: any;
  searchDescriptionOfPurchase: any;
  ItemLocationList: any[];
  CategoryList: any[];
  MethodList: any[];
  UnitList: any[];
  DepartmentList: any[];
  PriorityList: any[];
  ItemStatusList: any[];
  CurrencyList: any[];
  searchableList: any[] = [];
  searchableList1: any[] = [];
  // Declare local variable
  direction: number;
  setClickedRowAndImage1: Function;
  isLangArabic: boolean;
  currentLanguage: string;
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  selectedFile: any;
  selectedDeactivatePurchaseOrder: any;
  selectedDeactivateStoreItem: any;
  // Change sort function to this:
  @ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, route: ActivatedRoute, private formBuilder: FormBuilder, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];

    if (action == 'edit' && param) {
      this.title = 'Update Material';
      this.isReadOnly = false;
      this.Id = param;
      this.opr = 1;
   
    } else if (action == 'view' && param) {
      this.title = 'View Material';
      this.isReadOnly = true;
      this.Id = param;
      this.opr = 2;
    } else {
      this.title = 'Add Material';
      this.opr = 0;
      this.isReadOnly = false;
    }

    this.sm = {};
    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];

    this.setClickedRowAndImage1 = function (emp: any) {
      emp.highLightRow1 = !emp.highLightRow1;
      this.MaterialName=emp.item_name;
      this.MaterialNumber=emp.item_no;
      this.MaterialImage=emp.itempic;
      this.showImage = !this.showImage;
    }
    this.ItemLocationList = [];
    this.EmployeeDetails = [];
    this.http.get(environment.apikey + "/masterData.php?oper=storeLocation")
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            this.ItemLocationList.push({ 'value': data[item].id, label: data[item].name });
          }
        }
      });
    self.showAdvanceSearch = true;

    this.ItemStatusList = [
      {
        "1": "Accepted"
      },
      {
        "2": "Awaiting Inspection"
      },
      {
        "3": "Inspected"
      },
      {
        "4": "Rejected"
      },
      {
        "5": "Corrected"
      }
    ];

    // this.CategoryList = [
    //   {
    //     label:"Controlled",
    //     value:"Controlled"
    //   },
    //   {
    //     label:"Non-Controlled",
    //     value:"Non-Controlled"
    //   }
    // ];

    this.MethodList = [
      {
        label: "Add",
        value: "Add"
      },
      {
        label: "Remove",
        value: "Remove"
      },
      {
        label: "Adjust",
        value: "Adjust"
      },
      {
        label: "Rejected",
        value: "Rejected"
      }
    ];

    this.UnitList = [
      {
        label: "QESC",
        value: "QESC"
      },
      {
        label: "Land Forces",
        value: "Land Forces"
      },
      {
        label: "Navy",
        value: "Navy"
      },
      {
        label: "Air Force",
        value: "Air Force"
      },
      {
        label: "Qatar Emiri Guard",
        value: "Qatar Emiri Guard"
      }
    ];

    // this.DepartmentList = [
    //   {
    //     label: "IT",
    //     value: "IT"
    //   },
    //   {
    //     label: "Radio",
    //     value: "Radio"
    //   },
    //   {
    //     label: "PABX",
    //     value: "PABX"
    //   },
    //   {
    //     label: "Workshop",
    //     value: "Workshop"
    //   },
    //   {
    //     label: "Transmission",
    //     value: "Transmission"
    //   }
    // ];

    this.PriorityList = [
      {
        label: "High",
        value: "High"
      },
      {
        label: "Medium",
        value: "Medium"
      },
      {
        label: "Low",
        value: "Low"
      }
    ];
  };

  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        // this.loadtable();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.Permissions();
        // this.searchableList = ['purchase_order_no', 'supplier', 'received_qty', 'qty_awaiting_inspection', 'inspected_qty', 'accepted_qty', 'rejected_qty', 'corrected_qty', 'added_by', 'updated_by', 'added_date', 'updated_date'];
        // this.searchableList1 = ['purchase_order_no', 'part_no', 'item_no', 'item_name', 'alt_Item_no', 'descriptions', 'category', 'location', 'method', 'qty', 'date_transaction', 'serial_no','ref', 'notes', 'unit_name', 'department', 'technician_name', 'issued_by', 'received_by', 'costing', 'currency' ,'item_status' ,'manufacturer_item', 'vendor_name', 'reason_for_reject',' warranty'];
        this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
        this.searchForm = this.formBuilder.group({
          items: this.formBuilder.array([this.createItem()])
        });
        this.getDepartmentList();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
// loadtable(){
//  $('#example').DataTable( {
//         scrollY:        "300px",
//         scrollX:        true,
//         scrollCollapse: true,
//         paging:         false,
//         fixedColumns:   {
//             leftColumns: 1,
//             rightColumns: 1
//         }
//     } );
// }

  Permissions() {
    this.userPermission = JSON.parse(this._localStorageService.get('userPermission'));
    let UserModulePermissionArr: any = [];
    let UserModuleOperationArr: any = [];

    for (let key in this.userPermission) {
      if (key == 'OtherInfo') {
        let value = this.userPermission[key];
        for (let key2 in value) {
          let value2 = value[key2];
          value2.forEach((value3: any, key3: any) => {
            key3 = key3;
            if (value3.selected) {
              UserModulePermissionArr.push(value3.id);
            }
            for (let key4 in value3) {
              let value4 = value3[key4];
              if (key4 == 'operation_pages') {
                for (let key5 in value4) {
                  let value5 = value4[key5];
                  if (value5.selected) {
                    if (value5.selected) {
                      UserModuleOperationArr.push(value5.id);
                    }
                  }
                }
              }
            }
            this.UserModuleOperation.push({ 'page_id': value3.id, 'operations': UserModuleOperationArr });
            UserModuleOperationArr = [];
          });
        }
      }
    }
    this.UserModulePermission = UserModulePermissionArr;
  }

  setHighLightRow(material: any) {
    material.highLightRow = !material.highLightRow;
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

  showUploaPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }

  exportToExcel(event: any) {
    let dataArray = this.EmployeeDetails;
    for (var item in dataArray) { // removing unnecessary column before export.
      delete dataArray[item].id;
      delete dataArray[item].hideInnerEmpRow;
    }
    dataArray = StoreSearchPipe.prototype.transform(dataArray,
      this.searchPurchaseOrderNo,
      this.searchSupplier,
      this.searchDepartment,
      this.searchDeliveryNoteNo,
      this.searchSupplierOrderRefNo,
      this.searchVendorName,
      this.searchQAFOrderRefNo,
      this.searchDeliveryDate,
      this.searchDescriptionOfPurchase);
    dataArray = FilterPipe.prototype.transform(dataArray, this.queryString, this.searchableList);
  }

  checkOperation(page_id: any, operation_id: any) {
    let operations = [];
    for (let key in this.UserModuleOperation) {
      let value = this.UserModuleOperation[key];
      if (value.page_id == page_id) {
        operations = value.operations;
      }
    }
    return operations.indexOf(operation_id) > -1;
  }

  import(){
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', "store_material");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      // let apiUrl1 = environment.apikey + "/csv_materialDB_import.php";
      let apiUrl1 = environment.apikey + "/history_csv.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        this.hidePopUp('modalImport');
        $('.app-loader').hide();
        alert(this._translate.currentLang == 'en' ? "upload complete" : "اكتمل التحميل");
      },
        error => { console.log(error) }
      );
    }
  }

  public OnSubmit(formValue: any) {

    var userCookie = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('sessionId', userCookie.sessionId);
    body.append('items', JSON.stringify(formValue));
    body.append('action', "storeMaterialList");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          this.EmployeeDetails = res.data;
        } else {
          this.EmployeeDetails = [];
        }
      }, error => {
        console.log(error.json());
      });
  }

  public searchKeyArray: any = [];

  loadData() {

    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    this.searchKeyArray = [
      { "item": "purchase_order_no", "label": "Purchase order no", "oi": "o" },
      { "item": "sup_ref_name", "label": "Sup ref name", "oi": "o" },
      { "item": "department", "label": "Department", "oi": "o" },
      { "item": "delivery_note_no", "label": "Delivery note no", "oi": "o" },
      { "item": "sup_ord_ref_no", "label": "Sup ord ref no", "oi": "o" },
      { "item": "vendor_name", "label": "Vendor name", "oi": "o" },
      { "item": "QAF_ord_ref_no", "label": "QAF ord ref no", "oi": "o" },
      { "item": "item_name", "label": "Item name", "oi": "i" },
      { "item": "item_no", "label": "Item no", "oi": "i" },
      { "item": "manufacture_item", "label": "Manufacture item", "oi": "i" },
      { "item": "alt_item_no", "label": "Alt item no", "oi": "i" },
      { "item": "category", "label": "Category", "oi": "i" },
      { "item": "item_part_no", "label": "Item part no", "oi": "i" }
    ];

    var userCookie = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('sessionId', userCookie.sessionId);
    body.append('action', 'storeMaterialList');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          for (var item in res.data) {
            res.data[item]["hideInnerEmpRow"] = false;
            res.data[item]["reorder_qty"] = Number(res.data[item].reorder_qty);
            res.data[item]["warranty"] = Number(res.data[item].warranty);
            res.data[item]["supplierName"] = String(res.data[item].supplierName);
          }
          this.EmployeeDetails = res.data;
        }
      }, error => {
        console.log(error.json());
      });
      

    if (this.currentLanguage == 'en') {
      this.isLangArabic = false;
    } else {
      this.isLangArabic = true;
    }
  }

  toggleHiddenEmpRow(emp: any) {
    emp.hideInnerEmpRow = !emp.hideInnerEmpRow;
  }

  showAllHiddenEmpRow() {
    this.showHideAllRows = true
    for (var item in this.EmployeeDetails) {
      this.EmployeeDetails[item].hideInnerEmpRow = true;
    }
  };

  showADDMaterialPopup() {
    
    this.isReadOnly = false;
    this.opr = 0;
    $('#modalListItem').modal('show');
  }

  showViewMaterialPopup(sm: any) {
    this.isReadOnly = true;
    this.opr = 2;
    this.PopupItemName = sm.item_name;
    this.PopupItemNo = sm.item_no;
    this.PopupPartNo = sm.part_no;
    this.PopupDescription = sm.description;
    this.PopupCategory = sm.category;
    this.PopupDepartment = sm.department;
    this.PopupManufature = sm.manufacture;
    this.PopupVendor = sm.vendor;
    this.PopupSupplier = sm.supplier_id;
    this.PopupReOrderQuantity = sm.reorder_qty;
    $('#modalListItem').modal('show');
  }

  showEditMaterialPopup(StoreMaterial: any) {
    this.isReadOnly = false;
    this.opr = 1;
    this.sm = StoreMaterial;
    $('#modalListItem').modal('show');
  }
  showDeleteMaterialPopup(sm: any) {
    console.log(sm);
    $('#modalDeactivate1').modal('show');
    this.selectedMaterialDelete = sm;
  }

  deleteMaterial() {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('id',this.selectedMaterialDelete.id);
    body.append('action', 'deleteStoreMaterial');
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate1');
  }

  hideAllHiddenRows() {
    this.showHideAllRows = false
    for (var item in this.EmployeeDetails) {
      this.EmployeeDetails[item].hideInnerEmpRow = false;
    }
  };

  onChange(event: any) {

    var files = event.srcElement.files;
    this.selectedFile = files;
    this.http.post('my-backend.com/file-upload', this.selectedFile)
      .subscribe(event => {
      });

  }

  resetStoreMatrialValue(StoreMaterial:any) {
    StoreMaterial.item_name = "";
    StoreMaterial.item_no = "";
    StoreMaterial.part_no = "";
    StoreMaterial.description = "";
    StoreMaterial.category = "";
    StoreMaterial.department = "";
    StoreMaterial.manufacture = "";
    StoreMaterial.vendor = "";
    StoreMaterial.supplier_id = "";
    StoreMaterial.reorder_qty = "";
  }





  get items(): FormArray {
    return this.searchForm.get('items') as FormArray;
  };

  addItem(): void {
    this.items.push(this.createItem());
  }

  deleteAction(i: number) {
    this.items.removeAt(i);
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: '',
      fieldValue: '',

    });
  }

  addMaterial(StoreMaterial: any) {
    let body = new URLSearchParams();
    body.append('action', "addStoreMaterial");
    body.append('data', JSON.stringify(StoreMaterial));
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          this.StoreMaterial = res.data;
        } else {
          this.StoreMaterial = [];
        }
        this.loadData();
      }, error => {
        console.log(error.json());
      });
  }



  fileChangeListener(event: any): void {
    //file upload event  
    var target = event.target || event.srcElement;
    var files = target.files;
    let fileList: FileList = event.target.files;
    if (files && fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('action', "ItemPic");
      formData.append('ItemPic', file, file.name);
      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      this.http.post(environment.apikey + "/generateJsonUrl.php", formData, options)
        .map(res => res.json())
        .subscribe(dataRes => {
          this.sm['itempic'] = environment.apikey + dataRes.data;
        }, error => {
          console.log(error.json());
        });

    }
  }

  fileChangeListenerImport(event: any): void {
    var target = event.target || event.srcElement;
    var files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert(this._translate.currentLang == 'en' ? "Please import valid .csv file." : "الرجاء استيراد ملف .csv صالح.");
        this.fileReset();
      }
    }
    this.fileList = event.target.files;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
  }

  updateMaterial(StoreMaterial: any) {
    //  StoreMaterial.id = this.PopupItemId;
    //  StoreMaterial.item_name = this.PopupItemName;
    //  StoreMaterial.item_no = this.PopupItemNo ;
    //  StoreMaterial.part_no = this.PopupPartNo;
    //  StoreMaterial.description = this.PopupDescription;
    //  StoreMaterial.category = this.PopupCategory;
    //  StoreMaterial.department =  this.PopupDepartment;
    //  StoreMaterial.manufacture = this.PopupManufature;
    //  StoreMaterial.vendor = this.PopupVendor;
    //  StoreMaterial.supplier_id = this.PopupSupplier;
    //  StoreMaterial.reorder_qty = this.PopupReOrderQuantity ;
    delete StoreMaterial["supplierName"];
    delete StoreMaterial["hideInnerEmpRow"];
    delete StoreMaterial["highLightRow1"];
    let body = new URLSearchParams();
    body.append('action', "updateStoreMaterial");
    body.append('data', JSON.stringify(StoreMaterial));
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          StoreMaterial = res.data;
          this.loadData();
        } else {
          this.sm = [];
        }
      }, error => {
        console.log(error.json());
      });
      
    this.hidePopUp('modalListItem');
  }


  showDeactivatePurchaseOrderPopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivatePurchaseOrder = emp;
  }

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }


  closeandClearAdvanceSearch() {

    this.showAdvanceSearch = false;
    this.searchPurchaseOrderNo = '';
    this.searchSupplier = '';
    this.searchDepartment = '';
    this.searchDeliveryNoteNo = '';
    this.searchSupplierOrderRefNo = '';
    this.searchVendorName = '';
    this.searchQAFOrderRefNo = '';
    this.searchDeliveryDate = '';
    this.searchDescriptionOfPurchase = '';
  }


  deletePurchaseOrder(emp: any) {
    let body = new URLSearchParams();
    body.append('id', this.selectedDeactivatePurchaseOrder.id);
    body.append('action', 'deletePO');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate');
  }


  hidePopUp(popUpId: any) {
    this.loadData();
    $('#' + popUpId).modal('hide');
  }

  cancelSearch() {
    this.loadData();
    this.searchForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    });
  }

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  };
  toggleImage() {
    this.showImage = !this.showImage;
  }

};

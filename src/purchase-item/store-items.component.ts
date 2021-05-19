import { Pipe } from '@angular/core';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import { FileUtil } from '../app/file.util';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderrByPipe } from '../app/orderBy.pipe';
import { Constants } from '../app/csv.constants';
import { StoreItemsSearchPipe } from '../app/storepipes/store-items.pipe';
import { FilterPipe } from '../app/genericSearch.pipe';
Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'store-items',
  templateUrl: './store-items.component.html',
  styleUrls: [('./store-items.component.css').toString()]
})
export class StoreItemsComponent {
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
  fileList: any;
  //SMS Observables
  // SmsId: string;
  // SmsName: string;
  // SmsRank: string;
  // SmstelOffice: any;
  // SmstelOffice1: any;
  // SmstelOffice2: any;
  // SmsPosition: string;
  // SmsCompany: string;
  // SmsDistributionUnit: string;
  // SmsDisUnit: string;
  // SmsRegiment: string;
  // SmstelMobile: any;
  // SmstelMobile1: any;
  // SmstelMobile2: any;
  // txtToNumber: string;
  // //checkbox ngmodel
  // checkId: boolean = false;
  // checkPosition: boolean = false;
  // checkName: boolean = false;
  // checkCompany: boolean = false;
  // checkDisUnit: boolean = false;
  // checkRank: boolean = false;
  // checkForce_Unit: boolean = false;
  // checkOfficePhone: boolean = false;
  // checkMobile: boolean = false;
  // checkOfficePhone1: boolean = false;
  // checkOfficePhone2: boolean = false;
  // checkOfficePhone3: boolean = false;

  public errorItemNo = '';
  public errorPartNo = '';
  public errorLoc = '';
  public errorSiteName = '';
  public errorStatus = '';


  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];
  MaterialDetails: any[];
  FinalLoadArray: any[];
  pager: any = {};// pager object
  // paged items
  pagedItems: any[];
  searchPurchaseOrderNo: any;
  searchDepartment: any;
  searchItemStatus: any;
  StoreItem: any;
  searchStatus: any;
  searchPartNo: any;
  searchLocation: any;
  searchDate: any;
  searchProblemReported: any;
  searchParcelNo: any;
  searchItemName: any;
  searchItemNo: any;
  serialNo: any;
  searchSerialNo: any;
  searchAltItemNo: any;
  searchItemPartNo: any;
  searchCategory: any;
  searchQuantity: any;
  searchManufatureItem: any;
  searchVendorName: any;
  searchWarranty: any;
  searchDescriptions: any;
  searchRemarks: any;
  MaterialName: any;
  MaterialNumber: any;
  MaterialImage: any;
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
  isLangArabic: boolean;
  currentLanguage: string;
  setClickedRow: Function;
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  selectedDeactivatePurchaseOrder: any;
  deleteSelectedStoreItem: any;
  selectedDeactivateStoreItem: any;
  // Change sort function to this:
  @ViewChild('fileImportInput')
  fileImportInput: any;
  materialList: any[];

  constructor(private fil: StoreItemsSearchPipe, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private formBuilder: FormBuilder, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];
    this.StoreItem = {};

    this.ItemLocationList = [];
    this.EmployeeDetails = [];
    this.setClickedRow = function (emp: any) {
      emp.highLightRow = !emp.highLightRow;
      this.MaterialName = emp.item_name;
      this.MaterialNumber = emp.item_no;
      this.MaterialImage = emp.itempic;
      this.showImage = !this.showImage;
    }

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
        "value": "1",
        "label": "Available"
      },
      {
        "value": "2",
        "label": "ReOrder"
      },
      {
        "value": "3",
        "label": "Faulty"
      },
      {
        "value": "4",
        "label": "Under Repair"
      },
      {
        "value": "5",
        "label": "Issued"
      },
      {
        "value": "6",
        "label": "Loan"
      },
      {
        "value": "7",
        "label": "Out of Stock"
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
    this.getMaterailList();
  };
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
  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.sort("order");
        this.sort("warranty");
        // this.EmployeeDetails.sort((a,b) => ( a.Order - b.Order )); 
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.Permissions();
        // this.searchableList = ['purchase_order_no', 'supplier', 'received_qty', 'qty_awaiting_inspection', 'inspected_qty', 'accepted_qty', 'rejected_qty', 'corrected_qty', 'added_by', 'updated_by', 'added_date', 'updated_date'];
        // this.searchableList1 = ['purchase_order_no', 'part_no', 'item_no', 'item_name', 'alt_Item_no', 'descriptions', 'category', 'location', 'method', 'qty', 'date_transaction', 'serial_no','ref', 'notes', 'unit_name', 'department', 'technician_name', 'issued_by', 'received_by', 'costing', 'currency' ,'item_status' ,'manufacturer_item', 'vendor_name', 'reason_for_reject',' warranty'];
        this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
        this.searchForm = this.formBuilder.group({
          items: this.formBuilder.array([this.createItem()])
        });
        // this.ondrpdownChange('Faulty');
        // this.searchFilter()
        //this.EmployeeDetails = this.searchFilter.transform(this.EmployeeDetails, this.searchText)}
        this.getDepartmentList();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }


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

  exportToExcel(event: any) {
    let dataArray = this.EmployeeDetails;
    for (var item in dataArray) { // removing unnecessary column before export.
      delete dataArray[item].id;
      delete dataArray[item].hideInnerEmpRow;
    }
    dataArray = StoreItemsSearchPipe.prototype.transform(
      this.searchStatus,
      this.searchItemName,
      this.searchItemNo,
      this.searchDepartment,
      this.searchPartNo,
      this.searchItemPartNo,
      this.searchCategory,
      this.searchQuantity,
      this.searchVendorName,
      this.searchDescriptions
    );
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



  searchSerialNum(SerialNo: any) {
    this.EmployeeDetails =[];    
    for (let item1 in this.FinalLoadArray) {
      for(let item2 in this.FinalLoadArray[item1].store_item){
        if((SerialNo == this.FinalLoadArray[item1].store_item[item2].serial_no)&&((this.FinalLoadArray[item1].Materialstatus =='Available')||(this.FinalLoadArray[item1].Materialstatus =='ReOrder')||(this.FinalLoadArray[item1].Materialstatus =='Out of Stock'))&&(this.FinalLoadArray[item1].store_item[item2].status=='1')){
          this.EmployeeDetails.push(this.FinalLoadArray[item1]);
        }else if((SerialNo == this.FinalLoadArray[item1].store_item[item2].serial_no)&&(this.FinalLoadArray[item1].Materialstatus =='Faulty')&&(this.FinalLoadArray[item1].store_item[item2].status=='3')){
          this.EmployeeDetails.push(this.FinalLoadArray[item1]);
        }else if((SerialNo == this.FinalLoadArray[item1].store_item[item2].serial_no)&&(this.FinalLoadArray[item1].Materialstatus =='Under Repair')&&(this.FinalLoadArray[item1].store_item[item2].status=='4')){
          this.EmployeeDetails.push(this.FinalLoadArray[item1]);
        }else if((SerialNo == this.FinalLoadArray[item1].store_item[item2].serial_no)&&(this.FinalLoadArray[item1].Materialstatus =='Issued')&&(this.FinalLoadArray[item1].store_item[item2].status=='5')){
          this.EmployeeDetails.push(this.FinalLoadArray[item1]);
        }else if((SerialNo == this.FinalLoadArray[item1].store_item[item2].serial_no)&&(this.FinalLoadArray[item1].Materialstatus =='Loan')&&(this.FinalLoadArray[item1].store_item[item2].status=='6')){
          this.EmployeeDetails.push(this.FinalLoadArray[item1]);
        }
      }
    }    
  }

  clearSerialNoSearch() {
    $('.app-loader').show();
    this.showImage = false;
    this.serialNo = "";
    this.EmployeeDetails =[];
    let body = new URLSearchParams();
    body.append('action', 'get_store_items');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        
        for (var item in res.data) {
          let QuantityAvilable = 0;
          res.data[item]["order"] = 1;
          res.data[item]["hideInnerRowAvilable"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '1') {
              QuantityAvilable = QuantityAvilable + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          if (QuantityAvilable == 0) {
            res.data[item]["Materialstatus"] = 'Out of Stock';
            res.data[item]["order"] = 7;
          } else if (res.data[item].reorder_qty > QuantityAvilable) {
            res.data[item]["Materialstatus"] = 'ReOrder';
            res.data[item]["order"] = 1;
          } else {
            res.data[item]["Materialstatus"] = 'Available';
            res.data[item]["order"] = 2;
          }
          res.data[item]["QuantAvailable"] = QuantityAvilable;          
          this.EmployeeDetails.push(res.data[item]);
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
        for (var item in res.data) {
          let QuantityFaulty = 0;
          res.data[item]["order"] = 3;
          res.data[item]["Materialstatus"] = 'Faulty';
          res.data[item]["hideInnerRowFaulty"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '3') {
              QuantityFaulty = QuantityFaulty + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantFaulty"] = QuantityFaulty;
          if (QuantityFaulty >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
        for (var item in res.data) {
          let QuantityUnderRepair = 0;
          res.data[item]["order"] = 4;
          res.data[item]["Materialstatus"] = 'Under Repair';
          res.data[item]["hideInnerRowUnderRepair"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '4') {
              QuantityUnderRepair = QuantityUnderRepair + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantRepair"] = QuantityUnderRepair;
          if (QuantityUnderRepair >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
        for (var item in res.data) {
          let QuantityIssued = 0;
          res.data[item]["order"] = 5;
          res.data[item]["Materialstatus"] = 'Issued';
          res.data[item]["hideInnerRowIssued"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '5') {
              QuantityIssued = QuantityIssued + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantIssued"] = QuantityIssued;
          if (QuantityIssued >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
        for (var item in res.data) {
          let QuantityLoan = 0;
          res.data[item]["order"] = 6;
          res.data[item]["Materialstatus"] = 'Loan';
          res.data[item]["hideInnerRowLoan"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '6') {
              QuantityLoan = QuantityLoan + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantLoan"] = QuantityLoan;
          if (QuantityLoan >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
         $('.app-loader').hide();
        }
      }, error => {
        console.log(error.json());
      });
  }



  public OnSubmit(formValue: any) {
    for (var i = 0; i < formValue.items.length; i++) {
      if (formValue.items[i].fieldName == 'Node') {
        var Node = formValue.items[i].fieldValue.split(' ');
        var NodeNumber = Node[1];
        if (NodeNumber < '10') {
          var formattedNodeNumber = Number(NodeNumber[1]);
          formValue.items[i].fieldValue = 'Node ' + formattedNodeNumber;
        }
      }
    }
    let body = new URLSearchParams();
    body.append('items', JSON.stringify(formValue));
    body.append('action', "get_store_items");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
      }, error => {
        console.log(error.json());
      });
  }
  nodeArray: any = [];
  getNodeArray() {
    this.nodeArray = [];
    for (var _i = 0; _i < 50; _i++) {
      if (_i >= 0 && _i < 10) {
        this.nodeArray.push('Node ' + '0' + _i)
      }
      else if (_i != 12 && _i != 13) {
        this.nodeArray.push('Node ' + _i)
      }
    }
  }

  public searchKeyArray: any = [];

  loadData() {
    $('.app-loader').show();
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    this.searchKeyArray = [
      { "item": "purchase_order_no", "label": "purchase order no" },
      { "item": "parcel_no", "label": "parcel no" },
      { "item": "item_name", "label": "item name" },
      { "item": "item_no", "label": "item no" },
      { "item": "alt_item_no", "label": "alt item no" },
      { "item": "item_part_no", "label": "item part no" },
      { "item": "category", "label": "category" },
      { "item": "quantity", "label": "quantity" },
      { "item": "manufacture_item", "label": "manufacture item" },
      { "item": "vendor_name", "label": "vendor name" },
      { "item": "warranty", "label": "warranty" }
    ];

    let body = new URLSearchParams();
    body.append('action', 'get_store_items');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        
        for(let i=0;i<res.data.length;i++){
          let temp = []
          temp = res.data[i].store_item;
          if(temp.length != 0){
            for(let j=0;j<temp.length;j++){
              if(temp[j].warranty == "-0001-11-30"){
                temp[j].warranty = null;
              }
            }
          }
          res.data[i].store_item = temp;
        }        
        // let temp = []
        // temp = res;
        // temp.forEach((item: any) => {
        //     if(item.store_item.length != 0){
        //       item.store_item.forEach((element: any) => {
        //         if(element.warranty == "-0001-11-30"){
        //           element.warranty = null;
        //         }
        //       });
        //     }
        // })
        // res = temp;
        for (var item in res.data) {
          let QuantityAvilable = 0;
          res.data[item]["order"] = 1;
          res.data[item]["hideInnerRowAvilable"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '1') {
              QuantityAvilable = QuantityAvilable + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          if (QuantityAvilable == 0) {
            res.data[item]["Materialstatus"] = 'Out of Stock';
            res.data[item]["order"] = 7;
          } else if (res.data[item].reorder_qty > QuantityAvilable) {
            res.data[item]["Materialstatus"] = 'ReOrder';
            res.data[item]["order"] = 1;
          } else {
            res.data[item]["Materialstatus"] = 'Available';
            res.data[item]["order"] = 2;
          }
          res.data[item]["QuantAvailable"] = QuantityAvilable;
          this.EmployeeDetails.push(res.data[item]);
        // 
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
        for (var item in res.data) {
          let QuantityFaulty = 0;
          res.data[item]["order"] = 3;
          res.data[item]["Materialstatus"] = 'Faulty';
          res.data[item]["hideInnerRowFaulty"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '3') {
              QuantityFaulty = QuantityFaulty + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantFaulty"] = QuantityFaulty;
          if (QuantityFaulty >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
        for (var item in res.data) {
          let QuantityUnderRepair = 0;
          res.data[item]["order"] = 4;
          res.data[item]["Materialstatus"] = 'Under Repair';
          res.data[item]["hideInnerRowUnderRepair"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '4') {
              QuantityUnderRepair = QuantityUnderRepair + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantRepair"] = QuantityUnderRepair;
          if (QuantityUnderRepair >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {        
        for (var item in res.data) {
          let QuantityIssued = 0;
          res.data[item]["order"] = 5;
          res.data[item]["Materialstatus"] = 'Issued';
          res.data[item]["hideInnerRowIssued"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '5') {
              QuantityIssued = QuantityIssued + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantIssued"] = QuantityIssued;
          if (QuantityIssued >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
        }
      }, error => {
        console.log(error.json());
      });
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        let temp1 = res.data
        
        for (var item in res.data) {
          let QuantityLoan = 0;
          res.data[item]["order"] = 6;
          res.data[item]["Materialstatus"] = 'Loan';
          res.data[item]["hideInnerRowLoan"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '6') {
              QuantityLoan = QuantityLoan + 1;
            }
            if (res.data[item].store_item[i].warranty == "-0001-11-30"){
              res.data[item].store_item[i].warranty = null;
            }
          }
          res.data[item]["QuantLoan"] = QuantityLoan;
          if (QuantityLoan >= 1) {
            this.EmployeeDetails.push(res.data[item]);
          }
          this.EmployeeDetails.sort((a, b) => (a.order - b.order));          
          //  $('.app-loader').hide();
          //this.ondrpdownChange('Faulty'); 
          // this.EmployeeDetails =  this.fil.transform(this.EmployeeDetails,this.searchStatus,'','','','','','','','');
        }
        this.FinalLoadArray = this.EmployeeDetails;
        $('.app-loader').hide();
      }, error => {
        console.log(error.json());
      });

    if (this.currentLanguage == 'en') {
      this.isLangArabic = false;
    } else {
      this.isLangArabic = true;
    }
  }
  showItemAddPopup() {
    this.StoreItem = {};
    $('#modalListItem').modal('show');
  }

  closeAndRedirect() {
    this.router.navigate(['/store-items']);
  }

  isModelValid(StoreItem: any) {
    let isValid = true;
    this.errorItemNo = '';
    this.errorPartNo = '';
    this.errorLoc = '';
    this.errorSiteName = '';
    this.errorStatus = '';

    if (Object.keys(StoreItem).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(StoreItem).length && typeof StoreItem.item_no == 'undefined') {
      this.errorItemNo = 'Item No is Required';
      isValid = false;
    }

    if (Object.keys(StoreItem).length && typeof StoreItem.part_no == 'undefined') {
      this.errorPartNo = 'Part No is Required';
      isValid = false;
    }

    if (Object.keys(StoreItem).length && typeof StoreItem.location == 'undefined') {
      this.errorLoc = 'Location is Required';
      isValid = false;
    }

    if (Object.keys(StoreItem).length && typeof StoreItem.site_name == 'undefined') {
      this.errorSiteName = 'Site Name is Required';
      isValid = false;
    }

    if (Object.keys(StoreItem).length && typeof StoreItem.status == 'undefined') {
      this.errorStatus = 'Status is Required';
      isValid = false;
    }

    return isValid;
  }
  AddStoreItem(StoreItem: any) {

    var isModelValid = this.isModelValid(StoreItem);
    if (!isModelValid) {
      return;
    }

    delete StoreItem.date_in;
    delete StoreItem.date_out;
    delete StoreItem.item_no;
    delete StoreItem.location;
    delete StoreItem.part_no;
    delete StoreItem.problem_reported;
    delete StoreItem.loan_duration;
    delete StoreItem.site_name;
    let body = new URLSearchParams();
    body.append('data', JSON.stringify(StoreItem));
    body.append('action', 'addStoreItem');

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {        
        if (data.code == 100) {
          this.loadData();

          this.closeAndRedirect();
        } else if (data.code == 101) {
          alert(data.message);
        } else {
          alert("Item Not Stored. Please Check Logs.");
        }
        this.hidePopUp('modalListItem');
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalListItem');
  }

  toggleHiddenRowAvilable(storematerial: any) {
    storematerial.hideInnerRowAvilable = !storematerial.hideInnerRowAvilable;

  }

  toggleHiddenEmpRowReOrder(storematerial: any) {
    storematerial.hideInnerRowReOrder = !storematerial.hideInnerRowReOrder;
  }

  toggleHiddenEmpRowFaulty(storematerial: any) {
    storematerial.hideInnerRowFaulty = !storematerial.hideInnerRowFaulty;

  }

  toggleHiddenEmpRowUnderRepair(storematerial: any) {
    storematerial.hideInnerRowUnderRepair = !storematerial.hideInnerRowUnderRepair;

  }
  toggleHiddenEmpRowIssued(storematerial: any) {
    storematerial.hideInnerRowIssued = !storematerial.hideInnerRowIssued;

  }
  toggleHiddenEmpRowLoan(storematerial: any) {
    storematerial.hideInnerRowLoan = !storematerial.hideInnerRowLoan;

  }
  showAllHiddenEmpRow() {
    this.showHideAllRows = true
    for (var item in this.EmployeeDetails) {
      this.EmployeeDetails[item].hideInnerEmpRow = true;
    }
  };

  hideAllHiddenRows() {
    this.showHideAllRows = false
    for (var item in this.EmployeeDetails) {
      this.EmployeeDetails[item].hideInnerEmpRow = false;
    }
  };

  onChange(event: any) {
    let value = event.target.value;
    if (value == 'Node') {
      $(event.target).parent().find('input').addClass('hide').removeClass('inline-display');
      $(event.target).parent().find('.node-select').removeClass('hide').addClass('inline-display');

    } else {
      $(event.target).parent().find('input').removeClass('hide').addClass('inline-display');
      $(event.target).parent().find('.node-select').addClass('hide').removeClass('inline-display');
    }
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

  showDeleteItemPopup(emp: any) {
    $('#modalDeactivate1').modal('show');
    this.deleteSelectedStoreItem = emp;
  }

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }


  closeandClearAdvanceSearch() {

    this.showAdvanceSearch = false;
    this.searchPurchaseOrderNo = '';
    this.searchParcelNo = '';
    this.searchItemName = '';
    this.searchItemNo = '';
    this.searchSerialNo = '';
    this.searchDepartment = '';
    this.searchItemStatus = '';
    this.searchStatus = '';
    this.searchPartNo = '';
    this.searchLocation = '';
    this.searchDate = '';
    this.searchProblemReported = '';
    this.searchAltItemNo = '';
    this.searchItemPartNo = '';
    this.searchCategory = '';
    this.searchQuantity = '';
    this.searchManufatureItem = '';
    this.searchVendorName = '';
    this.searchWarranty = '';
    this.searchDescriptions = '';
    this.searchRemarks = '';
  }


  deletePurchaseOrder(emp: any) {
    let body = new URLSearchParams();
    body.append('id', this.selectedDeactivatePurchaseOrder.id);
    body.append('action', 'deletePO');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {        
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate');
  }


  showDeactivateStoreItemPopup(emp1: any) {
    $('#modalDeactivate1').modal('show');
    this.deleteSelectedStoreItem = emp1;
  }

  deleteStoreItem() {
    let body = new URLSearchParams();
    body.append('id', this.deleteSelectedStoreItem.id);
    body.append('action', 'deleteStoreItem');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {        
        $('.item-' + this.deleteSelectedStoreItem.id).parent('tbody').remove();
        this.EmployeeDetails.forEach((value, key) => {
          if (this.EmployeeDetails[key].id == this.deleteSelectedStoreItem.material_id) {
            this.EmployeeDetails[key]['store_item'].forEach((value2: any, key2: any) => {
              if (value2.id == this.deleteSelectedStoreItem.id) {
                Object.assign(this.EmployeeDetails[key].store_item[key2], { status: 0 });
              }
            });
          }
        });        
        this.hidePopUp('modalDeactivate1');
      }, error => {
        console.log(error.json());
      });
    this.closeAndRedirect();
  }

  hidePopUp(popUpId: any) {
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
  emptyLocalSearch(){
    this.searchStatus = '';
    this.searchItemName = '';
    this.searchItemNo = '';
    this.searchQuantity = '';
    this.searchDescriptions = '';
    this.searchCategory = '';
    this.searchItemPartNo = '';
    this.searchDepartment = '';
    this.searchVendorName = '';
  }
  
  import(){
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', "store_item");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/csv_Serial_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        // this.loadData();
        // this.ngOnInit();
        this.emptyLocalSearch();
        this.clearSerialNoSearch();
        this.hidePopUp('modalImport');
        $('.app-loader').hide();
        alert(this._translate.currentLang == 'en' ? "upload complete" : "اكتمل التحميل");
        // this.EmployeeDetails = [];
        // this.clearSerialNoSearch();
      },
        error => { console.log(error) }
      );
    }
    // alert("Hi");
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
  showUploaPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }
};

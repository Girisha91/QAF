import { Pipe } from '@angular/core';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {DatepickerModule} from "ngx-bootstrap";
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { FileUtil } from '../app/file.util';
import { Constants } from '../app/csv.constants';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from '../app/shared/excel.service';
import { ExternalLinePipe } from '../app/externalLine.pipe';
import { FilterPipe } from '../app/genericSearch.pipe';
Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-pabx-externalLines',
  templateUrl: './pabx-externalLines.component.html',
  styleUrls: [('./pabx-externalLines.component.css').toString()]
})
export class PabxExternalLinesComponent {
  @ViewChildren('someVar') filteredItems: any;
  environment: any = environment;
  showAdvanceSearch: boolean;
  isDesc: boolean = false;
  column: string = 'Name';
  subscription: Subscription;

  selectedDeactivateExternalLines: any;
  selectedDeactivateExternalLinesRents: any;

  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];
  ExternalSingleData: any;

  pager: any = {};// pager object

  // paged items
  pagedItems: any[];

  // Declare local variable
  direction: number;
  isLangArabic: boolean;

  isReadOnly:Boolean = true;
  ExternalCategory : string ;       
  ExternalAccountNo  : string ;     
  ExternalTelephoneNo  : string ;         
  ExternalOoredooCustomerNo  : string ;        
  ExternalAuthority  : string ;        
  ExternalDateInstallation : string ;         
  ExternalDistributionMenu  : string ;         
  ExternalDistributionUnit  : string ;          
  ExternalLocation : string ;         
  ExternalRequestReferNo  : string ;       
  ExternalUserName  : string ;       
  ExternalTypeService  : string ;      
  ExternalCustomerName  : string ;         
  ExternalDidNumberRange  : string ;        
  ExternalPackage  : string ;       
  ExternalMdfInfo  : string ;       
  ExternalDpInfo  : string ;         
  ExternalCConnectedWallSocketInfo  : string ;        

  currentLanguage: string;
  sub = new Subject();
  userRoleId: any;
  lastUpdatedDate: any = '';
  setClickedRow: Function;
  // Change sort function to this:
  @ViewChild('fileImportInput')
  fileImportInput: any;
  searchCategory: any;
  searchAccountNo: any;
  searchTelephoneNo: any;
  searchOoredooCustomerNo: any;
  searchAuthority: any;
  searchDateInstallation: any;
  StatusList: any[];
  ServiceList: any[];
  CatList: any[];
  Location: any[];
  distributionList: any[] = [];
  distributionListArabic: any[] = [];
  distributionUnit: any[] = [];
  distributionUnitArabic: any[] = [];
  searchDistributionMenu: any;
  searchDistributionUnit: any;
  searchLocation: any;
  searchRequestRefNo: any;
  searchUserName: any;
  searchTypeService: any;
  searchCustomerName: any;
  searchDidNumberRange: any;
  searchPackage: any;
  searchMdfInfo: any;
  searchDpInfo: any;
  searchConnectedWallSocketInfo: any;
  queryString: any;
  searchableList: any;
  constructor(private excelService: ExcelService, private formBuilder: FormBuilder, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.excelService = excelService;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];
    self.EmployeeDetails = [];
    self.showAdvanceSearch = true;
    this.setClickedRow = function (emp: any) {
      emp.highLightRow = !emp.highLightRow;
    }
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
  };
  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.Permissions();
        this.getDistributionList();
        this.getDistributionUnit();
        this.searchForm = this.formBuilder.group({
          items: this.formBuilder.array([this.createItem()])
        });
      }

    } else {
      this.router.navigate(['/login']);
    }
  }

  resetSearchDropDownValues() {
    $('.searchTypeService').prop('selectedIndex', '0');
    $(".searchDistributionUnit").prop('selectedIndex', '0');
    $(".searchDistributionMenu").prop('selectedIndex', '0');
    $(".searchCategory").prop('selectedIndex', '0');
  }

  onChange(event: any) {
    // console.log("value of formvalue is",event,formvalue);
    // this.fieldValue = null;
    // this.searchForm.value.items[0].fieldValue = null;
    let value = event.target.value;
    if (value == 'Node') {
      $(event.target).parent().find('input').addClass('hide').removeClass('inline-display');
      $(event.target).parent().find('.node-select').removeClass('hide').addClass('inline-display');

    } else {
      $(event.target).parent().find('input').removeClass('hide').addClass('inline-display');
      $(event.target).parent().find('.node-select').addClass('hide').removeClass('inline-display');
    }
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: '',
      fieldValue: '',

    });
  }


  exportToExcel(event: any) {
    let dataArray = this.EmployeeDetails;
    for (var item in dataArray) { // removing unnecessary column before export.
      delete dataArray[item].id;
      delete dataArray[item].hideInnerEmpRow;
    }
    dataArray = ExternalLinePipe.prototype.transform(dataArray,
      this.searchCategory,
      this.searchAccountNo,
      this.searchTelephoneNo,
      this.searchOoredooCustomerNo,
      this.searchAuthority,
      this.searchDateInstallation,
      this.searchDistributionMenu,
      this.searchDistributionUnit,
      this.searchLocation,
      this.searchRequestRefNo,
      this.searchUserName,
      this.searchTypeService,
      this.searchCustomerName,
      this.searchDidNumberRange,
      this.searchPackage,
      this.searchMdfInfo,
      this.searchDpInfo,
      this.searchConnectedWallSocketInfo);
    dataArray = FilterPipe.prototype.transform(dataArray, this.queryString, this.searchableList);
    this.excelService.download(dataArray, 'export_Employees');
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
    body.append('action', "externalLinesList");

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

  cancelSearch() {
    this.loadData();
    this.searchForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    });
  }

  toggleHiddenEmpRow(emp: any) {
    emp.hideInnerEmpRow = !emp.hideInnerEmpRow;

  }

  Permissions() {
    this.userPermission = JSON.parse(this._localStorageService.get('userPermission'));
    console.log("value of user permission is",this.userPermission)
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

  getDistributionList() {
    this.http.get(environment.apikey + "/masterData.php?oper=getDistributionList&language=" + this._translate.currentLang)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            this.distributionList.push(data[item].name);
            this.distributionListArabic.push(data[item].nameArabic);
          }
        }
      });
  }

  getDistributionUnit() {
    this.distributionUnit = [];
    this.distributionUnitArabic = [];
    this.http.get(environment.apikey + "/masterData.php?oper=getDistributionUnitList&language=" + this._translate.currentLang)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          data.sort((a: any,b: any) => a.unit_order - b.unit_order );
          for (var item in data) {
            this.distributionUnit.push(data[item].name);
            this.distributionUnitArabic.push(data[item].nameArabic);
          }
        }
      });
  }


  public searchKeyArray: any = [];
  loadData() {
    $('.app-loader').show();
    this.searchKeyArray = [{ "item": "category", "label": "الخاصية" },
      { "item": "account_no", "label": "رقم الحساب" },
      { "item": "telephone_no", "label": "رقم الهاتف" },
      { "item": "Ooredoo_Customer_no", "label": "رقم هاتف عميل اوريدو" },
      { "item": "authority", "label": "الصلاحية" },
      { "item": "date_installation", "label": "تاريخ التركيب" },
      { "item": "Distribution_Menu", "label": "قائمة التوزيع" },
      { "item": "Distribution_Unit", "label": "وحدة التوزيع" },
      { "item": "location", "label": "الموقع" },
      { "item": "type_service", "label": "نوع الخدمة" },
      { "item": "did_number_range", "label": "نطاق الأرقام DID" },
      { "item": "package", "label": "حزمة" },
      { "item": "request_refe_no", "label": "طلب رقم المرجع" },
      { "item": "username", "label": "رقم المستخدم" },
      { "item": "mdf_info", "label": "معلومات MDF" },
      { "item": "dp_info", "label": "معلومات DP" },
      { "item": "connected_wall_socket_info", "label": "معلومات مقبس الحائط" },
      { "item": "status", "label": "الحالة" }    
    ];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', "externalLinesList");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          for (let item in res.data) {
            res.data[item]["highLightRow"] = false;
          }
          this.EmployeeDetails = res.data;
          this.lastUpdatedDate = res.lastDate;
          $('.app-loader').hide();
        } else {
          this.EmployeeDetails = [];
          $('.app-loader').hide();
        }
      });
    if (this.currentLanguage == 'en') {
      this.isLangArabic = false;
    } else {
      this.isLangArabic = true;
    }
  }



  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  showUploaPopUp(where: string) {
    this.fileImportInput.nativeElement.value = "";
    $('#' + where).modal('show');
  }

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }


  fileList: any;
  tableList: any;
  fileChangeListener(event: any, table: string): void {
    //file upload event
    var target = event.target || event.srcElement;
    var files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert(this._translate.currentLang == 'en' ? "Please import valid .csv file." : "الرجاء استيراد ملف .csv صالح.");
        this.fileReset();
      }
      this.fileList = event.target.files;
      this.tableList = table;
    }
  }
  import() {
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', this.tableList);
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/pabx_switch_csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.hidePopUp('modalImport');
        this.loadData();
        $('.app-loader').hide();
        alert("Import done successfully.");
      },
        error => { console.log(error) }
      );
    }
  }

  showViewPopup(external: any) {
    // removing unnecessary column before export.
    // console.log(external);
   this.ExternalCategory = external.category;
   this.ExternalAccountNo  = external.account_no;
   this.ExternalTelephoneNo  = external.telephone_no;
   this.ExternalOoredooCustomerNo  = external.Ooredoo_Customer_no;
   this.ExternalAuthority  = external.authority;
   this.ExternalDateInstallation = external.date_installation;
   this.ExternalDistributionMenu  = external.Distribution_Menu;
   this.ExternalDistributionUnit  = external.Distribution_Unit;
   this.ExternalLocation = external.location;
   this.ExternalRequestReferNo  = external.request_refe_no;
   this.ExternalUserName  = external.username;
   this.ExternalTypeService  = external.type_service;
   this.ExternalCustomerName  = external.customer_name;
   this.ExternalDidNumberRange  = external.did_number_range;
   this.ExternalPackage  = external.package;
   this.ExternalMdfInfo  = external.mdf_info;
   this.ExternalDpInfo  = external.dp_info;
   this.ExternalCConnectedWallSocketInfo  = external.connected_wall_socket_info;
    $('#modalViewExternalLines').modal('show');
  }

  importRent() {
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', this.tableList);
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/pabx_switch_csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.hidePopUp('modalImport');
        this.loadData();
        $('.app-loader').hide();
        alert("Import done successfully.");
      },
        error => { console.log(error) }
      );
    }

  }

  closeandClearAdvanceSearch() {
    this.showAdvanceSearch = false;
    this.searchCategory = '';
    this.searchAccountNo = '';
    this.searchTelephoneNo = '';
    this.searchOoredooCustomerNo = '';
    this.searchAuthority = '';
    this.searchDateInstallation = '';
    this.searchDistributionMenu = '';
    this.searchDistributionUnit = '';
    this.searchLocation = '';
    this.searchRequestRefNo = '';
    this.searchUserName = '';
    this.searchTypeService = '';
    this.searchCustomerName = '';
    this.searchDidNumberRange = '';
    this.searchPackage = '';
    this.searchMdfInfo = '';
    this.searchDpInfo = '';
    this.searchConnectedWallSocketInfo = '';
    this.resetSearchDropDownValues();
  }


  fileReset() {
    this.fileImportInput.nativeElement.value = "";
  }

  deleteExternalLines(emp: any) {
    let body = new URLSearchParams();
    body.append('id', this.selectedDeactivateExternalLines.id);
    body.append('action', 'deleteExternalLines');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate');
  }

  deleteExternalLinesRents(emp1: any) {
    let body = new URLSearchParams();
    body.append('id', this.selectedDeactivateExternalLinesRents.id);
    body.append('action', 'deleteExternalLinesRent');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
        this.hidePopUp('modalDeactivate1');
      }, error => {
        console.log(error.json());
      });

  }

  showDeactivateExternalLinesPopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateExternalLines = emp;
  }
  showDeactivateExternalLinesRentPopup(emp1: any) {
    $('#modalDeactivate1').modal('show');
    this.selectedDeactivateExternalLinesRents = emp1;
  }

  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }
};

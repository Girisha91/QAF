import { Pipe } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
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

Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-pabx-routingtable',
  templateUrl: './pabx-routingTable.component.html',
  styleUrls: [('./pabx-routingTable.component.css').toString()]
})
export class PabxRoutingTableComponent {

  environment: any = environment;
  showHideAllRows: boolean;
  showAdvanceSearch: boolean;
  selectedDeactivateEmployee: any;
  searchableList: any;
  isDesc: boolean = false;
  column: string = 'Name';
  subscription: Subscription;
  nodeSearch: any = '';
  systemSearch: any = '';
  phyAddressSearch: any = '';
  terminalSearch: any = '';
  rackAddressSearch: any = '';
  boardAddressSearch: any = '';
  setAddressSearch: any = '';
  //SMS Observables
  SmsNode: string;
  SmsRoutingNo: string;
  SmsCallNumber: any;
  //checkbox ngmodel
  checkNode: boolean = false;
  checkRoutingNo: boolean = false;
  checkCallNumber: boolean = false;
  lastUpdatedDate: any;
  txtToNumber: string;


  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];
  SearchFrc_crp_unit_reg_dir: any = '';
  pager: any = {};// pager object

  // paged items
  pagedItems: any[];
  rankList: any[] = [];//= ["","Major","Major General","Brigadier", "Colonel","Lt Colonel","Captain","lieutenant"];
  forceList: any[] = [];
  unitList: any[] = [];
  corpsList: any[] = [];
  regimentList: any[] = [];
  directorateList: any[] = [];
  distributionListSearch: any = '';
  distributionUnitSearch: any = '';

  distributionList: any[] = [];
  distributionUnit: any[] = [];

  // Declare local variable
  direction: number;
  isLangArabic: boolean;
  currentLanguage: string;
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  // Change sort function to this: 
  @ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private excelService: ExcelService, private formBuilder: FormBuilder, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];

    self.showHideAllRows = false;
    self.showAdvanceSearch = true;
    self.EmployeeDetails = [];
  };
  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.searchableList =
          ['Node', 'System', 'Physical_Address', 'Terminal_Type', 'Rack_Address', 'Board_Address', 'Set_Address']
        this.Permissions();
        this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
        this.searchForm = this.formBuilder.group({
          items: this.formBuilder.array([this.createItem()])
        });
      }

    } else {
      this.router.navigate(['/login']);
    }
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: '',
      fieldValue: '',
    });
  }

  deleteAction(i: number) {
    this.items.removeAt(i);
  }

  get items(): FormArray {
    return this.searchForm.get('items') as FormArray;
  };

  addItem(): void {
    this.items.push(this.createItem());
  }

  public OnSubmit(formValue: any) {
    let body = new URLSearchParams();
    body.append('items', JSON.stringify(formValue));
    body.append('action', "routing");

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

  resetSearchDropDownValues() {
    $('.searchRank').prop('selectedIndex', '0');
    $(".search-distributionList").prop('selectedIndex', '0');
    $(".search-distributionUnit").prop('selectedIndex', '0');
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
      if (_i != 12 && _i != 13) {
        this.nodeArray.push('Node ' + _i)
      }
    }
  }

  public searchKeyArray: any = [];
  loadData() {
    this.searchKeyArray = [ { "item": "Node", "label": "Node" }, { "item": "Routing_No", "label": "Routing No" }, { "item": "Call_Number", "label": "Call Number" }];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', "routing");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json()).subscribe((res: any) => {
        if (res.code == 100) {
          this.EmployeeDetails = res.data;
          this.getNodeArray();
          this.lastUpdatedDate = res.lastDate;
        } else {
          this.EmployeeDetails = [];
        }
      });

    if (this.currentLanguage == 'en') {
      this.isLangArabic = false;
    } else {
      this.isLangArabic = true;
    }
  }

  setClickedRow = function (emp: any) {
    emp.highLightRow = !emp.highLightRow;
  }




  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };




  showUploaPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }
  fileList: any;
  fileChangeListener(event: any): void {
    //file upload event  
    var target = event.target || event.srcElement;
    var files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert(this._translate.currentLang == 'en' ? "Please import valid .csv file." : "???????????? ?????????????? ?????? .csv ????????.");
        this.fileReset();
      }
    }

    this.fileList = event.target.files;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
  }
  import() {
    if (this.fileList.length > 0) {
      $(".app-loader").show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', "routing");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/pabx_csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        $(".app-loader").hide();
        this.hidePopUp('modalImport');
        alert("Import done successfully.");
      },
        error => { console.log(error) }
      );
    }
  }
  showDeactivateEmployeePopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateEmployee = emp;
  }

  exportToExcel(event: any) {
    let dataArray = this.EmployeeDetails;
    for (var item in dataArray) { // removing unnecessary column before export.
      delete dataArray[item].id;
      delete dataArray[item].status;
    }
    this.excelService.download(dataArray, 'export_pabx_routingTable');
  }

  deactivateEmp() {
    this.http.get(environment.apikey + "/generateJsonUrl.php?id=" + this.selectedDeactivateEmployee.id + "&oper=delete")
      .map(res => res)
      .subscribe(data => {
        data = data;
        this.loadData();
      });
    this.hidePopUp('modalDeactivate');
  }

  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }

  onChange(event:any){
    let value = event.target.value;
   if(value == 'Node'){
    $(event.target).parent().find('input').addClass('hide').removeClass('inline-display');
    $(event.target).parent().find('.form-control.node-select').removeClass('hide').addClass('inline-display');
   }
   else if(value == 'Routing_No'){
    $(event.target).parent().find('input').removeClass('hide').addClass('inline-display'); 
   }
   else {
     $(event.target).parent().find('input').removeClass('hide').addClass('inline-display');
   }
 }

  showSMSPopup(employee: any) {
    this.resetSmsValue();
    this.SmsNode = employee.Node;
    this.SmsRoutingNo = employee.Routing_No;
    this.SmsCallNumber = employee.Call_Number;
    $('#modalSendSMS').modal('show');
  }

  checkAllCheckbox() {
    if ($("#checkAllIds").prop("checked") && this.SmsNode != '') {
      this.checkNode = true;
    } else {
      this.checkNode = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsRoutingNo != '') {
      this.checkRoutingNo = true;
    } else {
      this.checkRoutingNo = false;
    }


    if ($("#checkAllIds").prop("checked") && this.SmsCallNumber != '') {
      this.checkCallNumber = true;
    } else {
      this.checkCallNumber = false;
    }

  }

  sendSMS() {

    if (this.txtToNumber.trim().length > 0) {
      var receipents = this.txtToNumber.trim();
    } else {
      alert(this._translate.currentLang == 'en' ? "enter recipent no." : "???????? ?????????????? ????.");
      return false;
    }
    var message = '';

    if (this.checkNode == true) {

      message += "Node :" + this.SmsNode.trim() + "\n";
      //"???????? ??????????"+ this.SmsNode.trim() +"\n";
    }
    
    if (this.checkRoutingNo == true) {
      message += "Routing No:" + this.SmsRoutingNo.trim() + "\n";
      //this.SmsName.trim() +":?????? \n";

    }
    if (this.checkCallNumber == true) {
      message += "Call Number:" + this.SmsCallNumber.trim() + "\n";
      //this.SmsIpAddress.trim() +":????????\n";
    }

    let body = new URLSearchParams();
    body.append('recipient', receipents);
    body.append('message', message);
    body.append('action', 'sendSms')
    this.http.post(environment.apikey + '/generateJsonUrl.php?language=' + this._translate.currentLang, body)
      .subscribe((data: any) => {
        var obj = JSON.stringify(data["_body"]).trim();
        this.hidePopUp('modalSendSMS');
      }, error => {
        console.log(error.json());
      });
  }
  resetSmsValue() {
    this.txtToNumber = "";
    this.checkNode = false;
    this.checkRoutingNo = false;
    this.checkCallNumber = false;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }


};



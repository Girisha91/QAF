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
  selector: 'app-store-supplier',
  templateUrl: './store-supplier.component.html',
  styleUrls: [('./store-supplier.component.css').toString()]
})
export class StoreSupplierComponent {

  environment: any = environment;

  isDesc: boolean = false;
  direction: number;
  column: string = 'Name';
  subscription: Subscription;

  selectedDeactivateSupplier: any;
  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;
  userPermissionInfo: any;
  userRoleName: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];

  pager: any = {};// pager object
  fileList:any;
  // paged items
  pagedItems: any[];
  showMenu:boolean;
  // Declare local variable
  isLangArabic: boolean;
  currentLanguage: string;
  sub = new Subject();
  userRoleId: any;
  lastUpdatedDate: any = '';
  setClickedRow: Function;
  // Change sort function to this:
  @ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private excelService: ExcelService, private formBuilder: FormBuilder, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.excelService = excelService;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];
    self.EmployeeDetails = [];
    this.setClickedRow = function (emp: any) {
      emp.highLightRow = !emp.highLightRow;
    }

  };
  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.Permissions();
        this.sharedService.getVisibility().subscribe((value:any) => this.showMenu = value);
        this.searchForm = this.formBuilder.group({
          items: this.formBuilder.array([this.createItem()])
        });
      }

    } else {
      this.router.navigate(['/login']);
    }
  }

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
      delete dataArray[item].status;
    }
    this.excelService.download(dataArray, 'export_ExternalLines');
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
    body.append('action', "supplierList");

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
      if (_i >= 0 && _i <10 ){
        this.nodeArray.push('Node ' + '0' + _i)
      }
      else if (_i != 12 && _i != 13) {
        this.nodeArray.push('Node ' + _i)
      }
    }
  }


  public searchKeyArray: any = [];
  loadData() {
    this.searchKeyArray = [{"item":"sup_bus_name","label":"sup bus name"},{"item":"sup_ref_name","label":"sup ref name"},{"item":"contact_person_name1","label":"contact person name1"},{"item":"address1","label":"address1"},{"item":"country","label":"country"},{"item":"contact_person_name2","label":"contact person name2"},{"item":"address2","label":"address2"},{"item":"po_box_no","label":"po box no"},{"item":"telephone1","label":"telephone1"},{"item":"telephone2","label":"telephone2"},{"item":"telephone3","label":"telephone3"},{"item":"fax_no_1","label":"fax no 1"},{"item":"fax_no_2","label":"fax no 2"},{"item":"fax_no_3","label":"fax no 3"},{"item":"email1","label":"email1"},{"item":"email2","label":"email2"},{"item":"website","label":"website"},{"item":"descriptions","label":"descriptions"},{"item":"status","label":"status"},{"item":"added_at","label":"added at"},{"item":"updated_at","label":"updated at"}];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', "supplierList");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          for (let item in res.data) {
            res.data[item]["highLightRow"] = false;
          }
          this.EmployeeDetails = res.data;
          this.EmployeeDetails
          this.lastUpdatedDate = res.lastDate;
          this.getNodeArray();
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



  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  showUploaPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }

  fileChangeListener(event: any): void {
    //file upload event
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

  import() {
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', "store_supplier");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/csv_store_suply_import.php";
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
  deleteSupplier(emp:any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('id', this.selectedDeactivateSupplier);
    body.append('action', 'deleteSupplier');
    body.append('username',userRoleName);
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate');
  }
  showDeactivateSupplierPopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateSupplier = emp;
  }
  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }
  toggleMenu(){
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }
  closeAndRedirect() {
    this.router.navigate(['/store-items']);
  }
};

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
  selector: 'blockWiringList',
  templateUrl: './blockWiringList.component.html',
  styleUrls: [('./blockWiringList.component.css').toString()]
})
export class blockWiringListComponent {
  environment: any = environment;

  isDesc: boolean = false;
  column: string = 'Name';
  subscription: Subscription;
  environment_apikey: string;
  selectedDeactivateEmployee: any;
  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;
  selectedDeactivateBlockWiring:any;
  selectedDeactivateBlockWiringAttach:any;
  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];

  pager: any = {};// pager object

  // paged items
  pagedItems: any[];

  // Declare local variable
  direction: number;
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
    this.environment_apikey = environment.apikey;
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
    let body = new URLSearchParams();
    body.append('items', JSON.stringify(formValue));
    body.append('action', "blockWiringList");

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

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

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
              let value4= value3[key4];
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
    this.searchKeyArray = [];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', "blockWiringList");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          this.searchKeyArray = [
            {"item":"type_enquiry","label":"type enquiry","oi":"bw"},
            {"item":"enquiry_from","label":"enquiry from","oi":"bw"},
            {"item":"client_dev_name","label":"client dev name","oi":"bw"},
            {"item":"consultant_name","label":"consultant name","oi":"bw"},
            {"item":"contractor_name","label":"contractor name","oi":"bw"},
            {"item":"project_name","label":"project name","oi":"bw"},
            {"item":"project_no","label":"project no","oi":"bw"},
            {"item":"distribution_menu","label":"distribution menu","oi":"bw"},
            {"item":"distribution_unit","label":"distribution unit","oi":"bw"},
            {"item":"location","label":"location","oi":"bw"},
            {"item":"pin_no","label":"pin no","oi":"bw"},
            {"item":"drawing_name","label":"drawing name","oi":"bw"},
            {"item":"drawing_no","label":"drawing no","oi":"bw"},
            {"item":"originator","label":"originator","oi":"bw"}
          ];
          
          for (let item in res.data) {
            res.data[item]["highLightRow"] = false;
          }
          this.EmployeeDetails = res.data;
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



 
  showUploaPopUp(where: string) {
    this.fileImportInput.nativeElement.value = "";
    $('#' + where).modal('show');
  }
fileList:any;
tableList:any;
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
       this.tableList =table;
    }
  }
   import(){
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', this.tableList);
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      //headers.append('Content-Type', 'json');
      //headers.append('Accept', 'application/json');
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
  importRent(){
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', this.tableList);
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      //headers.append('Content-Type', 'json');
      //headers.append('Accept', 'application/json');
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

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
  }
  deleteBlockWiring(emp: any) {
    let body = new URLSearchParams();
    body.append('id', this.selectedDeactivateBlockWiring.id);
    body.append('action', 'deleteBlockWiring');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate');
  }
  showDeactivateBlockWiringPopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateBlockWiring = emp;
  }
  deleteBlockWiringAttach(emp1: any) {
    let body = new URLSearchParams();
    body.append('id', this.selectedDeactivateBlockWiringAttach.id);
    body.append('action', 'deleteBlockWiringAttach');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate1');
  }
  showDeactivateBlockWiringAttachmentPopup(emp1: any) {
    $('#modalDeactivate1').modal('show');
    this.selectedDeactivateBlockWiringAttach = emp1;
  }
  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }
  closeAndRedirect() {
    this.router.navigate(['/employee']);
  }
};

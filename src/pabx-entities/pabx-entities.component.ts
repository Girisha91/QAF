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
import {ExcelService} from '../app/shared/excel.service';
Pipe({
  name: 'SearchFilter'
});



declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-pabx-entities',
  templateUrl: './pabx-entities.component.html',
  styleUrls: [('./pabx-entities.component.css').toString()]
})
export class PabxEntitiesComponent {

  environment: any = environment;

  isDesc: boolean = false;
  column: string = 'Name';
  subscription: Subscription;
 

  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

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
  lastUpdatedDate:any = '';
  setClickedRow : Function;
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
    this.setClickedRow = function(emp:any){
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
  
  exportToExcel(event:any) {
    let dataArray = this.EmployeeDetails;
      for(var item in dataArray){ // removing unnecessary column before export.
       delete dataArray[item].id;
       delete dataArray[item].status;
      }
      console.log("value of data array is",dataArray,"type of data array is",typeof(dataArray))
   this.excelService.download(dataArray,'export_Entities');
  }
  

  get items(): FormArray {
    return this.searchForm.get('items') as FormArray;
  };

  addItem(): void {
    this.items.push(this.createItem());
  }

  deleteAction(i: number) {
    console.log("value of i is",i);
	  this.items.removeAt(i);
  }

  public OnSubmit(formValue: any) {
    let body = new URLSearchParams();
    body.append('items', JSON.stringify(formValue));
    body.append('action', "entities");
console.log("value of body is",body);
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
    this.searchKeyArray = [{"item":"Node","label":"Node"},{"item":"Entity_Number","label":"Entity Number"},{"item":"Name","label":"Name"},{"item":"UTF_8_Name","label":"UTF 8 Name"},{"item":"Attendant_Group_Manager","label":"Attendant Group Manager"},{"item":"Priority","label":"Priority"},{"item":"Emergency_call_to_attd","label":"Emergency call to attd"},{"item":"Traffic_Overflow","label":"Traffic Overflow"},{"item":"Installation_No_ISDN","label":"Installation No ISDN"},{"item":"SupplementInstallNo_ISDN","label":"SupplementInstallNo ISDN"},{"item":"Caller_ID_Secret","label":"Caller ID Secret"},{"item":"AdvOfCharg2_requests_AOC2","label":"AdvOfCharg2 requests AOC2"},{"item":"AdvOfCharg3_requests_A0C3","label":"AdvOfCharg3 requests A0C3"},{"item":"Auto_Locking","label":"Auto Locking"},{"item":"Voice_Mail_Box_Nofor_attendt","label":"Voice Mail Box Nofor attendt"},{"item":"Trunk_Group_ID","label":"Trunk Group ID"},{"item":"External_Callback_Table","label":"External Callback Table"},{"item":"Voice_Mail_DirNo","label":"Voice Mail DirNo"},{"item":"Password_for_A4630","label":"Password for A4630"},{"item":"Language_ID","label":"Language ID"},{"item":"Call_DistributionOverflow_Routing_No","label":"Call DistributionOverflow Routing No"},{"item":"Call_DistributionForwarding_on_routing","label":"Call DistributionForwarding on routing"},{"item":"Call_Distribution1st_Night_Routing","label":"Call Distribution1st Night Routing"},{"item":"Call_Distribution2nd_Night_Routing","label":"Call Distribution2nd Night Routing"},{"item":"Call_Distribution3nd_Night_Routing","label":"Call Distribution3nd Night Routing"},{"item":"Call_Distribution1st_Day_Routing","label":"Call Distribution1st Day Routing"},{"item":"Call_Distribution2nd_Day_Routing","label":"Call Distribution2nd Day Routing"},{"item":"Call_Distribution3nd_Day_Routing","label":"Call Distribution3nd Day Routing"},{"item":"Call_Distribution1st_MODE_1_Routing","label":"Call Distribution1st MODE 1 Routing"},{"item":"Call_Distribution2nd_MODE_1_Routing","label":"Call Distribution2nd MODE 1 Routing"},{"item":"Call_Distribution3nd_MODE_1_Routing","label":"Call Distribution3nd MODE 1 Routing"},{"item":"Call_Distribution1st_MODE_2_Routing","label":"Call Distribution1st MODE 2 Routing"},{"item":"Call_Distribution2nd_MODE_2_Routing","label":"Call Distribution2nd MODE 2 Routing"},{"item":"Call_Distribution3nd_MODE_2_Routing","label":"Call Distribution3nd MODE 2 Routing"},{"item":"Calls_PriorityNormal_Public_Trk_grp_Entity","label":"Calls PriorityNormal Public Trk grp Entity"},{"item":"Calls_PriorityUrgent_Public_Trk_grp_Entity","label":"Calls PriorityUrgent Public Trk grp Entity"},{"item":"Calls_PriorityNormal_Private_trk_grp_Entity","label":"Calls PriorityNormal Private trk grp Entity"},{"item":"Calls_PriorityUrgent_Private_Trk_grp_Entity","label":"Calls PriorityUrgent Private Trk grp Entity"},{"item":"Calls_PriorityNormal_Public_DID_Entity","label":"Calls PriorityNormal Public DID Entity"},{"item":"Calls_PriorityUrgent_Public_DID_Entity","label":"Calls PriorityUrgent Public DID Entity"},{"item":"Calls_PriorityNormal_Private_DID_Entity","label":"Calls PriorityNormal Private DID Entity"},{"item":"Calls_PriorityUrgent_Private_DID_Entity","label":"Calls PriorityUrgent Private DID Entity"},{"item":"Calls_PriorityNormal_Int_Callee_DID_Entity","label":"Calls PriorityNormal Int Callee DID Entity"},{"item":"Calls_PriorityUrgent_Int_Callee_DID_Entity","label":"Calls PriorityUrgent Int Callee DID Entity"},{"item":"Calls_PriorityNormal_Public_Non_Answer_DID","label":"Calls PriorityNormal Public Non Answer DID"},{"item":"Calls_PriorityUrgent_Public_Non_Answer_DID","label":"Calls PriorityUrgent Public Non Answer DID"},{"item":"Calls_PriorityNormal_Private_Non_Answer_DID","label":"Calls PriorityNormal Private Non Answer DID"},{"item":"Calls_PriorityUrgent_Private_Non_Answer_DID","label":"Calls PriorityUrgent Private Non Answer DID"},{"item":"Voice_GuidesWaiting_Guide","label":"Voice GuidesWaiting Guide"},{"item":"Voice_GuidesAttendant_Waiting_Guide","label":"Voice GuidesAttendant Waiting Guide"},{"item":"Overflow_Timer","label":"Overflow Timer"},{"item":"Company_Call_Number","label":"Company Call Number"},{"item":"Centralized_Centrex_Serv","label":"Centralized Centrex Serv"},{"item":"Overflow_LDAP_Phone_Book","label":"Overflow LDAP Phone Book"},{"item":"status","label":"status"}];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', "entities");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
        for(let item in res.data){
          res.data[item]["highLightRow"] = false;
        }
          this.EmployeeDetails = res.data;
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

  fileList:any;
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

  import(){
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', "entities");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/pabx_csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        this.hidePopUp('modalImport');
        $('.app-loader').hide();
        alert("Import done successfully.");
      },
        error => { console.log(error) }
      );
    }
  }
  hidePopUp(popUpId:any)
    { 
      $('#'+popUpId).modal('hide');
    }
};

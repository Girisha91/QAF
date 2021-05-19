import { Pipe } from '@angular/core';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
//import { Http, URLSearchParams } from '@angular/http';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { FileUtil } from '../app/file.util';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { Constants } from '../app/csv.constants';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderrByPipe } from '../app/orderBy.pipe';
import { FaultJobPipe } from '../app/shared/faultJob.pipe'
import { FilterPipe } from '../app/genericSearch.pipe';
Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'faultIssueManagement',
  templateUrl: './fault-issue-management.component.html',
  styleUrls: [('./fault-issue-management.component.css').toString()]
})
export class FaultIssueManagementComponent {
  @ViewChildren('someVar') filteredItems: any;
  environment: any = environment;
  item:any;
  ah:any;
  isDesc: boolean = false;
  column: string = 'supplier';
  subscription: Subscription;
  showAdvanceSearch: boolean;
  
  angularLogo = './src/assets/mobile.gif';
  radioSelected:any;
  errorCurrentStatus: string = '';

  userPermissionInfo: any;
  searchOpNumber: any;
  searchOpStatus: any;
  searchOpCreatedDate: any;
  searchOpAssignDate: any;
  searchSiteName: any;
  searchDepartment: any;
  searchSeverity: any;
  searchOpType: any;
  searchOpSubType: any;
  searchReportedBy: any;
  searchReportedTo: any;
  searchDescription: any;

  OpTypeList:any[];
  OpStatusList:any[];
  siteList:any[];
  DepartmentList: any[];
  SeverityList:any[];
  OpReportedByList:any[];
  OpReportedToList:any[];
  OpSubTypeList:any[];
  allData:any[];
 
  currentStatus:any[];

  fileList:any;
  selectedTicketDeactivate:any;
  selectedTicketDeactivateHistory:any;
  ticketHistNodata:any[];

  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  FaultIssueDetails: any[];
  FaultIssueDetailsFilterJob: any[];
  FaultFilterJob: any[]=[];


 

  // Declare local variable
  direction: number;
  isLangArabic: boolean;
  currentLanguage: string;
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  setClickedRow: Function;
  // Change sort function to this:
  @ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private formBuilder: FormBuilder, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {


    this.ah = {};

    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];
    this.FaultIssueDetails = [];
    this.OpTypeList = [
      {
        id: '1',
        name: "Job"
      },
      {
        id: "2",
        name: "Fault"
      },
      
    ];
    this.OpStatusList = [
      {
        id: '1',
        name: "Open"
      },
      {
        id: "2",
        name: "Completed"
      },
      {
        id: "3",
        name: "Pending"
      },
      {
        id: "4",
        name: "Closed"
      }
    ];
   

    this.setClickedRow = function (emp: any) {
      emp.highLightRow = !emp.highLightRow;
    }
    self.showAdvanceSearch = true;
  };
  public searchForm: FormGroup;

  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
     
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.Permissions();
        this.getDepartmentList();
        this.getSeverityList();
        this.getOpreportedByList();
        this.getOpreportedToList();
        this.getOpreportedSubtypeList();
        this.getUserName();
        this.getSiteList();
        this.historyCurrentStatus();
        this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
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
                    //console.log('value5');
                    //console.log(value5);
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


  onItemChange(value:any){
    this.FaultFilterJob=[];
    for(let i in this.FaultIssueDetailsFilterJob){
      if(this.FaultIssueDetailsFilterJob[i].operation_type == value){
        this.FaultFilterJob.push(this.FaultIssueDetailsFilterJob[i]);
      }
    }
    this.FaultIssueDetails=this.FaultFilterJob;
    //console.log( this.FaultIssueDetails);
  }

  getSiteList() {
    let body = new URLSearchParams();
    body.append('action', 'getSiteName');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.siteList = res;
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

  getSeverityList() {
    let body = new URLSearchParams();
    body.append('action', 'getSeverityData');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.SeverityList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }
  
  getOpreportedByList() {    
    let body = new URLSearchParams();
    body.append('action', 'getOperationReportedByData');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.OpReportedByList = res;
          // console.log("By=>",this.OpReportedByList)
        }
      }, error => {
        console.log(error.json());
      });
  }
  getOpreportedToList() {
    let body = new URLSearchParams();
    body.append('action', 'getOperationReportedToData');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.OpReportedToList = res;
          // console.log("to=>",this.OpReportedToList);
        }
      }, error => {
        console.log(error.json());
      });
  }

  getOpreportedSubtypeList() {
    let body = new URLSearchParams();
    body.append('action', 'getOperationSubTypes');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {          
          this.OpSubTypeList = res;
          // console.log("to=>",this.OpReportedToList);
        }
      }, error => {
        console.log(error.json());
      });
  }
  historyCurrentStatus() {
    let body = new URLSearchParams();
    body.append('action', 'getHistoryCurrentStatus');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.currentStatus = res;
          // console.log( "==========",this.currentStatus);
        }
      }, error => {
        console.log(error.json());
      });
  }
  
  showAllData(ticNo:any){
    let body = new URLSearchParams();
    body.append('ticket_number', ticNo);
    body.append('action', 'getEachTicketandHistory');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.allData = res;
          // console.log( "*******",this.allData);
        }
      }, error => {
        console.log(error.json());
      });
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


  public searchKeyArray: any = [];

  loadData() {
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('action', 'getallJobFaultDetails');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          for (let item in res) {
            res[item]["hideInnerEmpRow"] = false;
            for(let item2 in res[item]){
              // console.log(res[item][item2]);
              if((res[item][item2]==null) || (res[item][item2]=='undefined')){
                res[item][item2]="";
              }
            }
          }
          this.FaultIssueDetails = res;
          this.FaultIssueDetailsFilterJob =  this.FaultIssueDetails;
          // this.FaultIssueDetails =  this.FaultIssueDetailsFilterJob;
        // console.log( this.FaultIssueDetails);
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
  getUserName() {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    this.ah.recorded_by_id = userRoleName;
    // this.fj.recorded_by_id = this.RecordedBy;
  }
  



  showEditListPopup(employee: any) {
    $('#modalListItem').modal('show');
  }

  onChange(event: any) {

    var files = event.srcElement.files;
    //console.log(files);
  }
  get items(): FormArray {
    return this.searchForm.get('items') as FormArray;
  };


  deleteAction(i: number) {
    this.items.removeAt(i);
  }

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  Printme() {
    window.print();
  }


  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }

  resetSearchDropDownValues() {
    $('.searchSetType').prop('selectedIndex', '0');
    $(".searchNoneNo").prop('selectedIndex', '0');
    $(".searchActNo").prop('selectedIndex', '0');
    $(".searchCampName").prop('selectedIndex', '0');
    $(".searchUserType").prop('selectedIndex', '0');
  }

  closeandClearAdvanceSearch() {
    this.showAdvanceSearch = false;
    this.searchOpNumber = '';
    this.searchOpStatus = '';
    this.searchOpCreatedDate = '';
    this.searchOpAssignDate = '';
    this.searchSiteName = '';
    this.searchDepartment = '';
    this.searchSeverity = '';
    this.searchOpType = '';
    this.searchOpSubType = '';
    this.searchReportedBy = '';
    this.searchReportedTo = '';
    this.searchDescription = '';

    this.resetSearchDropDownValues();
  }

  addHistory(data:any){
    let isModelValid = this.isModelValid(data);
    if (!isModelValid) {
      return;
    }
    let body = new URLSearchParams();
    var userCookie = JSON.parse(this.cookieService.get('user'));
    data.recorded_by_id = userCookie.userId;
    body.append('action', 'addHistory');
    body.append('data', JSON.stringify(data));
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          alert('History Added')
          this.hidePopUp('modalSendSMS');
          this.loadData();
          this.ah ={};
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  updateHistoryData(hisData:any){
    let isModelValid = this.isModelValid(hisData);
    if (!isModelValid) {
      return;
    }
    let body = new URLSearchParams();
    var userCookie = JSON.parse(this.cookieService.get('user'));
    hisData.recorded_by_id = userCookie.userId;
  // console.log(hisData);
    body.append('action', 'editHistory');
    body.append('data', JSON.stringify(hisData));
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
    .map(res => res.json())
    .subscribe(data => {
      if (data.code == 100) {
        alert('History Added')
        this.hidePopUp('modalSendSMSHistory');
          this.loadData();
      } else {
        alert(data.message);
      }
    },
      // .subscribe(data => {
      //   if (data.code == 100) {

      //   }
      //   data = data;
      //   this.closeAndRedirect();
      // }, 
      error => {
        console.log(error);
      });
  }

  fileChangeListener(event: any): void {
    //file upload event
    var target = event.target || event.srcElement;
    var files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert("Please import valid .csv file.");
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
      formData.append('module', "job_fault");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/csv_ticket_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        this.hidePopUp('modalImport');
        $('.app-loader').hide();
        alert("Upload complete");
      },
        error => { console.log(error) }
      );
    }
  }

  closeAndRedirect() {
    this.router.navigate(['/faultIssueManagement']);
  }
  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  };
  showSMSPopup(ticketNumber:any) {
    //console.log(ticketNumber);
    this.ah={};
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    this.ah.recorded_by_id = userRoleName;
    this.ah.ticket_number=ticketNumber;
    
    $('#modalSendSMS').modal('show');
  }
  showSMSPopupHistory(ticketNumber:any, hisNo:any) {
    this.ah = [];
   // console.log(ticketNumber,hisNo);
    this.ah.ticket_number=ticketNumber;
    this.ah.history_number=hisNo;
    let body = new URLSearchParams();
    body.append('ticket_number', this.ah.ticket_number);
    body.append('history_number', this.ah.history_number);
    body.append('action', 'getOneHistory');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.ah = res[0];
         // console.log("ticketdata",this.ah);
          this.ah.recorded_by_id = this.ah.recorded_by;
        }
      }, error => {
        console.log(error.json());
      });


    $('#modalSendSMSHistory').modal('show');
  }
  showDeactivateTicketPopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedTicketDeactivate = emp;
   //  console.log(emp);
  }
  showDeactivateTicketPopupHistory(tic: any,his:any) {
    $('#modalDeactivateHistory').modal('show');
    this.selectedTicketDeactivate = tic;
     this.selectedTicketDeactivateHistory = his;
   //  console.log(tic);
  }
  
  deactivateTicket(emp: any) {
    let body = new URLSearchParams();
    body.append('ticket_number', this.selectedTicketDeactivate);
    body.append('action', 'DeactivateJobFault');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate');
  }
  deactivateTicketHistory(tic: any,his:any) {
    
    let body = new URLSearchParams();
    body.append('ticket_number', this.selectedTicketDeactivate);
    body.append('history_number', this.selectedTicketDeactivateHistory);
    body.append('action', 'DeactivateEachHistory');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivateHistory');
  }
  

  
  showUploaPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }

  isModelValid(faultJob: any) {
    // console.log(faultJob);
    let isValid = true;
    
    this.errorCurrentStatus = '';

    if (Object.keys(faultJob).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.current_status_id == 'undefined') {
      this.errorCurrentStatus = 'Operation Status is Required';
      isValid = false;
    }
    
    return isValid;
  }
  cleardata(){
    this.FaultIssueDetails = [];
   this.radioSelected = null;
  this.FaultIssueDetails = this.FaultIssueDetailsFilterJob;
  }

}



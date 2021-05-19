import { Pipe } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { FileUtil } from '../app/file.util';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelService } from '../app/shared/excel.service';
import { ExcelServiceWorkBook } from '../app/shared/excelworksheet.service';
import { DatePipe } from '@angular/common'
import { any } from 'bluebird';
Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'fj-report',
  templateUrl: './fault-job-report.component.html',
  styleUrls: [('./fault-job-report.component.css').toString()]
})
export class fJReportComponent {

  environment: any = environment;
  showHideAllRows: boolean;
  department: any;
  status: any;
  OperationType: any;
  // Declare local variable
  direction: number;
  isLangArabic: boolean;
  FaultIssueDetails: any[];
  finalArrayItems: any[];
  filteredExportItems: any[] = [];
  filteredSearchResultDetails: any[];
  itemsExportDetails: any[];
  OpTypeList: any[];
  FullArrayDetails: any[];
  OpStatusList: any[];
  DepartmentList: any[];
  OpReportedToList: any[];
  OpReportedFullList: any[];
  OpReportedObj:any;
  TicketHistoryDetails: any[];
  FullArrayTicketHistoryDetails: any[];
  showTicketList: boolean = true;
  showHistoryList: boolean = false;
  isDesc: boolean = false;
  column: string = 'Name';
  currentLanguage: string;
  PageType: string = "Ticket Number";
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  setClickedRow: Function;
  // Change sort function to this: 
  @ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private excelService: ExcelService, private excelServiceWorkBook: ExcelServiceWorkBook, public datepipe: DatePipe, private formBuilder: FormBuilder, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {
    let self = this;
    this.OpReportedObj ={};
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
        name: "Closed"
      },
      {
        id: "3",
        name: "Completed"
      },
      {
        id: "4",
        name: "Pending"
      }

    ];
    this.setClickedRow = function (emp: any) {
      emp.highLightRow = !emp.highLightRow;
    }
  }
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.userRoleId = this._localStorageService.get('userRoleId');
      }
      this.loadData();
      this.loadData1();
      this.getDepartmentList();
      this.getOpreportedToList();
    } else {
      this.router.navigate(['/login']);
    }
  }

  selectedDepartment(department: any, value: any) {
    if (department == null) {
      this.FaultIssueDetails = this.FullArrayDetails;
      this.TicketHistoryDetails = this.FullArrayTicketHistoryDetails;
    } else {
      if (value == "Ticket Number") {
        this.filteredSearchResultDetails = [];
        for (let itemname in this.FullArrayDetails) {
          if (this.FullArrayDetails[itemname].department == department) {
            this.filteredSearchResultDetails.push(this.FullArrayDetails[itemname]);
          }
        }
        this.FaultIssueDetails = this.filteredSearchResultDetails;
      }
      else {
        this.filteredSearchResultDetails = [];
        for (let itemname in this.FullArrayTicketHistoryDetails) {
          if (this.FullArrayTicketHistoryDetails[itemname].department == department) {
            this.filteredSearchResultDetails.push(this.FullArrayTicketHistoryDetails[itemname]);
          }
        }
        this.TicketHistoryDetails = this.filteredSearchResultDetails;
      }
    }
  }
  selectedStatus(status: any, value: any) {
    if (status == null) {
      this.FaultIssueDetails = this.FullArrayDetails;
      this.TicketHistoryDetails = this.FullArrayTicketHistoryDetails;
    } else {
      if (value == "Ticket Number") {
        this.filteredSearchResultDetails = [];
        for (let itemname in this.FullArrayDetails) {
          if (this.FullArrayDetails[itemname].ticket_status == status) {
            this.filteredSearchResultDetails.push(this.FullArrayDetails[itemname]);
          }
        }
        this.FaultIssueDetails = this.filteredSearchResultDetails;
      }
      else {
        this.filteredSearchResultDetails = [];
        for (let itemname in this.FullArrayTicketHistoryDetails) {
          if (this.FullArrayTicketHistoryDetails[itemname].ticket_status == status) {
            this.filteredSearchResultDetails.push(this.FullArrayTicketHistoryDetails[itemname]);
          }
        }
        this.TicketHistoryDetails = this.filteredSearchResultDetails;
      }
    }
  }
  selectedOperationType(OperationType: any, value: any) {
    if (OperationType == null) {
      this.FaultIssueDetails = this.FullArrayDetails;
      this.TicketHistoryDetails = this.FullArrayTicketHistoryDetails;
    } else {
      if (value == "Ticket Number") {
        this.filteredSearchResultDetails = [];
        for (let itemname in this.FullArrayDetails) {
          if (this.FullArrayDetails[itemname].operation_type == OperationType) {
            this.filteredSearchResultDetails.push(this.FullArrayDetails[itemname]);
          }
        }
        this.FaultIssueDetails = this.filteredSearchResultDetails;
      }
      else {
        this.filteredSearchResultDetails = [];
        for (let itemname in this.FullArrayTicketHistoryDetails) {
          if (this.FullArrayTicketHistoryDetails[itemname].operation_type == OperationType) {
            this.filteredSearchResultDetails.push(this.FullArrayTicketHistoryDetails[itemname]);
          }
        }
        this.TicketHistoryDetails = this.filteredSearchResultDetails;
      }
    }
  }
  selectForm(status: any) {
    if (status == '1') {
      this.PageType = "Ticket Number";
      this.showTicketList = true;
      this.showHistoryList = false;
      this.department = null;
      this.status = null;
      this.OperationType = null;
      this.FaultIssueDetails = this.FullArrayDetails;
    } else {
      this.PageType = "Ticket History";
      this.showTicketList = false;
      this.showHistoryList = true;
      this.department = null;
      this.status = null;
      this.OperationType = null;
      this.TicketHistoryDetails = this.FullArrayTicketHistoryDetails;
    }
  }
  sort(property: any) {
    // console.log(property);
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };
  loadData() {
    let body = new URLSearchParams();
    body.append('action', 'getallJobFaultDetails');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          for (let item in res) {
            res[item]["hideInnerEmpRow"] = false;
          }
          this.FaultIssueDetails = res;
          this.FullArrayDetails = this.FaultIssueDetails;
        }
      }, error => {
        console.log(error.json());
      });
  }
  loadData1() {
    let body = new URLSearchParams();
    body.append('action', 'exportTicketandHistory');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          for (let item in res) {
            res[item]["hideInnerEmpRow"] = false;
          }
          this.TicketHistoryDetails = res;
          this.FullArrayTicketHistoryDetails = this.TicketHistoryDetails;
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

  getOpreportedToList() {
    let body = new URLSearchParams();
    body.append('action', 'getOperationReportedToData');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.OpReportedToList = res;
          this.OpReportedFullList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }

  exportToExcelTicket(event: any) {
    // console.log(event);
    this.itemsExportDetails = [];
    this.finalArrayItems = [];
    this.filteredExportItems = [];
    this.finalArrayItems = event;
    for (let itemname in this.finalArrayItems) {
      delete this.finalArrayItems[itemname].sl_id;
      delete this.finalArrayItems[itemname].hideInnerEmpRow;
      delete this.finalArrayItems[itemname].history_data;
      delete this.finalArrayItems[itemname].reported_to_id;
      delete this.finalArrayItems[itemname].operation_reported_to;
      // for(let itemname2 in this.finalArrayItems[itemname].operation_reported_to){
      //   this.OpReportedObj={};
      //   this.OpReportedObj.push(this.finalArrayItems[itemname].operation_reported_to[itemname2].name);
      // this.finalArrayItems[itemname].operation_reported_to =this.OpReportedObj;
      // }
      // this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"history_data":').join('"History Data":'));
      this.filteredExportItems.push(this.finalArrayItems[itemname]);
    }
    this.itemsExportDetails = this.filteredExportItems;
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"ticket_number":').join('"Ticket Number":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_type":').join('"Operation Type":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"description":').join('"Description":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"ticket_status":').join('"Ticket Status":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"created_date":').join('"Created Date":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"assigned_date":').join('"Assigned Date":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"reported_to_id":').join('"Reported to id":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_sub_type":').join('"Operation Sub Type":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"severity":').join('"Severity":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_reported_by":').join('"Operation Reported By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"department":').join('"Department":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"site_name":').join('"Site Name":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_reported_to_names":').join('"Operation Reported To":'));
    this.excelServiceWorkBook.exportAsExcelFile(this.itemsExportDetails, 'FaultJobTicketDetails');
  }
  exportToExcelHistory(event: any) {
    //  console.log(event);
    this.itemsExportDetails = [];
    this.finalArrayItems = [];
    this.filteredExportItems = [];
    this.finalArrayItems = event;
    for (let itemname in this.finalArrayItems) {
      delete this.finalArrayItems[itemname].sl_id;
      delete this.finalArrayItems[itemname].hideInnerEmpRow;
      delete this.finalArrayItems[itemname].id;
      delete this.finalArrayItems[itemname].history_number;
      delete this.finalArrayItems[itemname].reported_to_id;
      this.filteredExportItems.push(this.finalArrayItems[itemname]);
    }
    this.itemsExportDetails = this.filteredExportItems;
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"ticket_number":').join('"Ticket Number":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_type":').join('"Operation Type":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"description":').join('"Description":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"ticket_status":').join('"Ticket Status":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"created_date":').join('"Created Date":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"assigned_date":').join('"Assigned Date":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"reported_to_id":').join('"Reported to id":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_sub_type":').join('"Operation Sub Type":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"severity":').join('"Severity":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_reported_by":').join('"Operation Reported By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"department":').join('"Department":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"site_name":').join('"Site Name":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"operation_reported_to":').join('"Operation Reported To":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"action_needed_from":').join('"Action Needed From":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"action_taken_by":').join('"Action Taken By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"external_ticket_no":').join('"External Ticket No":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"current_status":').join('"Current Status":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"recorded_by":').join('"Recorded By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"recorded_date":').join('"Recorded Date":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"remarks":').join('"Remarks":'));
    this.excelServiceWorkBook.exportAsExcelFile(this.itemsExportDetails, 'FaultJobTicketHistoryDetails');
  }
  clearStoreItemDetails() {
    this.department = null;
    this.status = null;
    this.OperationType = null;
    this.FaultIssueDetails = this.FullArrayDetails;
    this.TicketHistoryDetails = this.FullArrayTicketHistoryDetails;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
import { LocalStorageService } from 'angular-2-local-storage';
import { any } from 'bluebird';
@Component({
  selector: 'add-job-fault-form',
  templateUrl: './add-job-fault-form.component.html',
  styleUrls: [('./add-job-fault-form.component.css').toString()]
})

export class AddJobFaultFormComponent implements OnInit {

  environment: any = environment;
  item: any;
  fj: any;
  HideUpdate: Boolean;
  hideHistory: Boolean;
  userPermissionInfo: any;
  userPermissionDataInfo: any;
  userRoleName: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  isUniqueValue: Boolean = false;


  //error for fault madule

  errorOperationStatus: string = '';
  errorOperationCreatedDate: string = '';
  errorSiteName: string = '';
  errorDepartment: string = '';
  errorOperationType: string = '';
  errorBreafDescription: string = '';
  errorCurrentStatus: string = '';

  RecordedBy: any;
  OpStatusList: any[];
  OpTypeList: any[];
  DepartmentList: any[];
  SeverityList: any[];
  OpReportedByList: any[];
  OpReportedToList: any[];
  OpSubTypeList: any[];
  siteList: any[];
  currentStatus: any[];
  historyData: any[];
  createdDate: any;
  date: any;
  opr: any;
  currentLanguage: string;
  isLangArabic: Boolean = false;
  list: any[];
  items: string;
  itemName: string;
  showList: boolean;
  data: any;
  pageAction: string;
  constructor(private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.pageAction = action;
    this.fj = {};
    if (action == 'edit' && param) {
      this.opr = 1;
      this.Id = param;
      this.title = 'Update Fault Issue';
      this.isReadOnly = false;
      this.HideUpdate = false;
      this.hideHistory = false;
      this.getTicketData(this.Id);
    } else if (action == 'view' && param) {
      this.isReadOnly = false;
      this.opr = 2;
      this.Id = param;
      this.title = 'View Fault Issue';
      this.isReadOnly = true;
      this.HideUpdate = false;
      this.hideHistory = true;
      this.viewTicketData(this.Id);
    } else {
      this.opr = 0;
      this.HideUpdate = true;
      this.title = 'Add Fault Issue';
      this.hideHistory = false;
      this.isReadOnly = false;
    }

    this.showList = false;
    this.items = '';
    this.itemName = '';

    this.list = [
    ];
    this.list = this.list.map(item => {
      item.selected = false;

      return item;
    });
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
  }

  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {

      }
    } else {
      this.router.navigate(['/login']);
    }
    //console.log("userdata=====", JSON.parse(this.cookieService.get('user')));
    this.getCurrentDate();
    this.getUserName();
    this.getDepartmentList();
    this.getSeverityList();
    this.getOpreportedByList();
    if (this.pageAction != 'edit') {
      this.getOpreportedToList();
    }
    this.getOpreportedToList();
    this.getOpreportedSubtypeList();
    this.getSiteList();
    this.historyCurrentStatus();
  }

  checkUser(idx: number) {
    this.OpReportedToList[idx].selected = !this.OpReportedToList[idx].selected;
    // filter and map an array
    const selectedItems = this.OpReportedToList.filter(items => items.selected === true).map(item => item.id);
    const selectedItemsnames = this.OpReportedToList.filter(itemName => itemName.selected === true).map(item => item.name);
    this.items = selectedItems.join(', ');
    // console.log("items",this.OpReportedToList);
    this.itemName = selectedItemsnames.join(',');
    // console.log(this.items);
    this.fj.reported_to_id = this.items
  }
  getCurrentDate() {
    let today = new Date();
    this.date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    this.fj.created_date = this.date;
    this.fj.assigned_date = this.date;
  }

  getTicketData(tck_num: any) {
    let body = new URLSearchParams();
    body.append('action', 'getEachTicketandHistory');
    body.append('ticket_number', tck_num);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.fj = res[0];
          this.OpReportedToList = this.fj.operation_reported_to.map((data: { selected: boolean; }) => { data.selected = true; return data });
          this.itemName = this.fj.operation_reported_to.map((item: { name: any; }) => item.name);
          this.getOpreportedToListForEdit(this.OpReportedToList);
          // console.log("ticketdata", this.fj);
          //this.fj.severity_id =this.fj.severity;
        }
      }, error => {
        console.log(error.json());
      });
  }
  viewTicketData(tck_num: any) {
    let body = new URLSearchParams();
    body.append('action', 'getEachTicketandHistory');
    body.append('ticket_number', tck_num);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.fj = res[0];
          this.itemName = this.fj.operation_reported_to.map((item: { name: any; }) => item.name);
          this.historyData = res[0].history_data;
          // console.log("ticketData",  this.fj );
          // console.log("historyData", this.historyData);
          // this.fj.severity_id =this.fj.severity;
        }
      }, error => {
        console.log(error.json());
      });
  }
  updateTicketData(ticData: any) {
    let isModelUpdateValid = this.isModelUpdateValid(ticData);
    if (!isModelUpdateValid) {
      return;
    }
    let body = new URLSearchParams();
    delete ticData.history_data;
    delete ticData.operation_sub_type;
    body.append('action', 'editJobFaultData');
    body.append('data', JSON.stringify(ticData));
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe(data => {
        data = data;
        this.closeAndRedirect();
      }, error => {
        console.log(error.json());
      });
  }


  getDepartmentList() {
    let body = new URLSearchParams();
    body.append('action', 'getDepartments');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.DepartmentList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }
  getSiteList() {
    let body = new URLSearchParams();
    body.append('action', 'getSiteName');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.siteList = res;
          // console.log(this.siteList);
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
          //  console.log( "==========",this.currentStatus);
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
  // getOpreportedToListForEdit(data: any) {

  //   let body = new URLSearchParams();
  //   body.append('action', 'getOperationReportedToData');
  //   this.http.post(environment.apikey + '/generateJsonUrl.php', body)
  //     .map(res => res.json())
  //     .subscribe((res: any) => {
  //       if (!!res) {
  //         // let data1: any = [];
  //         // data1 = res;
  //         // let arr3: any[] = [];
  //         // var c = arr3.concat(data1);
  //         // var d = c.filter(function (item, pos) { return c.indexOf(item) == pos });
  //         // d.forEach((itm: any, i: string | number) => {
  //         //   arr3.push(Object.assign({}, itm, data[i]));
  //         // });
  //         // this.OpReportedToList = arr3;
  //                  let data1: any = [];
  //         data1 = res;
  //         console.log(data1);
  //         //this.OpReportedToList = res;
  //         // console.log("to=>",this.OpReportedToList);
  //         let arr3: any[] = [];

  //         var c = arr3.concat(data1);
  //         var d = c.filter(function (item, pos) { return c.indexOf(item) == pos });
  //         console.log(d);

  //         d.forEach((itm: any, i: string | number) => {
  //           console.log(data[i]);
  //           console.log(itm);
  //           arr3.push(Object.assign({}, itm, data[i]));
  //         });
  //         this.OpReportedToList = arr3;
  //         console.log(this.OpReportedToList);
  //       }
  //     }, error => {
  //       console.log(error.json());
  //     });
  // }

  getOpreportedToListForEdit(data: any) {

    let body = new URLSearchParams();
    body.append('action', 'getOperationReportedToData');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          let data1: any[] = [];
          data1 = res;
          let arr3: any[] = [];
          data1 = data1.map(obj => data.find((o: { id: any; }) => o.id === obj.id) || obj);
          this.OpReportedToList = data1;
          console.log(this.OpReportedToList);
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

  getUserName() {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    this.fj.recorded_by_id = userRoleName;
    // this.fj.recorded_by_id = this.RecordedBy;
  }



  addFaultJob(faultJob: any) {
    let isModelValid = this.isModelValid(faultJob);
    if (!isModelValid) {
      return;
    }
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('action', 'addJobFaultData');
    faultJob.recorded_by_id = userCookie.userId;
    body.append('data', JSON.stringify(faultJob));
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }
  closeAndRedirect() {
    this.router.navigate(['/faultIssueManagement']);
  }

  isModelValid(faultJob: any) {
    // console.log(faultJob);
    let isValid = true;
    this.errorSiteName = '';
    this.errorOperationStatus = '';
    this.errorOperationCreatedDate = '';
    this.errorDepartment = '';
    this.errorOperationType = '';
    this.errorBreafDescription = '';

    if (Object.keys(faultJob).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.site_name_id == 'undefined') {
      this.errorSiteName = 'Site Name is Required';
      isValid = false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.ticket_status == 'undefined') {
      this.errorOperationStatus = 'Operation Status is Required';
      isValid = false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.created_date == 'undefined') {
      this.errorOperationCreatedDate = 'Operation Created Date is Required';
      isValid = false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.department_id == 'undefined') {
      this.errorDepartment = 'Department is Required';
      isValid = false;
    }
    if (Object.keys(faultJob).length && typeof faultJob.operation_type == 'undefined') {
      this.errorOperationType = 'Operation Type is Required';
      isValid = false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.current_status_id == 'undefined') {
      this.errorCurrentStatus = 'Operation Status is Required';
      isValid = false;
    }
    if (Object.keys(faultJob).length && typeof faultJob.description == 'undefined') {
      this.errorBreafDescription = 'Description is Required';
      isValid = false;
    }
    return isValid;
  }
  isModelUpdateValid(faultJob: any) {
    // console.log(faultJob);
    let isValid = true;
    this.errorSiteName = '';
    this.errorOperationStatus = '';
    this.errorOperationCreatedDate = '';
    this.errorDepartment = '';
    this.errorOperationType = '';
    this.errorBreafDescription = '';

    if (Object.keys(faultJob).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.site_name_id == 'undefined') {
      this.errorSiteName = 'Site Name is Required';
      isValid = false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.ticket_status == 'undefined') {
      this.errorOperationStatus = 'Operation Status is Required';
      isValid = false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.created_date == 'undefined') {
      this.errorOperationCreatedDate = 'Operation Created Date is Required';
      isValid = false;
    }

    if (Object.keys(faultJob).length && typeof faultJob.department_id == 'undefined') {
      this.errorDepartment = 'Department is Required';
      isValid = false;
    }
    if (Object.keys(faultJob).length && typeof faultJob.operation_type == 'undefined') {
      this.errorOperationType = 'Operation Type is Required';
      isValid = false;
    }
    if (Object.keys(faultJob).length && typeof faultJob.description == 'undefined') {
      this.errorBreafDescription = 'Description is Required';
      isValid = false;
    }
    return isValid;
  }

}

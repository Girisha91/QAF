import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "../app/shared/translate/translate.service";
import { Http, URLSearchParams } from "@angular/http";
import { CookieService } from "angular2-cookie/core";
import { environment } from "../environments/environment";
import { LocalStorageService } from "angular-2-local-storage";
import { SharedService } from '../app/shared.service';
import { resolve } from 'core-js/fn/promise';
import { async } from '@angular/core/testing';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
declare var $: any;

@Component({
  selector: "work-order-form-exchange-info",
  templateUrl: "./work-order-form.exchange.component.html",
  styleUrls: ["./work-order-form.exchange.component.css".toString()],
})
export class WorkOrderExchangeInfoComponent implements OnInit {
  public UserModuleOperation: any;
  environment: any = environment;
  item: any;
  wo: any;
  ex: any;
  dp: any;
  gn: any;
  opr: any;
  code: any;
  purchaseOrderList: any[];
  ItemLocationList: any[];
  UserType: any[];
  exchangestatus: any[];
  UnitList: any[];
  SetType: any[];
  CampInfo: any[];
  PriorityList: any[];
  actArray: any = [];
  nodeArray: any = [];
  WorkType: any[];
  userPermissionInfo: any;
  userPermissionDataInfo: any;
  userRoleName: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  isUniqueValue: Boolean = false;
  errorManual_workorder_no: any;
  errorTelephone_no: any;
  errorSet_type: any;
  errorType_of_work: any;
  errorNode_no: any;
  errorAct_no: any;
  errorCct_no: any;
  errorCamp_name: any;
  errorUnit: any;
  errorPosition: any;
  errorUser_type: any;
  currentDate: any;
  errorUser_name: any;
  errorExchange: any;
  errorLinked: any;
  errorOoredoo_pair: any;
  errorStatus: any;
  errorExchange_Status: any;
  currentLanguage: string;
  isLangArabic: Boolean = false;

  // adding variables from dpinfo page
  SetTypeDP: any[];
  NodeNo: any[];
  ActNo: any[];
  Recordby: any[];
  DPStatusvalue: any[];
  errorDp_capacity: any;
  errorDp_status: any;
  errorDp_mdf: any;
  errorDp_no: any;
  errorDp_name: any;
  errorOoredoo_dp: any;
  errorPair_no: any;
  errorDp_location: any;
  errorMdf_vertical_from: any;
  errorMdf_pair_no_from: any;
  errorCable_no_from: any;
  errorMdf_vertical_to: any;
  errorMdf_pair_no_to: any;
  errorCable_no_to: any;
  errorRemarks: any;
  errorInstalled_by: any;
  errorInstalled_date: any;
  errorRecorded_by: any;
  errorAdditional_info: any;

  // adding variables from general info page
  errorRequest_from: any;
  errorRequest_to: any;
  errorRequested_by: any;
  errorcable_distance: any;
  errorApproved_by: any;
  errorStore_demand_no: any;
  errorRecord_file_no: any;
  errorCable_no: any;
  isTelephoneReadOnly: boolean = false;
  wholeworkorderdata: any;
  public userPermission: any;
  public UserModulePermission: any;
  addRecord: boolean;
  alertMessages: boolean = false;
  unitInfo: any = [];
  showAlert: boolean = false;
  action: any;
  checkPhoneNo: boolean = true;
  redirect: boolean;
  constructor(
    private cookieService: CookieService,
    private http: Http,
    private _localStorageService: LocalStorageService,
    route: ActivatedRoute,
    private router: Router,
    private _translate: TranslateService,
    private sharedService: SharedService
  ) {
    this.UserModuleOperation = [];
    this.userPermission = [];
    this.UserModulePermission = [];
    this.wholeworkorderdata = this._translate.getworkorderData();
    this.exchangestatus = [
      {
        id: "1",
        exchange_status: "Active",
      },
      {
        id: "2",
        exchange_status: "InActive",
      },
      {
        id: "3",
        exchange_status: "Faulty",
      },
      {
        id: "4",
        exchange_status: "Spare",
      },
      {
        id: "5",
        exchange_status: "PW",
      },
      {
        id: "6",
        exchange_status: "N/A",
      },
    ];
    var param = route.snapshot.params["id"];
    var action = route.snapshot.params["action"];
    this.action = action
    this.wo = {};
    this.ex = {};
    this.dp = {};
    this.gn = {};
    this.item = {};
    if (action == "edit" && param) {
      this.title = "Update Item";
      this.isReadOnly = false;
      this.isUniqueValue = true;
      this.Id = param;
      this.opr = 1;
      this.checkPhoneNo = false;
      this.getNodeArray();
      this.getExchange("edit");
      this.getDP("edit");
      this.getgeneral("edit");
    } else if (action == "view" && param) {
      this.title = "View Item";
      this.isReadOnly = true;
      this.isUniqueValue = true;
      this.Id = param;
      this.opr = 2;
      this.isTelephoneReadOnly = true;
      this.getNodeArray();
      this.getExchange("view");
    } else {
      this.title = "Add WO Exchange";
      this.opr = 0;
      this.isReadOnly = false;
      this.getNodeArray();
    }
    this.purchaseOrderList = [];
    this.ItemLocationList = [];
    this.WorkType = [
      {
        id: "1",
        value: "New Installation",
      },
      {
        id: "2",
        value: "Replacement",
      },
      {
        id: "4",
        value: "Transfer",
      },
      {
        id: "5",
        value: "Repair",
      },
      {
        id: "3",
        value: "N/A",
      },
    ];

    this.UserType = [
      {
        id: "1",
        label: "VIP",
        value: "VIP",
      },
      {
        id: "2",
        label: "Officer",
        value: "Officer",
      },
      {
        id: "3",
        label: "Non-Officer",
        value: "Non-Officer",
      },
      {
        id: "4",
        label: "N/A",
        value: "N/A",
      }
    ];
    this.SetTypeDP = [
      {
        label: "ANALOG",
        value: "ANALOG",
      },
      {
        label: "FAX",
        value: "FAX",
      },
      {
        label: "DIGITAL 4039",
        value: "DIGITAL 4039",
      },
      {
        label: "DIGITAL 8039",
        value: "DIGITAL 8039",
      },
      {
        label: "IP Touch 4039",
        value: "IP Touch 4039",
      },
      {
        label: "IP Touch 4068",
        value: "IP Touch 4068",
      },
      {
        label: "IP Touch 8082",
        value: "IP Touch 8082",
      },
      {
        label: "HOT-LINE",
        value: "HOT-LINE",
      },
    ];

    this.NodeNo = [
      {
        label: "Node 01",
        value: "Node 01",
      },
      {
        label: "Node 02",
        value: "Node 02",
      },
      {
        label: "Node 03",
        value: "Node 03",
      },
    ];
    this.ActNo = [
      {
        label: "ACT 0",
        value: "ACT 0",
      },
      {
        label: "ACT 1",
        value: "ACT 1",
      },
      {
        label: "ACT 2",
        value: "ACT 2",
      },
      {
        label: "ACT 3",
        value: "ACT 3",
      },
    ];
    this.DPStatusvalue = [
      {
        label: "Active",
        value: "Active"
      },
      {
        label: "InActive",
        value: "InActive"
      },
      {
        label: "Spare",
        value: "Spare"
      },
      {
        label: "Faulty",
        value: "Faulty"
      },
      {
        label: "PW",
        value: "PW"
      },
      {
        label: "Others",
        value: "Others"
      },
      {
        label: "N/A",
        value: "N/A"
      }
    ]
    this.Recordby = [
      {
        label: "Mohammad Beraikan",
        value: "Mohammad Beraikan",
      },
      {
        label: "Mohammead Awais",
        value: "Mohammead Awais",
      },
      {
        label: "Subin Thomas",
        value: "Subin Thomas",
      }
    ];
  }

  Permissions() {
    // giri commented
    // getting the data of userpermission from localstorage
    this.userPermission = JSON.parse(
      this._localStorageService.get("userPermission")
    );
    let UserModulePermissionArr: any = [];
    let UserModuleOperationArr: any = [];

    for (let key in this.userPermission) {
      if (key == "OtherInfo") {
        let value = this.userPermission[key];
        for (let key2 in value) {
          let value2 = value[key2];
          for (let a = 0; a < value2.length; a++) {
            if (value2[a].selected) {
              UserModulePermissionArr.push(value2[a].id);
            }
            for (let key4 in value2[a]) {
              let value4 = value2[a][key4];
              if (key4 == "operation_pages") {
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
            this.UserModuleOperation.push({
              page_id: value2[a].id,
              operations: UserModuleOperationArr,
            });
            UserModuleOperationArr = [];
          }

        }
      }
    }
    this.UserModulePermission = UserModulePermissionArr;
  }
  ngOnInit() {
    // giri commented
    // getting the values from cookie and storing it in user cookie variable
    if (
      this.cookieService.get("user") != null &&
      this.cookieService.get("user") != "undefined"
    ) {
      var userCookie = JSON.parse(this.cookieService.get("user"));
      if (
        userCookie.sessionId != null ||
        (userCookie.sessionId != "" && userCookie.status === 1)
      ) {
      }
    } else {
      this.router.navigate(["/login"]);
    }

    // giri commented below lines
    // getting the Permission from cookie service
    this.getUserName();
    // getting the value of Act array from API
    this.getActArray();
    // getting the value of Set type from API
    this.getSetTypeList();
    // getting the value of Camp info from API
    this.getWOCampInfoList();
    this.setunitInfo();
    this.Permissions();
  }

  // giri commented
  // getting the value of permission from local storage
  getUserName() {
    this.userPermissionInfo = JSON.parse(
      this._localStorageService.get("userPermission")
    );
    let username;
    if (this.cookieService.get('user') != null && typeof this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      username = userCookie.username;
      this.ex.created_by = userCookie.username;
      this.dp.created_by = userCookie.username;
    }

    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
  }

  // giri commented
  // to check wheather all the required feilds have valid data
  // if there is an invalid data or any required field is left empty then it will throw error to user
  // in html file
  isModelValid(ex: any, dp: any, gn: any) {
    let isValid = true;
    this.errorManual_workorder_no = "";
    this.errorTelephone_no = "";
    this.errorSet_type = "";
    this.errorType_of_work = "";
    this.errorNode_no = "";
    this.errorAct_no = "";
    this.errorCct_no = "";
    this.errorCamp_name = "";
    this.errorUnit = "";
    this.errorPosition = "";
    this.errorUser_type = "";
    this.errorUser_name = "";
    this.errorExchange = "";
    this.errorLinked = "";
    this.errorOoredoo_pair = "";
    this.errorStatus = "";
    this.errorExchange_Status = "";
    this.errorDp_capacity = "";
    this.errorDp_status = "";
    this.errorDp_no = "";
    this.errorDp_mdf = "";
    this.errorDp_name = "";
    this.errorOoredoo_dp = "";
    this.errorPair_no = "";
    this.errorDp_location = "";
    this.errorMdf_vertical_from = "";
    this.errorMdf_pair_no_from = "";
    this.errorCable_no_from = "";
    this.errorMdf_vertical_to = "";
    this.errorMdf_pair_no_to = "";
    this.errorCable_no_to = "";
    this.errorRemarks = "";
    this.errorInstalled_by = "";
    this.errorInstalled_date = "";
    this.errorRecorded_by = "";
    this.errorAdditional_info = "";

    // this is for general info
    this.errorRequest_from = "";
    this.errorRequest_to = "";
    this.errorRequested_by = "";
    this.errorcable_distance = "";
    this.errorApproved_by = "";
    this.errorStore_demand_no = "";
    this.errorRecord_file_no = "";
    this.errorCable_no = "";

    // this is for exchange info
    if (Object.keys(ex).length == 0) {
      alert("Please Fill all the required fields");
      return false;
    }
    if (Object.keys(ex).length && typeof ex.telephone_no == "undefined") {
      this.errorTelephone_no = "Telephone no is Required";
      var err = document.getElementById("teleno");
      err.focus();
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      isValid = false;
    }

    return isValid;
  }

  // giri commented
  // getting the value of Set type from API
  getSetTypeList() {
    let body = new URLSearchParams();
    body.append("action", "get_work_order_type");
    this.http
      .post(environment.apikey + "/generateJsonUrl.php", body)
      .map((res) => res.json())
      .subscribe(
        (res: any) => {
          if (!!res) {
            this.SetType = res;
          }
        },
        (error) => {
          console.log(error.json());
        }
      );
  }
  setunitInfo() {
    this.unitInfo = [
      { id: 1, unit: "Tariq Bin Ziyad Camp (J)" },
      { id: 2, unit: "Signals (J1)" },
      { id: 3, unit: "Sayliya H/Q (J2)" },
      { id: 4, unit: "Maintenance Unit (J3)" },
      { id: 5, unit: "Sub Stores (J4)" },
      { id: 6, unit: "Central Stores(J5)" },
      { id: 7, unit: "Intelligence (J6)" },
      { id: 8, unit: "New Special Force (J7)" },
      { id: 9, unit: "New Military Police (J8)" },
      { id: 10, unit: "Royal Guard (H1)" },
      { id: 11, unit: "Military College (H2)" },
      { id: 12, unit: "Ammunitions (H3)" },
      { id: 13, unit: "Border Guard (H4)" },
      { id: 14, unit: "Duhailiyat (H/H5)" },
      { id: 15, unit: "H7" },
      { id: 16, unit: "Medical Services (MEDMAC)" },
      { id: 17, unit: "Medical Services (AL-SAAD)" },
      { id: 18, unit: "Medical Services (BIN-EIMRAN)" },
      { id: 19, unit: "Border Gurard (B1)" },
      { id: 20, unit: "North Camp (E1)" },
      { id: 21, unit: "Artillery (G)" },
      { id: 22, unit: "GHQ/Ministry (L)" },
      { id: 23, unit: "Airforce(M)" },
      //{ id: 24, unit: "Mike (M2)"},
      { id: 25, unit: "Navy (N)" },
      { id: 26, unit: "Signals (W3)" },
      { id: 27, unit: "Al-Udeid" },
      { id: 28, unit: "Al-Mazrooa" },
      { id: 29, unit: "Um-Hawta" },
      { id: 30, unit: "Al-Zaeem College" },
      { id: 31, unit: "Moral-Guidence (T)" },
      { id: 32, unit: "New Camp 1" },
      { id: 33, unit: "New Camp 2" },
      { id: 34, unit: "KHALID BIN WALID" },
      { id: 35, unit: "Strategy Acadamy" },
      { id: 36, unit: "RAS-LAFFAN" },
      { id: 37, unit: "JOAN COLLAGE" },
      { id: 38, unit: "DJRCC" },
      { id: 39, unit: "HR" },
      { id: 40, unit: "NCC/NSS" },
      { id: 41, unit: "Air Defence" },
      { id: 42, unit: "N/A" },
    ]
  }
  // giri commented
  // getting the value of Camp info from API
  getWOCampInfoList() {
    let body = new URLSearchParams();
    body.append("action", "get_work_order_camp_info");
    this.http
      .post(environment.apikey + "/generateJsonUrl.php", body)
      .map((res) => res.json())
      .subscribe(
        (res: any) => {
          if (!!res) {
            this.CampInfo = res;
          }
        },
        (error) => {
          console.log(error.json());
        }
      );
  }

  // giri commented
  // getting the value of Act array from API
  getActArray() {
    let body = new URLSearchParams();
    body.append("action", "get_work_order_act_no");
    this.http
      .post(environment.apikey + "/generateJsonUrl.php", body)
      .map((res) => res.json())
      .subscribe(
        (res: any) => {
          if (!!res) {
            this.actArray = res;
          }
        },
        (error) => {
          console.log(error.json());
        }
      );
  }

  // giri commented
  // getting the value of selected row through api
  getExchange(wo: any) {
    let body = new URLSearchParams();
    body.append("action", "getSingleRecord");
    body.append("table", "wo_exchange_info");
    body.append("primary_key", "id");
    body.append("primary_key_value", this.Id);
    this.http
      .post(environment.apikey + "/CrudApplication.php", body)
      .map((res) => res.json())
      .subscribe(
        (res: any) => {
          if (!!res) {
            this.ex = res;
          }
        },
        (error) => {
          console.log(error.json());
        }
      );

  }
  getDP(method: any) {
    if (this.wholeworkorderdata.dp_info.length >= 1) {
      let body = new URLSearchParams();
      body.append("action", "getSingleRecord");
      body.append("table", "wo_dp_info");
      body.append("primary_key", "id");
      body.append("primary_key_value", this.wholeworkorderdata.fullid.dp);
      this.http
        .post(environment.apikey + "/CrudApplication.php", body)
        .map((res) => res.json())
        .subscribe(
          (res: any) => {
            if (!!res) {
              if (res.status == 'Active') {
                if (res.installed_date == "" || res.installed_date == null || res.installed_date == '0000-00-00') {
                  res.installed_date = ""
                }
                if (res.recorded_date == "" || res.recorded_date == null || res.recorded_date == '0000-00-00') {
                  res.recorded_date = ""
                }
                this.dp = res;
                if (this.Id != "") {
                  if (method === "add" || method === "edit") {
                    this.isTelephoneReadOnly = true;
                    if (res.installed_date && res.installed_date != '0000-00-00') {
                      res.installed_date = new Date(res.installed_date);
                    } else { res.installed_date = "" }
                    res.created_date = new Date(res.created_date);
                    this.dp = res;
                  }
                }
              } else {
                this.dp = {}
              }
            }
          },
          (error) => {
            console.log(error.json());
          }
        );
    }
  }
  getgeneral(method: any) {
    if (this.wholeworkorderdata.general_info.length >= 1) {
      let body = new URLSearchParams();
      body.append("action", "getSingleRecord");
      body.append("table", "wo_general_info");
      body.append("primary_key", "id");
      body.append(
        "primary_key_value",
        this.wholeworkorderdata.fullid.gn
      );
      this.http
        .post(environment.apikey + "/CrudApplication.php", body)
        .map((res) => res.json())
        .subscribe(
          (res: any) => {
            if (!!res) {
              if (res.status == 'Active') {
                this.gn = res;
                if (this.Id != "") {
                  if (method === "add" || method === "edit") {
                    this.isTelephoneReadOnly = true;
                    this.gn = res;
                  }
                }
              } else {
                this.gn = {}
              }
            }
          },
          (error) => {
            console.log("error while fetchig general info is", error.json());
          }
        );
    }
  }

  getActinfo(event: any) { }

  // giri commented
  // setting the value of nodearray
  getNodeArray() {
    for (let _i = 0; _i <= 50; _i++) {
      if (_i != 12 && _i != 13) {
        this.nodeArray.push({ id: _i, node_no: "Node " + _i });
      }
    }
  }



  async checkDpTelephoneno(t: any, tablename: any) {
    if (this.action == undefined) {
      let body1 = new URLSearchParams();
      body1.append("action", "getTeleNoRecord");
      body1.append("table", tablename);
      body1.append("primary_key", "telephone_no");
      body1.append("primary_key_value", t);

      await this.http
        .post(environment.apikey + "/CrudApplication.php", body1)
        .map((res) => res.json())
        .subscribe(
          (res: any) => {
            if (res.length == 0) {
              this.checkPhoneNo = false;
              resolve(this.checkPhoneNo);
            } else {
              res.some((ele: any) => {
                if (ele.status == 'Active') {
                  alert("Telephone No already exist")
                  this.checkPhoneNo = true;
                  return true;
                } else {
                  this.checkPhoneNo = false;
                }
              })
            }
          },
          (error) => {
            console.log(error.json());
          }
        );
    } else {
      this.checkPhoneNo = false;
    }
  }

  checktelephoneno(e: any) {
    if(e=="" || e== null||e=="undefined"){
      alert("Please enter telephone no");
      this.checkPhoneNo = true;
      return false;
    }
    this.checkPhoneNo = true;
    if (this.action == undefined) {
      let formvalues = {
        items: [
          {
            "fieldName": "telephone_no",
            "fieldValue": e
          }
        ]
      }
      let body = new URLSearchParams();
      $(".app-loader").show();
      body.append("items", JSON.stringify(formvalues));
      body.append("action", "entities1");
      this.http
        .post(environment.apikey + "/generateJsonUrl.php", body)
        .map((res) => res.json())
        .subscribe(
          (res: any) => {
            if (res.code == 100) {
              alert("Telephone Number already Exist");
              this.checkPhoneNo = true;
            } else if (res.code == 101) {
              this.addRecord = true;
              this.checkPhoneNo = false;
            }
          },
          (error: any) => {
            let err = error.json();
          }
        );
      $(".app-loader").hide();
    } else if(this.action == "edit"){
this.checkPhoneNo = true;
let formvalues = {
  items: [
    {
      "fieldName": "telephone_no",
      "fieldValue": e
    }
  ]
}
let body = new URLSearchParams();
$(".app-loader").show();
body.append("items", JSON.stringify(formvalues));
body.append("action", "entities1");
this.http
        .post(environment.apikey + "/generateJsonUrl.php", body)
        .map((res) => res.json())
        .subscribe(
          (res: any) => {
            if(res.code == 100){
            let value = res.data.every((ele:any)=>{return this.wholeworkorderdata.fullid.ex == ele.id});
            if(value){
              this.addRecord = true;
              this.checkPhoneNo = false;
            }else {
              alert("Telephone Number already Exist");
              this.checkPhoneNo = true;
            }
            } else if (res.code == 101) {
              this.addRecord = true;
              this.checkPhoneNo = false;
            }
          },
          (error: any) => {
            let err = error.json();
          }
        );
      $(".app-loader").hide();
    }
    return true;
  }

  isModelSingleValid(wo: any) {
    let isValid = true;
    if (Object.keys(wo).length == 0) {
      alert("Please Fill all the required fields");
      return false;
    }

    if (Object.keys(wo).length && typeof wo.telephone_no == "undefined") {
      this.errorTelephone_no = "Telephone no is Required";
      var err = document.getElementById("teleno");
      err.focus();
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      isValid = false;
    }
    return isValid;
  }

  calculatecurrdate() {

    let currDate: any = new Date();
    let today: any = new Date();
    let dd = today.getDate().toString();
    let mm = (today.getMonth() + 1).toString();
    let yyyy = today.getFullYear();
    if (+dd < 10) {
      dd = ('0' + dd).toString();
    }
    if (+mm < 10) {
      mm = ('0' + mm).toString();
    }
    currDate = yyyy + "-" + mm + "-" + dd;
    return currDate
  }



  async addSingleRecord(record: any, tableName: any) {
    this.checkDpTelephoneno(record.telephone_no, tableName)
    record.status = 'Active';
    this.currentDate = this.calculatecurrdate();
    if (tableName != 'wo_general_info') {
      record.created_date = this.currentDate;
    }
    let body = new URLSearchParams();
    body.append('action', 'addexchange');
    body.append('table', tableName);
    body.append('data', JSON.stringify(record));
    this.http.post(environment.apikey + '/CrudApplication.php', body)
      .subscribe(data => {
        data = data;
        this.redirect = true;
        if (!this.checkOperation('11', '11') || tableName == 'wo_general_info') {
          this.closeAndRedirect();
        }
      }, error => {
        console.log(error.json());
      });
    this.redirect = false;
  }

  convertDatetoStr(d: any) {
    let id = new Date(d);
    let dd = id.getDate().toString();
    let mm = (id.getMonth() + 1).toString();
    let yyyy = id.getFullYear();
    if (+dd < 10) {
      dd = ('0' + dd).toString();
    }
    if (+mm < 10) {
      mm = ('0' + mm).toString();
    }
    let currDate = yyyy + "-" + mm + "-" + dd;
    return currDate

  }
  // giri commented
  // adding the values to Exchange info table
  async AddExchange(ex: any, dp: any, gn: any) {
    if(ex.telephone_no){
      dp.telephone_no = ex.telephone_no;
      gn.telephone_no = ex.telephone_no;
    } else if(dp.telephone_no){
      ex.telephone_no = dp.telephone_no;
      gn.telephone_no = dp.telephone_no;
    } else if(gn.telephone_no){
      ex.telephone_no = gn.telephone_no;
      dp.telephone_no = gn.telephone_no;
    }
    var isModelValid = this.isModelValid(ex, dp, gn);
    if (!isModelValid) {
      return;
    }

    let addinter = await this.checktelephoneno(ex.telephone_no)
    let inter = setInterval(() => {
      if (addinter == true) {
        if (this.addRecord == false) {
          clearInterval(inter);
          return;
        }
        ex.status = "Active";
        dp.status = "Active";
        gn.status = "Active";
        
        this.currentDate = this.calculatecurrdate();
        ex.created_date = this.currentDate;
        dp.created_date = this.currentDate;
        ex.id = "";
        dp.id = "";
        gn.id = "";
        if (dp.installed_date) {
          dp.installed_date = this.convertDatetoStr(dp.installed_date);
        }
        let body = new URLSearchParams();
        body.append("action", "add");
        body.append("data1", JSON.stringify(ex));
        body.append("data2", JSON.stringify(dp));
        body.append("data3", JSON.stringify(gn));
        this.http.post(environment.apikey + "/CrudApplication.php", body).subscribe(
          (data) => {
            this.code = data;
            this.closeAndRedirect();
          },
          (error) => {
            console.log(error.json());
          }
        );
        clearInterval(inter)
      }
    }, 1000)
  }

  conditionalRedirect() {
    if (this.redirect == true) {
      this.closeAndRedirect();
    }
  }


  // giri commented
  // updating the values in Exchange info
  async UpdateWOExchange(ex: any, dp: any, gn: any) {
    console.log("value of updated info",ex,dp,gn);
    if(ex.telephone_no){
      dp.telephone_no = ex.telephone_no;
      gn.telephone_no = ex.telephone_no;
    } else if(dp.telephone_no){
      ex.telephone_no = dp.telephone_no;
      gn.telephone_no = dp.telephone_no;
    } else if(gn.telephone_no){
      ex.telephone_no = gn.telephone_no;
      dp.telephone_no = gn.telephone_no;
    }
    var isModelValid = this.isModelValid(ex, dp, gn);
    console.log("value of ismodelvalid",isModelValid)
    if (!isModelValid) {
      return;
    }
    let addinter = await this.checktelephoneno(ex.telephone_no);
    let inter = setInterval(() => {
      if (addinter == true) {
        if (this.addRecord == false) {
          clearInterval(inter);
          return;
        }
    ex.status = "Active";
    dp.status = "Active";
    gn.status = "Active";
    // this.currentDate = this.calculatecurrdate();
    // let today = new Date();
    // let dd = today.getDate().toString();
    // let mm = (today.getMonth() + 1).toString();
    // let yyyy = today.getFullYear();
    // let hr = today.getHours().toString();
    // let min = today.getMinutes().toString();
    // let sec = today.getSeconds().toString();
    // if (+dd < 10) {
    //   dd = ("0" + dd).toString();
    // }
    // if (+mm < 10) {
    //   mm = ("0" + mm).toString();
    // }
    // if (+hr < 10) {
    //   hr = ("0" + hr).toString();
    // }
    // if (+min < 10) {
    //   min = ("0" + min).toString();
    // }
    // if (+sec < 10) {
    //   sec = ("0" + sec).toString();
    // }
    // this.currentDate =
    //   yyyy + "-" + mm + "-" + dd;
    // ex.created_date = this.currentDate;
    // dp.created_date = this.currentDate;
    delete ex["dp_info"];
    delete ex["general_info"];
    delete ex["history"];
    if (dp.installed_date) {
      dp.installed_date = this.convertDatetoStr(dp.installed_date);
    }
    let body = new URLSearchParams();
    console.log("value of fullid is",this.wholeworkorderdata)
    body.append("action", "update");
    body.append("data1", JSON.stringify(ex));
    body.append("data2", JSON.stringify(dp));
    body.append("data3", JSON.stringify(gn));
    body.append("primary_key", "id");
    body.append("primary_key_value", ex.id);
    body.append("primary_key_value1", this.wholeworkorderdata.fullid.dp);
    body.append("primary_key_value2", this.wholeworkorderdata.fullid.gn);
    this.http.post(environment.apikey + "/CrudApplication.php", body).subscribe(
      (data) => {
        data = data;
        this.closeAndRedirect();
      },
      (error) => {
        console.log(error.json());
      }
    );
    clearInterval(inter)
  }
}, 1000)
  }

  // giri commented
  // navigating back to work order landing page
  closeAndRedirect() {
    this.router.navigate(["/workOrder"]);
  }

  Emptyobject(Objectname: any) {
    if (Objectname === "dp") {
      this.dp.telephone_no = null;
      this.dp.dp_capacity = null;
      this.dp.dp_no = null;
      this.dp.pair_no = null;
      this.dp.dp_location = null;
      this.dp.mdf_vertical_to = null;
      this.dp.mdf_pair_no_to = null;
      this.dp.cable_no_to = null;
      this.dp.mdf_vertical_from = null;
      this.dp.mdf_pair_no_from = null;
      this.dp.cable_no_from = null;
      this.dp.created_date = null;
      this.dp.installed_by = null;
      this.dp.installed_date = null;
      this.dp.recorded_by = null;
      this.dp.recorded_date = null;
      this.dp.remarks = null;
      this.dp.dp_name = null;
      this.dp.Ooredoo_dp = null;
      this.dp.Ooredoo_pair = null;
      this.dp.Additional_info = null;
    } else if (Objectname === "gn") {
      this.gn.telephone_no = null;
      this.gn.request_from = null;
      this.gn.request_to = null;
      this.gn.requested_by = null;
      this.gn.approved_by = null;
      this.gn.store_demand_no = null;
      this.gn.record_file_no = null;
      this.gn.cable_no = null;
      this.gn.cable_distance = null;
    }
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
}

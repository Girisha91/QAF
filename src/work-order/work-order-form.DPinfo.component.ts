import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "../app/shared/translate/translate.service";
import { Http, URLSearchParams } from "@angular/http";
import { CookieService } from "angular2-cookie/core";
import { environment } from "../environments/environment";
import { LocalStorageService } from "angular-2-local-storage";
@Component({
  selector: "work-order-form-dp-info",
  templateUrl: "./work-order-form.DPinfo.component.html",
  styleUrls: ["./work-order-form.DPinfo.component.css".toString()],
})
export class WorkOrderDpInfoComponent implements OnInit {
  // this is for history info variables
  errorclear_of_fault: any;
  errorreported_date: any;
  errorTelephone_no: any;
  errorCause: any;
  errorFaultMan: any;

  environment: any = environment;
  item: any;
  wo: any;
  opr: any;
  userPermissionInfo: any;
  currentDate: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  isTelephoneReadOnly: Boolean = false;

  isUniqueValue: Boolean = false;
  currentLanguage: string;
  isLangArabic: Boolean = false;

  constructor(
    private cookieService: CookieService,
    private http: Http,
    private _localStorageService: LocalStorageService,
    route: ActivatedRoute,
    private router: Router,
    private _translate: TranslateService
  ) {
    var param = route.snapshot.params["id"];
    var action = route.snapshot.params["action"];
    this.item = {};
    this.wo = {};
    // getting the values from cookie and storing it in user cookie variable
    if (action == "edit" && param) {
      this.title = "Update wo";
      this.isReadOnly = false;
      this.isUniqueValue = true;
      this.Id = param;
      this.opr = 1;
      this.getDpInfo("edit");
    } else if (action == "view" && param) {
      this.title = "View wo";
      this.isReadOnly = true;
      this.isTelephoneReadOnly = true;
      this.isUniqueValue = true;
      this.Id = param;
      this.opr = 2;
      this.getDpInfo("view");
    } else {
      this.title = "Add wo";
      this.opr = 0;
      this.isReadOnly = false;
    }
  }

  ngOnInit() {
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
    // getting the Permission from cookie service
    this.getUserName();
  }

  // to check wheather all the required feilds have valid data
  // if there is an invalid data or any required field is left empty then it will throw error to user
  // in html file
  isModelValid(wo: any) {
    let isValid = true;

    this.errorTelephone_no = "";

    if (Object.keys(wo).length == 0) {
      alert("Please Fill all the required fields");
      return false;
    }

    if (Object.keys(wo).length && typeof wo.telephone_no == "undefined") {
      this.errorTelephone_no = "Telephone no is Required";
      isValid = false;
    }
    return isValid;
  }
  // getting the Permission from cookie service
  getUserName() {
    this.userPermissionInfo = JSON.parse(
      this._localStorageService.get("userPermission")
    );
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
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

  // getting the value of selected row through api
  getDpInfo(method: any) {
    let body = new URLSearchParams();
    body.append("action", "getSingleRecord");
    body.append("table", "history");
    body.append("primary_key", "id");
    body.append("primary_key_value", this.Id);
    this.http
      .post(environment.apikey + "/CrudApplication.php", body)
      .map((res) => res.json())
      .subscribe(
        (res: any) => {
          if (!!res) {
            if (res.cleared_date == null || res.cleared_date == '' || res.cleared_date == '0000-00-00') {
              res.cleared_date = '';
            }
            if (res.reported_date == null || res.reported_date == '' || res.reported_date == '0000-00-00') {
              res.reported_date = '';
            }
            this.wo = res;
            if (this.Id != "") {
              if (method === "add" || method === "edit") {
                this.isTelephoneReadOnly = true;
                this.wo = res;
              }
            }
          }
        },
        (error) => {
          console.log(error.json());
        }
      );
  }
  // adding the values to Exchange info table
  AddDPInfo(wo: any) {
    var isModelValid = this.isModelValid(wo);
    if (!isModelValid) {
      return;
    }
    wo.status = "active";
    if (wo.cleared_date) {
      wo.cleared_date = this.convertDatetoStr(wo.cleared_date);
    }
    if (wo.reported_date) {
      wo.reported_date = this.convertDatetoStr(wo.reported_date);
    }
    let body = new URLSearchParams();
    body.append("action", "addhistory");
    body.append("table", "history");
    body.append("data", JSON.stringify(wo));
    this.http.post(environment.apikey + "/CrudApplication.php", body).subscribe(
      (data) => {
        data = data;
        this.closeAndRedirect();
      },
      (error) => {
        console.log(error.json());
      }
    );
  }
  // updating the values in DP info
  UpdateWODPInfo(wo: any) {
    var isModelValid = this.isModelValid(wo);
    if (!isModelValid) {
      return;
    }
    wo.status = "active";
    if (wo.cleared_date) {
      wo.cleared_date = this.convertDatetoStr(wo.cleared_date);
    }
    if (wo.reported_date) {
      wo.reported_date = this.convertDatetoStr(wo.reported_date);
    }
    let body = new URLSearchParams();
    body.append("action", "updatehistory");
    body.append("table", "history");
    body.append("data", JSON.stringify(wo));
    body.append("primary_key", "id");
    body.append("primary_key_value", wo.id);

    this.http.post(environment.apikey + "/CrudApplication.php", body).subscribe(
      (data) => {
        data = data;
        this.closeAndRedirect();
      },
      (error) => {
        console.log(error.json());
      }
    );
  }
  // navigating back to work order landing page
  closeAndRedirect() {
    this.router.navigate(["/workOrder"]);
  }

  Print() {
    window.print();
  }
}

import { Pipe } from "@angular/core";
import { Component, ViewChild, ViewChildren } from "@angular/core";
import { CookieService } from "angular2-cookie/core";
import { LocalStorageService } from "angular-2-local-storage";
import { Subscription } from "rxjs/Subscription";
import "rxjs/add/operator/map";
import { TranslateService } from "../app/shared/translate/translate.service";
import { Subject } from "rxjs/Subject";
import { Constants } from "../app/csv.constants";
import { Http, URLSearchParams, RequestOptions, Headers } from "@angular/http";
import { Router } from "@angular/router";
import { FileUtil } from "../app/file.util";
import { environment } from "../environments/environment";
import { SharedService } from "../app/shared.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { OrderrByPipe } from "../app/orderBy.pipe";
import { WorkOrderPipe } from "../app/workOrder.pipe";
import { FilterPipe } from "../app/genericSearch.pipe";
import { idLocale } from "ngx-bootstrap";
import { ExcelService } from "../app/shared/excel.service";

Pipe({
  name: "SearchFilter",
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: "workOrder",
  templateUrl: "./work-order.component.html",
  styleUrls: ["./work-order.component.css".toString()],
})
export class WorkOrderComponent {
  @ViewChildren("someVar") filteredItems: any;
  environment: any = environment;
  showHideAllRows: boolean;
  selectedDeactivateEmployee: any;
  isDesc: boolean = false;
  column: string = "supplier";
  subscription: Subscription;
  showAdvanceSearch: boolean;
  queryString: any = "";
  showImage: boolean = false;
  angularLogo = "./src/assets/mobile.gif";
  SetType: any[];
  CampInfo: any[];
  WorkType: any[];
  actArray: any = [];
  nodeArray: any = [];
  ExchangeStatus: any[];
  ExchangeInfoSw_workorder_no: any;
  Exchangelinkedno: any;
  Exchange_Exchange: any;
  ExchangeInfoManual_workorder_no: any;
  ExchangeInfoType_of_Work: any;
  ExchangeInfoTelephone_no: any;
  ExchangeInfoSet_type: any;
  ExchangeInfoNode_no: any;
  ExchangeInfoAct_no: any;
  ExchangeInfoCct_no: any;
  ExchangeInfoCamp_name: any;
  ExchangeInfoUnit: any;
  ExchangeInfoPosition: any;
  ExInfoPosLen:any;
  ExchangeInfoUser_type: any;
  ExchangeInfoUser_name: any;
  ExchangeInfoCreated_by: any;
  ExchangeInfoCreated_date: any;
  ExchangeInfoStatus: any;
  dp_infoTelephone_no: any;
  dp_dpname: any;
  dp_Ooredoodp: any;
  dp_dp_Ooredoopair: any;
  dp_additionalinfo: any;
  dp_infoDp_capacity: any;
  dp_infoDp_no: any;
  dp_infoPair_no: any;
  dp_OoredooMDF: any;
  dp_status: any;
  dp_infoDp_location: any;
  dp_infoMdf_vertical_from: any;
  dp_infoMdf_pair_no_from: any;
  dp_infoCable_no_from: any;
  dp_infoMdf_vertical_to: any;
  dp_infoMdf_pair_no_to: any;
  dp_infoCable_no_to: any;
  dp_infoCreated_by: any;
  dp_infoCreated_date: any;
  dp_infoInstalled_by: any;
  dp_infoInstalled_date: any;
  dp_infoRecorded_by: any;
  dp_infoRecorded_date: any;
  dp_infoRemarks: any;
  general_infoTelephone_no: any;
  general_infoRequest_from: any;
  general_infoRequest_to: any;
  general_infoRequested_by: any;
  general_infoApproved_by: any;
  general_infoStore_demand_no: any;
  general_infoRecord_file_no: any;
  general_infoCable_no: any;
  general_infoCable_distance: any;
  viewhistory: any = [];
  his_telephone: any;
  his_reporteddate: any;
  his_faultman: any;
  his_cause: any;
  his_clearoffault: any;
  his_cleared_date: any;
  searchSWWorkOrder: any;
  searchManualWorkOrder: any;
  searchexTelephoneNo: any;
  Linkedno: any;
  searchSetType: any;
  searchTypeOfWork: any;
  searchNoneNo: any;
  searchActNo: any;
  searchCCTNo: any;
  searchCampName: any;
  searchUnit: any;
  ExchangeNo: any;
  searchPosition: any;
  searchUserType: any;
  UserType: any[];
  searchUserName: any;
  searchCreatedBy: any;
  search_dp_telephone: any;
  searchCreatedDate: any;
  searchStatus: any;
  searchdpname: any;
  searchWorkOrderDpCapacity: any;
  searchSwWorkOrderDpNo: any;
  searchSwWorkOrderPairNo: any;
  searchSwWorkOrderStatus: any;
  OoredooDp: any;
  Ooredoopair: any;
  OoredooMDF: any;
  dpCreatedBy: any;
  dpcreatedDate: any;
  Remarks: any;
  InstalledBy: any;
  InstalledDate: any;
  RecordedBy: any;
  MDFVFrom: any;
  MDFPFrom: any;
  CableInfoFrom: any;
  MDFVTo: any;
  MDFPTo: any;
  CableInfoTo: any;
  DpAddInfo: any;
  GNTelephone: any;
  RequestFrom: any;
  RequestTo: any;
  RequestBy: any;
  ApprovedBy: any;
  StoreDemandNo: any;
  RecordFile: any;
  CableInfo: any;
  CableDistance: any;
  lastUpdatedDate: any = "";
  srcbut: boolean;
  txtrow = 0;
  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  WorkOrderDetails: any[];
  WorkOrderDetailsClone: any[];
  WorkOrderDPinfo: any[];
  pager: any = {}; // pager object
  // paged items
  pagedItems: any[];
  selectedWoExchangeInfoDeactivate: any;
  selectedWoDpInfoDeactivate: any;
  deactivateHistory: any;
  selectedWoGeneralInfoDeactivate: any;
  ItemLocationList: any[];
  CategoryList: any[];
  MethodList: any[];
  UnitList: any[];
  DpLocation: any[];
  DPStatusvalues: any[];
  DepartmentList: any[];
  PriorityList: any[];
  ItemStatusList: any[];
  CurrencyList: any[];
  searchableList: any;
  searchableList1: any[] = [];
  work: any[];
  // Declare local variable
  direction: number;
  isLangArabic: boolean;
  currentLanguage: string;
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  setClickedRow: Function;
  selectedDeactivatePurchaseOrder: any;
  selectedDeactivateStoreItem: any;
  unitInfo: any = [];
  // Change sort function to this:
  @ViewChild("fileImportInput")
  fileImportInput: any;
  @ViewChild("fileImportInputWO")
  fileImportInputWO: any;
  loadStopper: boolean = false;
  constructor(
    private excelService: ExcelService,
    private sharedService: SharedService,
    private _fileUtil: FileUtil,
    private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private http: Http,
    private _localStorageService: LocalStorageService,
    private _translate: TranslateService
  ) {
    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];
    this.ItemLocationList = [];
    this.WorkOrderDetails = [];
    this.WorkOrderDetailsClone = [];
    this.UserType = [
      {
        label: "VIP",
        value: "VIP",
      },
      {
        label: "Officer",
        value: "Officer",
      },
      {
        label: "Non-Officer",
        value: "Non-Officer",
      },
      {
        label: "N/A",
        value: "N/A",
      }
    ];
    this.WorkType = [
      {
        id: "1",
        WorkType: "New Installation",
      },
      {
        id: "2",
        WorkType: "Replacement",
      },
      {
        id: "4",
        WorkType: "Transfer",
      },
      {
        id: "5",
        WorkType: "Repair",
      },
      {
        id: "3",
        WorkType: "N/A",
      },
    ];

    this.ExchangeStatus = [
      {
        label: "Active",
        value: "Active",
      },
      {
        label: "InActive",
        value: "InActive",
      },
      {
        label: "Faulty",
        value: "Faulty",
      },
      {
        label: "Spare",
        value: "Spare",
      },
      {
        label: "pw",
        value: "pw",
      },
      {
        label: "N/A",
        value: "N/A",
      },
    ];
    // to change the color of the selected row
    this.setClickedRow = function (emp: any) {
      emp.highLightRow = !emp.highLightRow;
    };
    self.showAdvanceSearch = true;
  }
  public searchForm: FormGroup;
  ngOnInit() {
    $(".app-loader").show();
    this.searchForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()]),
    });
    if (
      this.cookieService.get("user") != null &&
      this.cookieService.get("user") != "undefined"
    ) {
      var userCookie = JSON.parse(this.cookieService.get("user"));
      if (
        userCookie.sessionId != null ||
        (userCookie.sessionId != "" && userCookie.status === 1)
      ) {
        // setting the current language in currentLanguage variable and in _translate service, getting the data from backend for the table
        this.loadData();
        // getting the data from localStorage and storing it in userroleid variable
        this.userRoleId = this._localStorageService.get("userRoleId");
        // getting and setting user id and his access to the fields
        this.Permissions();
        this.sharedService
          .getVisibility()
          .subscribe((value: any) => (this.showMenu = value));
      }
    } else {
      this.router.navigate(["/login"]);
    }

    // setting the values for dp Status search box drop down
    this.getWODPStar();
    // setting the values for DP Location search box drop down
    this.getWODpLoc();
    // setting the values for Set Type search box drop down from API call
    this.getSetTypeList();
    // setting the values for Node no search box drop down
    this.getNodeArray();
    // setting the values for Act no search box drop down from API call
    this.getActArray();
    // setting the values for Camp Name search box drop down from API call
    this.getWOCampInfoList();
    this.loadAdvanceSearch();
    this.setunitInfo();
    this.srcbut = false;
  }

  Permissions() {
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
          let a = 0;
          for (a = 0; a < value2.length; a++) {
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



  // this is used to check wheather the column in data should be displayed or not
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

  getWODPStar() {
    return (
      this.DPStatusvalues = [
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
    )
  }
  getWODpLoc() {
    return (this.DpLocation = [
      {
        label: "IT Room",
        value: "IT Room",
      },
      {
        label: "IS Room",
        value: "IS Room",
      },
    ]);
  }
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

  getNodeArray() {
    this.nodeArray = [];
    for (var _i = 0; _i < 50; _i++) {
      if (_i >= 0 && _i < 10) {
        this.nodeArray.push("Node " + _i);
      } else if (_i != 12 && _i != 13) {
        this.nodeArray.push("Node " + _i);
      }
    }
  }

  public searchKeyArray: any = [];

  changeDateformat(unformattedDate: any) {
    if (unformattedDate == "0000-00-00" || unformattedDate == "Invalid Date") {
      return unformattedDate;
    }
    let date = new Date(unformattedDate);
    let dd = date.getDate().toString();
    let mm = (date.getMonth() + 1).toString();
    let yy = date.getFullYear();
    if (+dd < 10) {
      dd = ("0" + dd).toString();
    }
    if (+mm < 10) {
      mm = ("0" + mm).toString();
    }
    // let formattedDate = ;
    return (dd + "-" + mm + "-" + yy);
  }
  async manipulation(data: any) {
    let previd = -1;
    let b;
    console.log("value of for in 544");
    for (b = 0; b < data.length; b++) {
      let item = data[b];
      item.dp_info_full = item.dp_info;
      item.general_info_full = item.general_info;
      item.dp_info = [];
      item.general_info = [];
      console.log("value of for in 551");
      if(item.telephone_no == 10003){
      }
      console.log("value of for in 554");
      item.dp_info_full.forEach((ele: any) => {
        if (ele.status == 'Active') {
          item.dp_info.push(ele);
        }
      });
      console.log("value of for in 560");
      item.general_info_full.forEach((elem: any) => {
        if (elem.status == 'Active') {
          item.general_info.push(elem);
        }
      });
      console.log("value of for in 566");
      if (previd == item.id) {
        $(".app-loader").hide();
        return;
      } else {
        if (item.created_date && item.created_date != '0000-00-00') {
          let date = new Date(item.created_date)
          item.created_date = '';
          item.created_date = this.changeDateformat(date);
        } else {
          item.created_date = "";
        }
        item.fullid = {
          ex: item.id,
          dp: item.dp_info.length >= 1 ? item.dp_info[item.dp_info.length - 1].id : null,
          gn: item.general_info.length >= 1 ? item.general_info[item.general_info.length - 1].id : null,
        };
        if (item.dp_info.length >= 1 && item.dp_info[item.dp_info.length - 1].status == 'Active') {
          item.dp_id = item.dp_info[item.dp_info.length - 1].id;
          item.dp_telephone_no = item.dp_info[item.dp_info.length - 1].telephone_no;
          item.dp_name = item.dp_info[item.dp_info.length - 1].dp_name;
          item.dp_location = item.dp_info[item.dp_info.length - 1].dp_location;
          item.dp_capacity = item.dp_info[item.dp_info.length - 1].dp_capacity;
          item.dp_no = item.dp_info[item.dp_info.length - 1].dp_no;
          item.dp_pair = item.dp_info[item.dp_info.length - 1].pair_no;
          item.dp_dpstatus = item.dp_info[item.dp_info.length - 1].dp_status;
          item.dp_ooredoodp = item.dp_info[item.dp_info.length - 1].Ooredoo_dp;
          item.dp_ooredoopair = item.dp_info[item.dp_info.length - 1].Ooredoo_pair;
          item.dp_ooredoomdf = item.dp_info[item.dp_info.length - 1].Ooredoo_MDF;
          item.dp_createdby = item.dp_info[item.dp_info.length - 1].created_by;
          if (item.dp_info[item.dp_info.length - 1].created_date && item.dp_info[item.dp_info.length - 1].created_date != '0000-00-00') {
            item.dp_createddate = this.changeDateformat(item.dp_info[item.dp_info.length - 1].created_date);
          } else {
            item.dp_createddate = '';
          }
          item.dp_remarks = item.dp_info[item.dp_info.length - 1].remarks;
          item.dp_installedby = item.dp_info[item.dp_info.length - 1].installed_by;
          if (item.dp_info[item.dp_info.length - 1].installed_date && item.dp_info[item.dp_info.length - 1].installed_date != '0000-00-00') {
            item.dp_installeddate = this.changeDateformat(item.dp_info[item.dp_info.length - 1].installed_date);
          } else {
            item.dp_installeddate = "";
          }
          item.dp_recordedby = item.dp_info[item.dp_info.length - 1].recorded_by;
          if (item.dp_info[item.dp_info.length - 1].recorded_date && item.dp_info[item.dp_info.length - 1].recorded_date != '0000-00-00') {
            item.dp_recordeddate = this.changeDateformat(item.dp_info[item.dp_info.length - 1].recorded_date)
          } else { item.dp_recordeddate = '' }
          item.dp_mdfverticalfrom = item.dp_info[item.dp_info.length - 1].mdf_vertical_from;
          item.dp_mdfpairnofrom = item.dp_info[item.dp_info.length - 1].mdf_pair_no_from;
          item.dp_cablenofrom = item.dp_info[item.dp_info.length - 1].cable_no_from;
          item.dp_mdfverticalto = item.dp_info[item.dp_info.length - 1].mdf_vertical_to;
          item.dp_pairnoto = item.dp_info[item.dp_info.length - 1].mdf_pair_no_to;
          item.dp_cablenoto = item.dp_info[item.dp_info.length - 1].cable_no_to;
          item.dp_additionalinfo = item.dp_info[item.dp_info.length - 1].Additional_info;
          item.dp_status = item.dp_info[item.dp_info.length - 1].status;
        } else {
          item.dp_id = "";
          item.dp_telephone_no = "";
          item.dp_capacity = "";
          item.dp_no = "";
          item.dp_pair = "";
          item.dp_location = "";
          item.dp_mdfverticalto = "";
          item.dp_pairnoto = "";
          item.dp_cablenoto = "";
          item.dp_mdfverticalfrom = "";
          item.dp_mdfpairnofrom = "";
          item.dp_cablenofrom = "";
          item.dp_createdby = "";
          item.dp_createddate = "";
          item.dp_installedby = "";
          item.dp_installeddate = "";
          item.dp_recordedby = "";
          item.dp_recordeddate = "";
          item.dp_remarks = "";
          item.dp_status = "";
          item.dp_name = "";
          item.dp_ooredoodp = "";
          item.dp_ooredoopair = "";
          item.dp_additionalinfo = "";
          item.dp_dpstatus = "";
          item.dp_ooredoomdf = "";
        }
        if (item.general_info.length >= 1 && item.general_info[item.general_info.length - 1].status == 'Active') {
          item.gn_id = item.general_info[item.general_info.length - 1].id;
          item.gn_telephone = item.general_info[item.general_info.length - 1].telephone_no;
          item.gn_requestfrom = item.general_info[item.general_info.length - 1].request_from;
          item.gn_requestto = item.general_info[item.general_info.length - 1].request_to;
          item.gn_requestby = item.general_info[item.general_info.length - 1].requested_by;
          item.gn_approvedby = item.general_info[item.general_info.length - 1].approved_by;
          item.gn_storedemandno = item.general_info[item.general_info.length - 1].store_demand_no;
          item.gn_recordfileno = item.general_info[item.general_info.length - 1].record_file_no;
          item.gn_cableno = item.general_info[item.general_info.length - 1].cable_no;
          item.gn_status = item.general_info[item.general_info.length - 1].status;
          item.gn_cabledistance = item.general_info[item.general_info.length - 1].cable_distance;
        } else {
          item.gn_id = "";
          item.gn_telephone = "";
          item.gn_requestfrom = "";
          item.gn_requestto = "";
          item.gn_requestby = "";
          item.gn_approvedby = "";
          item.gn_storedemandno = "";
          item.gn_recordfileno = "";
          item.gn_cableno = "";
          item.gn_status = "";
          item.gn_cabledistance = "";
        }

        item.interlinked = [];


        for (let c = 0; c < this.WorkOrderDetailsClone.length; c++) {
          if (item.linked) {
            if (item.linked === this.WorkOrderDetailsClone[c].linked) {
              if (item.id !== this.WorkOrderDetailsClone[c].id) {
                item.interlinked.push(this.WorkOrderDetailsClone[c]);
              }
            }
            previd = item.id
          }
        }      
          if(item.history.length > 0){
            item.history.forEach((ele:any)=>{
              if(ele.cleared_date == null || ele.cleared_date == '' || ele.cleared_date == '0000-00-00'){
                ele.cleared_date = '';
              }
              if(ele.reported_date == null || ele.reported_date == '' || ele.reported_date == '0000-00-00'){
                ele.reported_date = '';
              }
            })
          }
        
        
      }
    }

    this.isDesc = false;
    this.WorkOrderDetails = data;
    this.sort("telephone_no");
    $(".app-loader").hide();
  }

  loadAdvanceSearch() {
    this.searchKeyArray = [
      { item: "telephone_no", label: "Telephone #" },
      { item: "linked", label: "Linked #" },
      { item: "sw_workorder_no", label: "S/W Work Order #" },
      { item: "manual_workorder_no", label: "Manual Work Order #" },
      { item: "set_type", label: "Set Type" },
      { item: "type_of_work", label: "Type of Work" },
      { item: "node_no", label: "Node #" },
      { item: "act_no", label: "ACT #" },
      { item: "cct_no", label: "CCT #" },
      { item: "camp_name", label: "Camp Name" },
      { item: "unit", label: "Force/unit" },
      { item: "exchange", label: "Exchange" },
      { item: "position", label: "Position" },
      { item: "user_type", label: "User Type" },
      { item: "user_name", label: "User Name" },
      { item: "created_by", label: "Created By" },
      { item: "created_date", label: "Exchange info Created Date" },
      { item: "exchange_status", label: "Exchange Status" },
      { item: "dp_name", label: "DP Name" },
      { item: "dp_location", label: "DP Location" },
      { item: "dp_capacity", label: "DP Capacity" },
      { item: "dp_no", label: "DP #" },
      { item: "pair_no", label: "DP Pair #" },
      { item: "dp_status", label: "DP Status" },
      { item: "Ooredoo_dp", label: "Service Provider DP #" },
      { item: "Ooredoo_pair", label: "Service Provider Pair #" },
      { item: "Ooredoo_MDF", label: "Service Provider MDF" },
      { item: "created_by", label: "Created By" },
      { item: "dp_created_date", label: "DP info Created Date" },
      { item: "remarks", label: "Remarks" },
      { item: "installed_by", label: "Installed By" },
      { item: "installed_date", label: "Installed Date" },
      { item: "recorded_by", label: "Recorded By" },
      { item: "mdf_vertical_from", label: "MDF-Vertical From" },
      { item: "mdf_pair_no_from", label: "MDF-Pair # From" },
      { item: "cable_no_from", label: "Cable Info From" },
      { item: "mdf_vertical_to", label: "MDF-Vertical To" },
      { item: "mdf_pair_no_to", label: "MDF-Pair # To" },
      { item: "cable_no_to", label: "Cable Info To" },
      { item: "Additional_info", label: "Additional Info" },
      { item: "request_from", label: "Request From" },
      { item: "request_to", label: "Request To" },
      { item: "requested_by", label: "Request By" },
      { item: "approved_by", label: "Approved By" },
      { item: "store_demand_no", label: "Store Demand #" },
      { item: "record_file_no", label: "Record File #" },
      { item: "cable_no", label: "Cable Info" },
      { item: "cable_distance", label: "Cable Distance(m)" },
    ];
  }

  async loadData() {

    // getting the current language from local storage
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    // setting the current language in Translate service
    this._translate.use(this.currentLanguage);
    // get the value of user such as from cookie
    let userSession = JSON.parse(this.cookieService.get("user"));
    let body = new URLSearchParams();
    body.append("action", "get_work_order_exchange_info");
    this.http
      .post(environment.apikey + "/generateJsonUrl.php", body)
      .map((res) => res.json())
      .subscribe(
        (res: any) => {
          if (!!res) {
            if (res.data) {
              let a = res.data.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.id === v.id)) === i);
              for (let item in a) {
                res.data[item]["hideInnerEmpRow"] = false;
              }
              this.WorkOrderDetailsClone = a;
              this.manipulation(a);
            } else {
              $(".app-loader").hide()
            }
          }
        },
        (error) => {
          console.log(error.json());
        }
      );

    if (this.currentLanguage == "en") {
      this.isLangArabic = false;
    } else {
      this.isLangArabic = true;
    }
  }

  // to expand or compress the table row
  toggleHiddenEmpRow(emp: any) {
    emp.hideInnerEmpRow = !emp.hideInnerEmpRow;
  }

  showAllHiddenEmpRow() {
    this.showHideAllRows = true;
    for (var item in this.WorkOrderDPinfo) {
      this.WorkOrderDPinfo[item].dp_info = true;
    }
  }

  showEditListPopup(employee: any) {
    $("#modalListItem").modal("show");
  }

  hideAllHiddenRows() {
    this.showHideAllRows = false;
    for (var item in this.WorkOrderDPinfo) {
      this.WorkOrderDPinfo[item].dp_info = false;
    }
  }

  onChange(event: any) {
    var files = event.srcElement.files;
  }

  get items(): FormArray {
    return this.searchForm.get("items") as FormArray;
  }

  deleteAction(i: number) {
    this.items.removeAt(i);
  }

  forceUnitChange() {
  }
  // to sort the data in table in ascending order or descending order
  sort(property: any) {
    // sorting the table rows into ascending or descending
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  // used to print the view modal
  Printme() {
    window.print();
  }

  showDeactivatePurchaseOrderPopup(emp: any) {
    $("#modalDeactivate").modal("show");
    this.selectedDeactivatePurchaseOrder = emp;
  }

  // to show or hide the search text box  in the table
  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
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
      { id: 23, unit: "Mike (M1)" },
      { id: 24, unit: "Mike (M2)" },
      { id: 25, unit: "Navy (N)" },
      { id: 26, unit: "Signals (W3)" },
      { id: 27, unit: "Al-Udeid" },
      { id: 28, unit: "Al-Mazrooa" },
      { id: 29, unit: "Um-Hawta" },
      { id: 30, unit: "Al-Zaeem College" },
      { id: 31, unit: "Moral-Guidence (T)" },
      { id: 32, unit: "New Camp 1" },
      { id: 33, unit: "New Camp 2" },
      { id: 34, unit: "N/A" },
    ]
  }
  // it will set all the dropdown values in search to null
  resetSearchDropDownValues() {
    $(".searchSetType").prop("selectedIndex", "0");
    $(".searchTypeOfWork").prop("selectedIndex", "0");

    $(".searchNoneNo").prop("selectedIndex", "0");
    $(".searchActNo").prop("selectedIndex", "0");
    $(".searchCampName").prop("selectedIndex", "0");
    $(".searchUserType").prop("selectedIndex", "0");
  }

  // to close advance search through x button
  closeandClearAdvanceSearch() {
    this.showAdvanceSearch = false;
    this.searchSWWorkOrder = "";
    this.searchManualWorkOrder = "";
    this.searchexTelephoneNo = "";
    this.Linkedno = "";
    this.searchSetType = "";
    this.searchTypeOfWork = "";
    this.searchNoneNo = "";
    this.searchActNo = "";
    this.searchCCTNo = "";
    this.searchCampName = "";
    this.searchUnit = "";
    this.ExchangeNo = "";
    this.searchPosition = "";
    this.searchUserType = "";
    this.searchUserName = "";
    this.searchCreatedBy = "";
    this.searchCreatedDate = "";
    this.search_dp_telephone = "";
    this.searchdpname = "";
    this.searchStatus = "";
    this.searchWorkOrderDpCapacity = "";
    this.searchSwWorkOrderDpNo = "";
    this.searchSwWorkOrderPairNo = "";
    this.searchSwWorkOrderStatus = "";
    this.OoredooDp = "";
    this.Ooredoopair = "";
    this.OoredooMDF = "";
    this.dpCreatedBy = "";
    this.dpcreatedDate = "";
    this.Remarks = "";
    this.InstalledBy = "";
    this.InstalledDate = "";
    this.RecordedBy = "";
    this.MDFVFrom = "";
    this.MDFPFrom = "";
    this.CableInfoFrom = "";
    this.MDFVTo = "";
    this.MDFPTo = "";
    this.CableInfoTo = "";
    this.DpAddInfo = "";
    this.GNTelephone = "";
    this.RequestFrom = "";
    this.RequestTo = "";
    this.RequestBy = "";
    this.ApprovedBy = "";
    this.StoreDemandNo = "";
    this.RecordFile = "";
    this.CableInfo = "";
    this.CableDistance = "";
    // it will set all the dropdown values in search to null
    this.resetSearchDropDownValues();
  }

  removePopUpCss() {
    $(".modal-dialog").css({
      width: "",
      right: "",
      padding: "",
    });
    $(".modal-footer").css({
      "padding-top": "",
      "text-align": "",
      border: "",
    });
    $(".modal-header").css({
      padding: "",
      border: "",
    });
    $(".modal-content").css({
      width: "",
      right: "",
    });
  }

  // deactivating or deleting exchange info record
  deleteExchangeInfo(emp: any) {
    this.hidePopUp("modalDeactivate");
    $(".app-loader").show();
    const ex = this.selectedWoExchangeInfoDeactivate.fullid.ex;
    const dp = this.selectedWoExchangeInfoDeactivate.fullid.dp;
    const gn = this.selectedWoExchangeInfoDeactivate.fullid.gn;
      let body = new URLSearchParams();
      body.append("action", "delete1");
      body.append("primary_key", "id");
      body.append("primary_key_value", ex);
      body.append("primary_key_value1", dp);
      body.append("primary_key_value2", gn);
      this.http.post(environment.apikey + "/CrudApplication.php", body).subscribe(
        (data: any) => {
          this.loadData();
        },
        (error) => {
          console.log(error.json());
        }
      );
    $(".app-loader").hide();
  }

  // deactivating or deleting the Dp info record
  deleteDpInfo(emp: any) {
    let body = new URLSearchParams();
    body.append("action", "deletehistory");
    body.append("table", "history");
    body.append("primary_key", "id");
    body.append("primary_key_value", this.deactivateHistory.id);
    this.http.post(environment.apikey + "/CrudApplication.php", body).subscribe(
      (data: any) => {
        this.loadData();
      },
      (error) => {
        console.log(error.json());
      }
    );
    this.hidePopUp("modalDeactivate1");
  }
  clearViewData() {
    this.viewhistory = [];
    this.ExchangeInfoSw_workorder_no = "";
    this.Exchangelinkedno = "";
    this.Exchange_Exchange = "";
    this.ExchangeInfoManual_workorder_no = "";
    this.ExchangeInfoType_of_Work = "";
    this.ExchangeInfoTelephone_no = "";
    this.ExchangeInfoSet_type = "";
    this.ExchangeInfoNode_no = "";
    this.ExchangeInfoAct_no = "";
    this.ExchangeInfoCct_no = "";
    this.ExchangeInfoCamp_name = "";
    this.ExchangeInfoUnit = "";
    this.ExchangeInfoPosition = "";
    this.ExInfoPosLen = true;
    this.ExchangeInfoUser_type = "";
    this.ExchangeInfoUser_name = "";
    this.ExchangeInfoCreated_by = "";
    this.ExchangeInfoCreated_date = "";
    this.ExchangeInfoStatus = "";
    this.dp_infoTelephone_no = "";
    this.dp_dpname = "";
    this.dp_Ooredoodp = "";
    this.dp_dp_Ooredoopair = "";
    this.dp_additionalinfo = "";
    this.dp_infoDp_capacity = "";
    this.dp_infoDp_no = "";
    this.dp_infoPair_no = "";
    this.dp_status = "";
    this.dp_OoredooMDF = "";
    this.dp_infoDp_location = "";
    this.dp_infoMdf_vertical_from = "";
    this.dp_infoMdf_pair_no_from = "";
    this.dp_infoCable_no_from = "";
    this.dp_infoMdf_vertical_to = "";
    this.dp_infoMdf_pair_no_to = "";
    this.dp_infoCable_no_to = "";
    this.dp_infoCreated_by = "";
    this.dp_infoCreated_date = "";
    this.dp_infoInstalled_by = "";
    this.dp_infoInstalled_date = "";
    this.dp_infoRecorded_by = "";
    this.dp_infoRecorded_date = "";
    this.dp_infoRemarks = "";
    this.general_infoTelephone_no = "";
    this.general_infoRequest_from = "";
    this.general_infoRequest_to = "";
    this.general_infoRequested_by = "";
    this.general_infoApproved_by = "";
    this.general_infoStore_demand_no = "";
    this.general_infoRecord_file_no = "";
    this.general_infoCable_no = "";
    this.general_infoCable_distance = "";
    this.viewhistory = "";
  }
  // showing modal and adding print functionallity to that modal
  viewAllinformation(ExchangeInfo: any) {
    this.clearViewData()
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    // if (this.currentLanguage === "en") {
    if (
      (this.checkOperation("11", "9") && this.checkOperation("11", "10")) ||
      this.checkOperation("11", "11")
    ) {
      $(".modal-content").css({
        width: "1200px",
        right: "300px",
        border: "none",
      });
    } else {
      $(".modal-content").css({
        width: "615px",
        border: "none",
      });
    }
    $(".modal-dialog").css({
      width: "1115px !important",
      right: "15px",
      padding: "15px",
      border: "none",
    });
    $(".modal-footer").css({
      "padding-top": "0px",
      "text-align": "center",
      border: "none",
    });
    $(".modal-header").css({
      padding: "7px 18px",
      border: "none",
    });
    this.viewhistory = [];
    console.log("value of exchangeinfo is",ExchangeInfo);
    this.ExchangeInfoSw_workorder_no = ExchangeInfo.sw_workorder_no;
    this.Exchangelinkedno = ExchangeInfo.linked;
    this.Exchange_Exchange = ExchangeInfo.exchange;
    this.ExchangeInfoManual_workorder_no = ExchangeInfo.manual_workorder_no;
    this.ExchangeInfoType_of_Work = ExchangeInfo.type_of_work;
    this.ExchangeInfoTelephone_no = ExchangeInfo.telephone_no;
    this.ExchangeInfoSet_type = ExchangeInfo.set_type;
    this.ExchangeInfoNode_no = ExchangeInfo.node_no;
    this.ExchangeInfoAct_no = ExchangeInfo.act_no;
    this.ExchangeInfoCct_no = ExchangeInfo.cct_no;
    this.ExchangeInfoCamp_name = ExchangeInfo.camp_name;
    this.ExchangeInfoUnit = ExchangeInfo.unit;
    this.ExchangeInfoPosition = ExchangeInfo.position;
    if(ExchangeInfo.position.length <= 27){
      this.ExInfoPosLen = true;
    } else {
      this.ExInfoPosLen = false
    }
    this.ExchangeInfoUser_type = ExchangeInfo.user_type;
    this.ExchangeInfoUser_name = ExchangeInfo.user_name;
    this.ExchangeInfoCreated_by = ExchangeInfo.created_by;
    this.ExchangeInfoCreated_date = ExchangeInfo.created_date;
    this.ExchangeInfoStatus = ExchangeInfo.status;
    for (let dp_info of ExchangeInfo.dp_info) {
      this.dp_infoTelephone_no = dp_info.telephone_no;
      this.dp_dpname = dp_info.dp_name;
      this.dp_Ooredoodp = dp_info.Ooredoo_dp;
      this.dp_dp_Ooredoopair = dp_info.Ooredoo_pair;
      this.dp_additionalinfo = dp_info.Additional_info;
      this.dp_infoDp_capacity = dp_info.dp_capacity;
      this.dp_infoDp_no = dp_info.dp_no;
      this.dp_infoPair_no = dp_info.pair_no;
      this.dp_status = dp_info.dp_status;
      this.dp_OoredooMDF = dp_info.Ooredoo_MDF;
      this.dp_infoDp_location = dp_info.dp_location;
      this.dp_infoMdf_vertical_from = dp_info.mdf_vertical_from;
      this.dp_infoMdf_pair_no_from = dp_info.mdf_pair_no_from;
      this.dp_infoCable_no_from = dp_info.cable_no_from;
      this.dp_infoMdf_vertical_to = dp_info.mdf_vertical_to;
      this.dp_infoMdf_pair_no_to = dp_info.mdf_pair_no_to;
      this.dp_infoCable_no_to = dp_info.cable_no_to;
      this.dp_infoCreated_by = dp_info.created_by;
      if (dp_info.created_date) {
        this.dp_infoCreated_date = this.changeDateformat(dp_info.created_date);
      } else {
        this.dp_infoCreated_date = '';
      }
      this.dp_infoInstalled_by = dp_info.installed_by;
      if (dp_info.installed_date && dp_info.installed_date != '0000-00-00') {
        this.dp_infoInstalled_date = this.changeDateformat(dp_info.installed_date);
      } else {
        this.dp_infoInstalled_date = '';
      }

      this.dp_infoRecorded_by = dp_info.recorded_by;
      this.dp_infoRecorded_date = dp_info.recorded_date;
      this.dp_infoRemarks = dp_info.remarks;
    }
    for (let general_info of ExchangeInfo.general_info) {
      this.general_infoTelephone_no = general_info.telephone_no;
      this.general_infoRequest_from = general_info.request_from;
      this.general_infoRequest_to = general_info.request_to;
      this.general_infoRequested_by = general_info.requested_by;
      this.general_infoApproved_by = general_info.approved_by;
      this.general_infoStore_demand_no = general_info.store_demand_no;
      this.general_infoRecord_file_no = general_info.record_file_no;
      this.general_infoCable_no = general_info.cable_no;
      this.general_infoCable_distance = general_info.cable_distance;
    }

    let row1 = 1;
    if(this.dp_additionalinfo != null && this.dp_additionalinfo != ""){
      console.log("value of additional info length is",this.dp_additionalinfo.length);
    row1 = Math.ceil(this.dp_additionalinfo.length / 25);
    console.log("value of row1 b4 adding is",row1);
    row1++;
  }
    console.log("value of row1 is",row1);
    this.txtrow = row1;
    switch(this.txtrow){
      case 1: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "950px"
      });
      break;
      case 2: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "965px"
      });
      break;
      case 3: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "980px"
      });
      break;
      case 4: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1005px"
      });
      break;
      case 5: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1020px"
      });
      break;
      case 6: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1035px"
      });
      break;
      case 7: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1050px"
      });
      break;
      case 8: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1065px"
      });
      break;
      case 9: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1080px"
      });
      break;
      case 10: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1095px"
      });
      break;
      default: $(".exchangeBlock, .dpBlock, .generalBlock").css({
        height: "1105px"
      });
    }
    this.viewhistory = ExchangeInfo.history
    $("#modalDeactivate4").modal("show");
  }

  // deactivating or deleting the selected general info record
  deleteGeneralInfo(emp: any) {
    let body = new URLSearchParams();
    body.append("action", "delete");
    body.append("table", "wo_general_info");
    body.append("primary_key", "id");
    body.append("primary_key_value", this.selectedWoGeneralInfoDeactivate.id);
    this.http.post(environment.apikey + "/CrudApplication.php", body).subscribe(
      (data: any) => {
        this.loadData();
      },
      (error) => {
        console.log(error.json());
      }
    );
    this.hidePopUp("modalDeactivate2");
  }

  // showing modal to deactivate of delete a row
  showDeactivateWoExchangeInfoPopup(emp: any) {
    $("#modalDeactivate").modal("show");
    this.selectedWoExchangeInfoDeactivate = emp;

  }
  // showing modal to deactivate or delete the selected DP info record
  showDeactivateWoDpInfoPopup(DpInfodata: any) {
    $("#modalDeactivate1").modal("show");
    this.deactivateHistory = DpInfodata;
  }

  // showing modal to deactivate or delete the selected general info record
  showDeactivateWoGeneralInfoPopup(GeneralInfodata: any) {
    $("#modalDeactivate2").modal("show");
    this.selectedWoGeneralInfoDeactivate = GeneralInfodata;
  }

  hidePopUp(popUpId: any) {
    $("#" + popUpId).modal("hide");
  }
  hideViewAllPopUp(model4: any) {
    this.removePopUpCss();
    $("#" + model4).modal("hide");
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }
  toggleImage() {
    this.showImage = !this.showImage;
  }

  editinformaion(data: any) {
    this._translate.setworkorderData(data);
    // let d=[data];
    console.log("value in edit information data is",data);
    this._localStorageService.set('workOrder',data.fullid);
    this.router.navigate(["/work-order-form-exchange-info/edit/" + data.id]);
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: "",
      fieldValue: "",
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  cancelSearch() {
    $(".app-loader").show();
    this.loadData();
    this.searchForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()]),
    });
  }
  onChangesearch(event: any) {
    let value = event.target.value;
    if (value == "Node") {
      $(event.target)
        .parent()
        .find("input")
        .addClass("hide")
        .removeClass("inline-display");
      $(event.target)
        .parent()
        .find(".node-select")
        .removeClass("hide")
        .addClass("inline-display");
    } else {
      $(event.target)
        .parent()
        .find("input")
        .removeClass("hide")
        .addClass("inline-display");
      $(event.target)
        .parent()
        .find(".node-select")
        .addClass("hide")
        .removeClass("inline-display");
    }
  }

  showUploaPopUp(table: any) {
    if (table == "History") {
      this.fileImportInput.nativeElement.value = "";
      $("#modalImport").modal("show");
    } else if (table == "WO") {
      this.fileImportInputWO.nativeElement.value = "";
      $("#modalImportWO").modal("show");
    }
  }

  fileList: any;
  fileChangeListener(event: any): void {
    //file upload event
    var target = event.target || event.srcElement;
    var files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert(
          this._translate.currentLang == "en"
            ? "Please import valid .csv file."
            : "الرجاء استيراد ملف .csv صالح."
        );
        this.fileReset();
      }
    }
    this.fileList = event.target.files;
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.fileImportInputWO.nativeElement.value = "";
  }

  import(table: any) {
    if (this.fileList.length > 0) {
      $(".app-loader").show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append("module", "history");
      formData.append("csv_data", file, file.name);
      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/history_csv.php";
      this.http.post(apiUrl1, formData, options).subscribe(
        (data) => {
          data = data;
          this.loadData();
          this.hidePopUp("modalImport");

          alert("Import done successfully.");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  exportToExcel(tablename: any) {
    let tabledata: any = [];
    let filename: string;
    if (tablename === "History") {
      for (let d = 0; d < this.WorkOrderDetails.length; d++) {
        if (this.WorkOrderDetails[d].history.length >= 1) {
          delete this.WorkOrderDetails[d].history[0].id;
          delete this.WorkOrderDetails[d].history[0].status;
          tabledata.push(this.WorkOrderDetails[d].history[0]);
        }
      }
      filename = "WorkOrder_History";
    } else if (tablename === "WO") {
      let temp: any = [];
      for (let e = 0; e < this.WorkOrderDetails.length; e++) {
        let temp1: any = {};
        delete this.WorkOrderDetails[e].history;
        delete this.WorkOrderDetails[e].interlinked;
        delete this.WorkOrderDetails[e].fullid;
        delete this.WorkOrderDetails[e].dp_location;
        delete this.WorkOrderDetails[e].dp_capacity;
        delete this.WorkOrderDetails[e].dp_no;
        delete this.WorkOrderDetails[e].pair_no;
        delete this.WorkOrderDetails[e].gn_cable_info;
        delete this.WorkOrderDetails[e].hideInnerEmpRow;
        delete this.WorkOrderDetails[e].ex_Force;
        delete this.WorkOrderDetails[e].id;
        delete this.WorkOrderDetails[e].status;
        temp1["Telephone #"] =
          this.WorkOrderDetails[e].telephone_no == null ? "" : this.WorkOrderDetails[e].telephone_no;
        temp1["Linked #"] = this.WorkOrderDetails[e].linked == null ? "" : this.WorkOrderDetails[e].linked;
        temp1["S/W Work Order #"] =
          this.WorkOrderDetails[e].sw_workorder_no == null ? "" : this.WorkOrderDetails[e].sw_workorder_no;
        temp1["Manual Work Order #"] =
          this.WorkOrderDetails[e].manual_workorder_no == null ? "" : this.WorkOrderDetails[e].manual_workorder_no;
        temp1["Set Type"] = this.WorkOrderDetails[e].set_type == null ? "" : this.WorkOrderDetails[e].set_type;
        temp1["Type of Work"] =
          this.WorkOrderDetails[e].type_of_work == null ? "" : this.WorkOrderDetails[e].type_of_work;
        temp1["Node #"] = this.WorkOrderDetails[e].node_no == null ? "" : this.WorkOrderDetails[e].node_no;
        temp1["ACT #"] = this.WorkOrderDetails[e].act_no == null ? "" : this.WorkOrderDetails[e].act_no;
        temp1["CCT #"] = this.WorkOrderDetails[e].cct_no == null ? "" : this.WorkOrderDetails[e].cct_no == "" ? "" : " " + this.WorkOrderDetails[e].cct_no;
        temp1["Camp Name"] = this.WorkOrderDetails[e].camp_name == null ? "" : this.WorkOrderDetails[e].camp_name;
        temp1["Force/Unit"] = this.WorkOrderDetails[e].unit == null ? "" : this.WorkOrderDetails[e].unit;
        temp1["Exchange"] = this.WorkOrderDetails[e].exchange == null ? "" : this.WorkOrderDetails[e].exchange;
        temp1["Position"] = this.WorkOrderDetails[e].position == null ? "" : this.WorkOrderDetails[e].position;
        temp1["User Type"] = this.WorkOrderDetails[e].user_type == null ? "" : this.WorkOrderDetails[e].user_type;
        temp1["User Name"] = this.WorkOrderDetails[e].user_name == null ? "" : this.WorkOrderDetails[e].user_name;
        temp1["Exchange Created By"] =
          this.WorkOrderDetails[e].created_by == null ? "" : this.WorkOrderDetails[e].created_by;
        temp1["Exchange Created Date"] =
          this.WorkOrderDetails[e].created_date == null ? "" : this.WorkOrderDetails[e].created_date;
        temp1["Exchange Status"] =
          this.WorkOrderDetails[e].exchange_status == null ? "" : this.WorkOrderDetails[e].exchange_status;
        if (this.WorkOrderDetails[e].dp_info.length >= 1) {
          delete this.WorkOrderDetails[e].dp_info[0].telephone_no;
          temp1["DP Name"] =
            this.WorkOrderDetails[e].dp_info[0].dp_name == null ? "" : this.WorkOrderDetails[e].dp_info[0].dp_name;
          temp1["DP Location"] =
            this.WorkOrderDetails[e].dp_info[0].dp_location == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].dp_location;
          temp1["DP Capacity"] =
            this.WorkOrderDetails[e].dp_info[0].dp_capacity == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].dp_capacity;
          temp1["DP #"] =
            this.WorkOrderDetails[e].dp_info[0].dp_no == null ? "" : this.WorkOrderDetails[e].dp_info[0].dp_no;
          temp1["DP Pair #"] =
            this.WorkOrderDetails[e].dp_info[0].pair_no == null ? "" : this.WorkOrderDetails[e].dp_info[0].pair_no;
          temp1["DP Status"] =
            this.WorkOrderDetails[e].dp_info[0].dp_status == null ? "" : this.WorkOrderDetails[e].dp_info[0].dp_status;
          temp1["Ooredoo DP #"] =
            this.WorkOrderDetails[e].dp_info[0].Ooredoo_dp == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].Ooredoo_dp;
          temp1["Ooredoo Pair #"] =
            this.WorkOrderDetails[e].dp_info[0].Ooredoo_pair == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].Ooredoo_pair;
          temp1["Ooredoo MDF"] =
            this.WorkOrderDetails[e].dp_info[0].Ooredoo_MDF == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].Ooredoo_MDF;
          temp1["DP Created By"] =
            this.WorkOrderDetails[e].dp_info[0].created_by == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].created_by;
          temp1["DP Created Date"] =
            this.WorkOrderDetails[e].dp_info[0].created_date == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].created_date;
          temp1["Remarks"] =
            this.WorkOrderDetails[e].dp_info[0].remarks == null ? "" : this.WorkOrderDetails[e].dp_info[0].remarks;
          temp1["Installed By"] =
            this.WorkOrderDetails[e].dp_info[0].installed_by == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].installed_by;
          temp1["Installed Date"] =
            this.WorkOrderDetails[e].dp_info[0].installed_date == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].installed_date;
          temp1["Recorded By"] =
            this.WorkOrderDetails[e].dp_info[0].recorded_by == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].recorded_by;
          temp1["MDF Vertical From"] =
            this.WorkOrderDetails[e].dp_info[0].mdf_vertical_from == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].mdf_vertical_from;
          temp1["MDF Pair # From"] =
            this.WorkOrderDetails[e].dp_info[0].mdf_pair_no_from == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].mdf_pair_no_from;
          temp1["Cable Info From"] =
            this.WorkOrderDetails[e].dp_info[0].cable_no_from == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].cable_no_from;
          temp1["MDF Vertical To"] =
            this.WorkOrderDetails[e].dp_info[0].mdf_vertical_to == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].mdf_vertical_to;
          temp1["MDF Pair # To"] =
            this.WorkOrderDetails[e].dp_info[0].mdf_pair_no_to == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].mdf_pair_no_to;
          temp1["Cable Info To"] =
            this.WorkOrderDetails[e].dp_info[0].cable_no_to == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].cable_no_to;
          temp1["Additional Info"] =
            this.WorkOrderDetails[e].dp_info[0].Additional_info == null
              ? ""
              : this.WorkOrderDetails[e].dp_info[0].Additional_info;
        } else {
          temp1["DP Name"] = "";
          temp1["DP Location"] = "";
          temp1["DP Capacity"] = "";
          temp1["DP #"] = "";
          temp1["DP Pair #"] = "";
          temp1["DP Status"] = "";
          temp1["Ooredoo DP #"] = "";
          temp1["Ooredoo Pair #"] = "";
          temp1["Ooredoo MDF"] = "";
          temp1["DP Created By"] = "";
          temp1["DP Created Date"] = "";
          temp1["Remarks"] = "";
          temp1["Installed By"] = "";
          temp1["Installed Date"] = "";
          temp1["Recorded By"] = "";
          temp1["MDF Vertical From"] = "";
          temp1["MDF Pair # From"] = "";
          temp1["Cable Info From"] = "";
          temp1["MDF Vertical To"] = "";
          temp1["MDF Pair # To"] = "";
          temp1["Cable Info To"] = "";
          temp1["Additional Info"] = "";
        }
        if (this.WorkOrderDetails[e].general_info.length >= 1) {
          delete this.WorkOrderDetails[e].general_info[0].telephone_no;
          temp1["Request From"] =
            this.WorkOrderDetails[e].general_info[0].request_from == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].request_from;
          temp1["Request To"] =
            this.WorkOrderDetails[e].general_info[0].request_to == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].request_to;
          temp1["Request By"] =
            this.WorkOrderDetails[e].general_info[0].requested_by == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].requested_by;
          temp1["Approved By"] =
            this.WorkOrderDetails[e].general_info[0].approved_by == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].approved_by;
          temp1["Store Demand #"] =
            this.WorkOrderDetails[e].general_info[0].store_demand_no == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].store_demand_no;
          temp1["Record #"] =
            this.WorkOrderDetails[e].general_info[0].record_file_no == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].record_file_no;
          temp1["Cable Info"] =
            this.WorkOrderDetails[e].general_info[0].cable_no == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].cable_no;
          temp1["Cable Distance(m)"] =
            this.WorkOrderDetails[e].general_info[0].cable_distance == null
              ? ""
              : this.WorkOrderDetails[e].general_info[0].cable_distance;
        } else {
          temp1["Request From"] = "";
          temp1["Request To"] = "";
          temp1["Request By"] = "";
          temp1["Approved By"] = "";
          temp1["Store Demand #"] = "";
          temp1["Record #"] = "";
          temp1["Cable Info"] = "";
          temp1["Cable Distance(m)"] = "";
        }
        temp.push(temp1);
      }
      tabledata = temp;
      filename = "WorkOrder_Info";
    }
    this.excelService.download(tabledata, filename);
  }

  public OnSubmit(formValue: any) {
    let body = new URLSearchParams();
    let temp = { ...formValue }
    temp.items.forEach((ele: any) => {
      if (ele.fieldName == "created_date" || ele.fieldName == "dp_created_date" || ele.fieldName == "installed_date") {
        const dat = ele.fieldValue.split("-");
        let formatteddat: string;
        const laststr = dat[dat.length - 1]
        if (laststr.length == 4) {
          formatteddat = dat[2].trim() + "-" + dat[1].trim() + "-" + dat[0].trim();
        } else if (laststr.length == 2) {
          formatteddat = dat[0].trim() + "-" + dat[1].trim() + "-" + dat[2].trim();
        }
        ele.fieldValue = formatteddat;

      }
    });
    body.append("items", JSON.stringify(temp));
    body.append("action", "entities1");
    this.http
      .post(environment.apikey + "/generateJsonUrl.php", body)
      .map((res) => res.json())
      .subscribe(
        (res: any) => {
          if (res.code == 100) {
            let a = res.data.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.id === v.id)) === i)
            this.manipulation(a);
            temp = {};
          } else {
            this.WorkOrderDetails = null;
            temp = {};
          }
        },
        (error: any) => {
          temp = {};
          let err = error.json();
        }
      );
  }

  importWO() {

    if (this.fileList.length > 0) {
      this.loadStopper = true;
      $(".app-loader").show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append("action", "add");
      formData.append("file", file, file.name);
      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/group_insert1.php";
      this.http.post(apiUrl1, formData, options).subscribe(
        (data) => {
          this.hidePopUp("modalImportWO");
          // $(".app-loader").hide();
          alert("Import done successfully.");
          this.loadData();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
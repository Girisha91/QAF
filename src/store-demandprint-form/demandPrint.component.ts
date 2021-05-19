import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { LocalStorageService } from 'angular-2-local-storage';
declare var $: any;
@Component({
  selector: 'demandPrint',
  templateUrl: './demandPrint.component.html',
  styleUrls: [('./demandPrint.component.css').toString()]
})
export class DemandPrintComponent implements OnInit {
  environment: any = environment;
  ss: any;
  IssueForm: any;
  FaultyForm: any;
  RepairForm: any;
  DepartmentList: any[];
  DemandBookDetails: any[];
  SearchFilterDBDetails: any[] = [];
  StoreItemDetails: any[] = [];
  FilteredStoreItems: any[] = [];
  StoreItems: any[];
  serialNo: any;
  LoanForm: any;
  LoanReturnForm: any;
  material_id: any;
  materialIssue: any;
  quantityIssue: any;
  materialLoan: any;
  quantityLoan: any;
  currentDate: any;
  DemandNumber: any;
  Id: any;
  clicks: Number = 0;
  demandBookId: any;
  title: string;
  isReadOnly: Boolean = false;
  isGenereatedDemandNoOnly: Boolean = true;
  isItemSerialNo: Boolean = true;
  isItemNameOnly: Boolean = true;
  isItemPartNoOnly: Boolean = true;
  isCurrentDateOnly: Boolean = true;
  opr: any;
  issuedFieldsArray: any = [];
  issuedNonCtrlArray: any = [];
  loanNonCtrlArray: any = [];
  LoanReturnArray: any = [];
  // errorIssueClear: Function;
  // errorFaultyClear: Function;
  // errorUnderRepairClear: Function;
  // errorLoanClear: Function;
  // errorLoanReturnClear: Function;
  // private issuedFieldsArray: Array<any> = [];
  private FaultyFieldsArray: Array<any> = [];
  private UnderRepairFieldsArray: Array<any> = [];
  private LoanFieldsArray: Array<any> = [];
  private newAttribute: any = {};
  statusList: any[];
  materialList: any[];
  itemList: any = [];
  issuedNumberList: any = [];
  userPermissionInfo: any;
  userRoleName: any;
  DemandNumberList: any = [];
  issuedItemList: any = [];
  faultyItemList: any = [];
  repairItemList: any = [];
  loanItemList: any = [];
  storeUsersList: any = [];
  suprefnameList: any[];
  selectFormValue = 1;
  materialData: any[];
  itemData: any[];
  errorIssueMonitoring: string = '';
  errorIssueControlNo: string = '';
  errorIssueDateIssued: string = '';
  errorIssueReferenceNo: string = '';
  errorIssueIssuedBy: string = '';
  errorIssueDepartment: string = '';
  errorIssueRequestParty: string = '';
  errorIssueManualDemandNo: string = '';
  errorIssueRecipient: string = '';
  errorIssueDistributor: string = '';
  errorIssueWHofficer: string = '';
  errorIssueWHcommander: string = '';
  errorIssueWHApplicant: string = '';
  errorIssueWHApproval: string = '';
  errorIssueWHfinancialNotes: string = '';
  errorIssueOperRecommend: string = '';
  errorFaultyMonitoring: string = '';
  errorFaultyControlNo: string = '';
  errorFaultyDateIssued: string = '';
  errorFaultyReferenceNo: string = '';
  errorFaultyIssuedBy: string = '';
  errorFaultyDepartment: string = '';
  errorFaultyRequestParty: string = '';
  errorFaultyManualDemandNo: string = '';
  errorFaultyRecipient: string = '';
  errorFaultyDistributor: string = '';
  errorFaultyWHofficer: string = '';
  errorFaultyWHcommander: string = '';
  errorFaultyWHApplicant: string = '';
  errorFaultyWHApproval: string = '';
  errorFaultyWHfinancialNotes: string = '';
  errorFaultyOperRecommend: string = '';
  errorUnderRepairMonitoring: string = '';
  errorUnderRepairControlNo: string = '';
  errorUnderRepairDateIssued: string = '';
  errorUnderRepairReferenceNo: string = '';
  errorUnderRepairIssuedBy: string = '';
  errorUnderRepairDepartment: string = '';
  errorUnderRepairRequestParty: string = '';
  errorUnderRepairManualDemandNo: string = '';
  errorUnderRepairRecipient: string = '';
  errorUnderRepairDistributor: string = '';
  errorUnderRepairWHofficer: string = '';
  errorUnderRepairWHcommander: string = '';
  errorUnderRepairWHApplicant: string = '';
  errorUnderRepairWHApproval: string = '';
  errorUnderRepairWHfinancialNotes: string = '';
  errorUnderRepairOperRecommend: string = '';
  errorLoanMonitoring: string = '';
  errorLoanControlNo: string = '';
  errorLoanDateIssued: string = '';
  errorLoanReferenceNo: string = '';
  errorLoanIssuedBy: string = '';
  errorLoanDepartment: string = '';
  errorLoanRequestParty: string = '';
  errorLoanManualDemandNo: string = '';
  errorLoanRecipient: string = '';
  errorLoanDistributor: string = '';
  errorLoanWHofficer: string = '';
  errorLoanWHcommander: string = '';
  errorLoanWHApplicant: string = '';
  errorLoanWHApproval: string = '';
  errorLoanWHfinancialNotes: string = '';
  errorLoanOperRecommend: string = '';
  errorLoanReturnManualDemandNo: string = '';
  errorLoanReturnDepartment: string = '';
  errorLoanReturnRecipient: string = '';
  errorLoanReturnApplicant: string = '';

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private _localStorageService: LocalStorageService, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.ss = {};
    this.IssueForm = {};
    this.FaultyForm = {};
    this.RepairForm = {};
    this.LoanForm = {};
    this.LoanReturnForm = {};
    if (action == 'edit' && param) {
      this.Id = param;
      this.title = 'Update Form';
      this.opr = 1;
      this.isReadOnly = false;
      this.isGenereatedDemandNoOnly = true;
      this.isItemNameOnly = true;
      this.isItemSerialNo = true;
      this.isItemPartNoOnly = true;
      this.isCurrentDateOnly = true;
      this.getDemandBookData('edit');
    } else if (action == 'view') {
      this.Id = param;
      this.title = 'View  Form';
      this.opr = 2;
      this.isReadOnly = true;
      this.isGenereatedDemandNoOnly = true;
      this.isItemNameOnly = true;
      this.isItemPartNoOnly = true;
      this.isCurrentDateOnly = true;
      this.isItemSerialNo = true;
      this.getDemandBookData('view');

    } else {
      this.opr = 0;
      this.title = 'Add Form';
      this.isGenereatedDemandNoOnly = false;
      this.isCurrentDateOnly = false;
      this.isItemNameOnly = true;
      this.isItemSerialNo = false;
      this.isItemPartNoOnly = true;
      this.isReadOnly = false;
    }
    this.suprefnameList = [
      {
        label: "Supplier",
        value: "1"
      },
      {
        label: "Work Shop",
        value: "2"
      }
    ]
    this.statusList = [
      {
        status: "Issue",
        value: "1"
      },
      {
        status: "Faulty",
        value: "2"
      },
      {
        status: "UnderRepair",
        value: "3"
      },
      {
        status: "Loan",
        value: "4"
      },
      {
        status: "LoanReturn",
        value: "5"
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
    //  this.getStoreItemDetails();
    this.getMaterailList();
    this.getstoreUsersList();
    this.getDemandBookList();
    // this.getSupplierList();
    this.getDepartmentList();
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

  getDemandBookData(method: any) {
    let body = new URLSearchParams();
    body.append('action', 'getDemandItems');
    body.append('material_demand_no', this.Id);
    body.append('method', method);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          switch (res.form_type) {
            case 'issue':
              this.selectFormValue = 1;
              this.IssueForm = res;
              for (let item in this.IssueForm.store_item) {
                if (this.IssueForm.store_item[item].quantity_nc == null) {
                  this.issuedFieldsArray.push(this.IssueForm.store_item[item]);
                } else {
                  this.issuedNonCtrlArray.push(this.IssueForm.store_item[item]);
                }
              }
              break;
            case 'faulty':
              this.selectFormValue = 2;
              this.FaultyForm = res;
              this.FaultyFieldsArray = this.FaultyForm.store_item;
              break;
            case 'repair':
              this.selectFormValue = 3;
              this.RepairForm = res;
              this.UnderRepairFieldsArray = this.RepairForm.store_item;
              break;
            case 'loan':
              this.selectFormValue = 4;
              this.LoanForm = res;
              this.LoanFieldsArray = this.LoanForm.store_item;
              break;
            case 'loanReturn':
              this.selectFormValue = 5;
              this.LoanReturnForm = res;
              for (let item in res.store_item) {
                this.LoanReturnArray.push(res.store_item[item]);
              }
              break;
          }
          // this.IssueForm = res;
          // for (let item in this.IssueForm.store_item) {
          //   var material_id_val = this.IssueForm.store_item[item].label;
          //   this.getIssueItemList(material_id_val, item);
          // }
          // this.issuedFieldsArray = this.IssueForm.store_item;
        }
      }, error => {
        console.log(error.json());
      });
  }

  getSupplierList() {
    let body = new URLSearchParams();
    body.append('action', 'getSupplierList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.suprefnameList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }
  errorIssueClear() {
    this.errorIssueMonitoring = '';
    this.errorIssueControlNo = '';
    this.errorIssueDateIssued = '';
    this.errorIssueReferenceNo = '';
    this.errorIssueIssuedBy = '';
    this.errorIssueDepartment = '';
    this.errorIssueRequestParty = '';
    this.errorIssueManualDemandNo = '';
    this.errorIssueRecipient = '';
    this.errorIssueDistributor = '';
    this.errorIssueWHofficer = '';
    this.errorIssueWHcommander = '';
    this.errorIssueWHApplicant = '';
    this.errorIssueWHApproval = '';
    this.errorIssueWHfinancialNotes = '';
    this.errorIssueOperRecommend = '';
  }
  errorFaultyClear() {
    this.errorFaultyMonitoring = '';
    this.errorFaultyControlNo = '';
    this.errorFaultyDateIssued = '';
    this.errorFaultyReferenceNo = '';
    this.errorFaultyIssuedBy = '';
    this.errorFaultyDepartment = '';
    this.errorFaultyRequestParty = '';
    this.errorFaultyManualDemandNo = '';
    this.errorFaultyRecipient = '';
    this.errorFaultyDistributor = '';
    this.errorFaultyWHofficer = '';
    this.errorFaultyWHcommander = '';
    this.errorFaultyWHApplicant = '';
    this.errorFaultyWHApproval = '';
    this.errorFaultyWHfinancialNotes = '';
    this.errorFaultyOperRecommend = '';
  }
  errorUnderRepairClear() {
    this.errorUnderRepairMonitoring = '';
    this.errorUnderRepairControlNo = '';
    this.errorUnderRepairDateIssued = '';
    this.errorUnderRepairReferenceNo = '';
    this.errorUnderRepairIssuedBy = '';
    this.errorUnderRepairDepartment = '';
    this.errorUnderRepairRequestParty = '';
    this.errorUnderRepairManualDemandNo = '';
    this.errorUnderRepairRecipient = '';
    this.errorUnderRepairDistributor = '';
    this.errorUnderRepairWHofficer = '';
    this.errorUnderRepairWHcommander = '';
    this.errorUnderRepairWHApplicant = '';
    this.errorUnderRepairWHApproval = '';
    this.errorUnderRepairWHfinancialNotes = '';
    this.errorUnderRepairOperRecommend = '';
  }
  errorLoanClear() {
    this.errorLoanMonitoring = '';
    this.errorLoanControlNo = '';
    this.errorLoanDateIssued = '';
    this.errorLoanReferenceNo = '';
    this.errorLoanRequestParty = '';
    this.errorLoanManualDemandNo = '';
    this.errorLoanRecipient = '';
    this.errorLoanDistributor = '';
    this.errorLoanWHofficer = '';
    this.errorLoanWHcommander = '';
    this.errorLoanWHApplicant = '';
    this.errorLoanWHApproval = '';
    this.errorLoanWHfinancialNotes = '';
    this.errorLoanOperRecommend = '';
  }
  errorLoanReturnClear() {
    this.errorLoanReturnManualDemandNo = '';
    this.errorLoanReturnDepartment = '';
    this.errorLoanReturnRecipient = '';
    this.errorLoanReturnApplicant = '';
  }
  isModelIssueValid(MaterialIssue: any) {
    let isValid = true;
    this.errorIssueMonitoring = '';
    this.errorIssueControlNo = '';
    this.errorIssueDateIssued = '';
    this.errorIssueReferenceNo = '';
    this.errorIssueIssuedBy = '';
    this.errorIssueDepartment = '';
    this.errorIssueRequestParty = '';
    this.errorIssueManualDemandNo = '';
    this.errorIssueRecipient = '';
    this.errorIssueDistributor = '';
    this.errorIssueWHofficer = '';
    this.errorIssueWHcommander = '';
    this.errorIssueWHApplicant = '';
    this.errorIssueWHApproval = '';
    this.errorIssueWHfinancialNotes = '';
    this.errorIssueOperRecommend = '';
    if (Object.keys(MaterialIssue).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.monitoring == 'undefined') {
    //   this.errorIssueMonitoring = 'Monitoring is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.control_no == 'undefined') {
    //   this.errorIssueControlNo = 'Control No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.date_issued == 'undefined') {
    //   this.errorIssueDateIssued = 'Date Issued is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.reference_no == 'undefined') {
    //   this.errorIssueReferenceNo = 'Reference No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.request_party == 'undefined') {
    //   this.errorIssueRequestParty = 'Request Party is Required';
    //   isValid = false;
    // }

    if (Object.keys(MaterialIssue).length && typeof MaterialIssue.issued_by == 'undefined') {
      this.errorIssueIssuedBy = 'Issued By is Required';
      isValid = false;
    }

    if (Object.keys(MaterialIssue).length && typeof MaterialIssue.department == 'undefined') {
      this.errorIssueDepartment = 'Department is Required';
      isValid = false;
    }

    if (Object.keys(MaterialIssue).length && typeof MaterialIssue.manual_demand_no == 'undefined') {
      this.errorIssueManualDemandNo = 'Manual Demand No is Required';
      isValid = false;
    }
    if (Object.keys(MaterialIssue).length && typeof MaterialIssue.recipient == 'undefined') {
      this.errorIssueRecipient = 'Recipient is Required';
      isValid = false;
    }
    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.distributor == 'undefined') {
    //   this.errorIssueDistributor = 'Distributor is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.warehouse_officer == 'undefined') {
    //   this.errorIssueWHofficer = 'Warehouse Officer is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.warehouse_commander == 'undefined') {
    //   this.errorIssueWHcommander = 'Warehouse Commander is Required';
    //   isValid = false;
    // }

    if (Object.keys(MaterialIssue).length && typeof MaterialIssue.applicant == 'undefined') {
      this.errorIssueWHApplicant = 'Applicant is Required';
      isValid = false;
    }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.force_commander_approval == 'undefined') {
    //   this.errorIssueWHApproval = 'Force Commander Approval is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.financial_notes == 'undefined') {
    //   this.errorIssueWHfinancialNotes = 'Financial notes is Required';
    //   isValid = false;
    // }

    // if (Object.keys(MaterialIssue).length && typeof MaterialIssue.operational_recommendations == 'undefined') {
    //   this.errorIssueOperRecommend = 'Operational Recommendations is Required';
    //   isValid = false;
    // }
    return isValid;
  }
  isModelFaultyValid(FaultyForm: any) {
    let isValid = true;
    this.errorFaultyMonitoring = '';
    this.errorFaultyControlNo = '';
    this.errorFaultyDateIssued = '';
    this.errorFaultyReferenceNo = '';
    this.errorFaultyIssuedBy = '';
    this.errorFaultyDepartment = '';
    this.errorFaultyRequestParty = '';
    this.errorFaultyManualDemandNo = '';
    this.errorFaultyRecipient = '';
    this.errorFaultyDistributor = '';
    this.errorFaultyWHofficer = '';
    this.errorFaultyWHcommander = '';
    this.errorFaultyWHApplicant = '';
    this.errorFaultyWHApproval = '';
    this.errorFaultyWHfinancialNotes = '';
    this.errorFaultyOperRecommend = '';
    if (Object.keys(FaultyForm).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.monitoring == 'undefined') {
    //   this.errorFaultyMonitoring = 'Monitoring is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.control_no == 'undefined') {
    //   this.errorFaultyControlNo = 'Control No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.date_issued == 'undefined') {
    //   this.errorFaultyDateIssued = 'Date Issued is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.reference_no == 'undefined') {
    //   this.errorFaultyReferenceNo = 'Reference No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.request_party == 'undefined') {
    //   this.errorFaultyRequestParty = 'Request Party is Required';
    //   isValid = false;
    // }
    if (Object.keys(FaultyForm).length && typeof FaultyForm.issued_by == 'undefined') {
      this.errorFaultyIssuedBy = 'Issued By is Required';
      isValid = false;
    }

    if (Object.keys(FaultyForm).length && typeof FaultyForm.department == 'undefined') {
      this.errorFaultyDepartment = 'Department is Required';
      isValid = false;
    }
    if (Object.keys(FaultyForm).length && typeof FaultyForm.manual_demand_no == 'undefined') {
      this.errorFaultyManualDemandNo = 'Manual Demand No is Required';
      isValid = false;
    }
    if (Object.keys(FaultyForm).length && typeof FaultyForm.recipient == 'undefined') {
      this.errorFaultyRecipient = 'Recipient is Required';
      isValid = false;
    }
    // if (Object.keys(FaultyForm).length && typeof FaultyForm.distributor == 'undefined') {
    //   this.errorFaultyDistributor = 'Distributor is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.warehouse_officer == 'undefined') {
    //   this.errorFaultyWHofficer = 'Warehouse Officer is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.warehouse_commander == 'undefined') {
    //   this.errorFaultyWHcommander = 'Warehouse Commander is Required';
    //   isValid = false;
    // }

    if (Object.keys(FaultyForm).length && typeof FaultyForm.applicant == 'undefined') {
      this.errorFaultyWHApplicant = 'Applicant is Required';
      isValid = false;
    }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.force_commander_approval == 'undefined') {
    //   this.errorFaultyWHApproval = 'Force Commander Approval is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.financial_notes == 'undefined') {
    //   this.errorFaultyWHfinancialNotes = 'Financial notes is Required';
    //   isValid = false;
    // }

    // if (Object.keys(FaultyForm).length && typeof FaultyForm.operational_recommendations == 'undefined') {
    //   this.errorFaultyOperRecommend = 'Operational Recommendations is Required';
    //   isValid = false;
    // }
    return isValid;
  }

  isModelUnderRepairValid(UnderRepairMaterial: any) {
    let isValid = true;
    this.errorUnderRepairMonitoring = '';
    this.errorUnderRepairControlNo = '';
    this.errorUnderRepairDateIssued = '';
    this.errorUnderRepairReferenceNo = '';
    this.errorUnderRepairIssuedBy = '';
    this.errorUnderRepairDepartment = '';
    this.errorUnderRepairRequestParty = '';
    this.errorUnderRepairManualDemandNo = '';
    this.errorUnderRepairRecipient = '';
    this.errorUnderRepairDistributor = '';
    this.errorUnderRepairWHofficer = '';
    this.errorUnderRepairWHcommander = '';
    this.errorUnderRepairWHApplicant = '';
    this.errorUnderRepairWHApproval = '';
    this.errorUnderRepairWHfinancialNotes = '';
    this.errorUnderRepairOperRecommend = '';
    if (Object.keys(UnderRepairMaterial).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.monitoring == 'undefined') {
    //   this.errorUnderRepairMonitoring = 'Monitoring is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.control_no == 'undefined') {
    //   this.errorUnderRepairControlNo = 'Control No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.date_issued == 'undefined') {
    //   this.errorUnderRepairDateIssued = 'Date Issued is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.reference_no == 'undefined') {
    //   this.errorUnderRepairReferenceNo = 'Reference No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.request_party == 'undefined') {
    //   this.errorUnderRepairRequestParty = 'Request Party is Required';
    //   isValid = false;
    // }
    if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.issued_by == 'undefined') {
      this.errorUnderRepairIssuedBy = 'Issued By is Required';
      isValid = false;
    }

    if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.department == 'undefined') {
      this.errorUnderRepairDepartment = 'Department is Required';
      isValid = false;
    }
    if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.manual_demand_no == 'undefined') {
      this.errorUnderRepairManualDemandNo = 'Manual Demand No is Required';
      isValid = false;
    }
    if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.recipient == 'undefined') {
      this.errorUnderRepairRecipient = 'Recipient is Required';
      isValid = false;
    }
    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.distributor == 'undefined') {
    //   this.errorUnderRepairDistributor = 'Distributor is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.warehouse_officer == 'undefined') {
    //   this.errorUnderRepairWHofficer = 'Warehouse Officer is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.warehouse_commander == 'undefined') {
    //   this.errorUnderRepairWHcommander = 'Warehouse Commander is Required';
    //   isValid = false;
    // }

    if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.applicant == 'undefined') {
      this.errorUnderRepairWHApplicant = 'Applicant is Required';
      isValid = false;
    }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.force_commander_approval == 'undefined') {
    //   this.errorUnderRepairWHApproval = 'Force Commander Approval is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.financial_notes == 'undefined') {
    //   this.errorUnderRepairWHfinancialNotes = 'Financial notes is Required';
    //   isValid = false;
    // }

    // if (Object.keys(UnderRepairMaterial).length && typeof UnderRepairMaterial.operational_recommendations == 'undefined') {
    //   this.errorUnderRepairOperRecommend = 'Operational Recommendations is Required';
    //   isValid = false;
    // }
    return isValid;
  }

  isModelLoanValid(LoanForm: any) {
    let isValid = true;
    this.errorLoanMonitoring = '';
    this.errorLoanControlNo = '';
    this.errorLoanDateIssued = '';
    this.errorLoanReferenceNo = '';
    this.errorUnderRepairIssuedBy = '';
    this.errorUnderRepairDepartment = '';
    this.errorLoanRequestParty = '';
    this.errorLoanManualDemandNo = '';
    this.errorLoanRecipient = '';
    this.errorLoanDistributor = '';
    this.errorLoanWHofficer = '';
    this.errorLoanWHcommander = '';
    this.errorLoanWHApplicant = '';
    this.errorLoanWHApproval = '';
    this.errorLoanWHfinancialNotes = '';
    this.errorLoanOperRecommend = '';
    if (Object.keys(LoanForm).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    // if (Object.keys(LoanForm).length && typeof LoanForm.monitoring == 'undefined') {
    //   this.errorLoanMonitoring = 'Monitoring is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.control_no == 'undefined') {
    //   this.errorLoanControlNo = 'Control No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.date_issued == 'undefined') {
    //   this.errorLoanDateIssued = 'Date Issued is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.reference_no == 'undefined') {
    //   this.errorLoanReferenceNo = 'Reference No is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.request_party == 'undefined') {
    //   this.errorLoanRequestParty = 'Request Party is Required';
    //   isValid = false;
    // }
    if (Object.keys(LoanForm).length && typeof LoanForm.issued_by == 'undefined') {
      this.errorLoanIssuedBy = 'Issued By is Required';
      isValid = false;
    }
    if (Object.keys(LoanForm).length && typeof LoanForm.department == 'undefined') {
      this.errorLoanDepartment = 'Department is Required';
      isValid = false;
    }
    if (Object.keys(LoanForm).length && typeof LoanForm.manual_demand_no == 'undefined') {
      this.errorLoanManualDemandNo = 'Manual Demand No is Required';
      isValid = false;
    }
    if (Object.keys(LoanForm).length && typeof LoanForm.recipient == 'undefined') {
      this.errorLoanRecipient = 'Recipient is Required';
      isValid = false;
    }
    // if (Object.keys(LoanForm).length && typeof LoanForm.distributor == 'undefined') {
    //   this.errorLoanDistributor = 'Distributor is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.warehouse_officer == 'undefined') {
    //   this.errorLoanWHofficer = 'Warehouse Officer is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.warehouse_commander == 'undefined') {
    //   this.errorLoanWHcommander = 'Warehouse Commander is Required';
    //   isValid = false;
    // }

    if (Object.keys(LoanForm).length && typeof LoanForm.applicant == 'undefined') {
      this.errorLoanWHApplicant = 'Applicant is Required';
      isValid = false;
    }

    // if (Object.keys(LoanForm).length && typeof LoanForm.force_commander_approval == 'undefined') {
    //   this.errorLoanWHApproval = 'Force Commander Approval is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.financial_notes == 'undefined') {
    //   this.errorLoanWHfinancialNotes = 'Financial notes is Required';
    //   isValid = false;
    // }

    // if (Object.keys(LoanForm).length && typeof LoanForm.operational_recommendations == 'undefined') {
    //   this.errorLoanOperRecommend = 'Operational Recommendations is Required';
    //   isValid = false;
    // }
    return isValid;
  }

  isModelLoanReturnValid(LoanReturnForm: any) {
    let isValid = true;
    this.errorLoanReturnManualDemandNo = '';
    this.errorLoanReturnDepartment = '';
    this.errorLoanReturnRecipient = '';
    this.errorLoanReturnApplicant = '';
    if (Object.keys(LoanReturnForm).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }
    if (Object.keys(LoanReturnForm).length && typeof LoanReturnForm.department == 'undefined') {
      this.errorLoanReturnDepartment = 'Department is Required';
      isValid = false;
    }
    if (Object.keys(LoanReturnForm).length && typeof LoanReturnForm.manual_demand_no == 'undefined') {
      this.errorLoanReturnManualDemandNo = 'Manual Demand No is Required';
      isValid = false;
    }
    if (Object.keys(LoanReturnForm).length && typeof LoanReturnForm.issued_by == 'undefined') {
      this.errorLoanReturnRecipient = 'Recipient is Required';
      isValid = false;
    }

    if (Object.keys(LoanReturnForm).length && typeof LoanReturnForm.applicant == 'undefined') {
      this.errorLoanReturnApplicant = 'Applicant is Required';
      isValid = false;
    }
    return isValid;
  }

  selectForm(status: any) {
    for (let statusValue in this.statusList) {
      if (this.statusList[statusValue].value == status) {
        switch (this.statusList[statusValue].value) {
          case '1':
            this.DemandNumber = "";
            this.selectFormValue = 1;
            this.IssueForm = {};
            this.issuedNonCtrlArray = [];
            this.issuedFieldsArray = [];
            this.errorIssueClear();
            break;
          case '2':
            this.DemandNumber = "";
            this.selectFormValue = 2;
            this.FaultyForm = {};
            this.errorFaultyClear();
            this.FaultyFieldsArray = [];
            break;
          case '3':
            this.DemandNumber = "";
            this.selectFormValue = 3;
            this.RepairForm = {};
            this.errorUnderRepairClear();
            this.UnderRepairFieldsArray =[];
            break;
          case '4':
            this.DemandNumber = "";
            this.selectFormValue = 4;
            this.LoanForm = {};
            this.errorLoanClear();
            this.LoanFieldsArray = [];
            break;
          case '5':
            this.DemandNumber = "";
            this.selectFormValue = 5;
            this.LoanReturnForm = {};
            this.LoanReturnArray = [];
            this.errorLoanReturnClear();
            break;
        }
      }
    }
  }
  // getCurrentDate(){
  //   var today = new Date();
  //   this.currentDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  //   console.log(this.currentDate);
  //   this.LoanForm.currentDate =this.currentDate;
  //   this.IssueForm.currentDate =this.currentDate;
  //   this.FaultyForm.currentDate =this.currentDate;
  //   this.RepairForm.currentDate =this.currentDate;
  // }


  changeItemStatus(event: any, index: any) {
    let id = $("#serialNo" + index).val();
    let status = event.target.value;
  }


  getMaterailList() {
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }


  changeIssueItemList(material_id: any, i: any) {
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialData = res;
          for (let itemname in this.materialData) {
            if (this.materialData[itemname].material_id == material_id) {
              this.issuedFieldsArray[i].item_name = this.materialData[itemname].label;
              this.issuedFieldsArray[i].item_part_no = this.materialData[itemname].part_no;
            }
          }
        }
        this.getIssueItemList(material_id, i);
      }, error => {
        console.log(error.json());
      });
  }
  getIssueItemInformation(event: any, item_Serial_no: any, i: any) {
    let material_id = event.label;
    let body = new URLSearchParams();
    body.append('action', 'getItemDetails');
    body.append('item_id', item_Serial_no);
    body.append('material_id', material_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.itemData = res;
          for (let itemname in this.itemData) {
            if (this.itemData[itemname].serial_no == item_Serial_no) {
              this.issuedFieldsArray[i].site_name = this.itemData[itemname].site_name;
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }


  updateMaterialIssue(MaterialIssue: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    MaterialIssue.store_item = this.issuedFieldsArray;
    MaterialIssue.store_item_nc = this.issuedNonCtrlArray;
    MaterialIssue.username = userRoleName;
    MaterialIssue.form_type = "issue";
    let body = new URLSearchParams();
    body.append('action', 'updateMaterialIssue');
    body.append('data', JSON.stringify(MaterialIssue));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
    this.closeAndRedirect();
  }
  updateFaultyMaterial(FaultyForm: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    FaultyForm.store_item = this.FaultyFieldsArray;
    FaultyForm.username = userRoleName;
    FaultyForm.form_type = "faulty";
    let body = new URLSearchParams();
    body.append('action', 'updateMaterialIssue');
    body.append('data', JSON.stringify(FaultyForm));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }
  updateUnderRepairMaterial(RepairForm: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    RepairForm.store_item = this.UnderRepairFieldsArray;
    RepairForm.username = userRoleName;
    RepairForm.form_type = "repair";
    let body = new URLSearchParams();
    body.append('action', 'updateMaterialIssue');
    body.append('data', JSON.stringify(RepairForm));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }
  updateLoanMaterial(LoanForm: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    LoanForm.store_item = this.LoanFieldsArray;
    LoanForm.username = userRoleName;
    LoanForm.form_type = "loan";
    let body = new URLSearchParams();
    body.append('action', 'updateMaterialIssue');
    body.append('data', JSON.stringify(LoanForm));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  changeFaultyItemList(event: any, i: any) {
    let material_id = event.target.value;
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialData = res;
          for (let itemname in this.materialData) {
            if (this.materialData[itemname].material_id == material_id) {
              this.FaultyFieldsArray[i].item_name = this.materialData[itemname].label;
              this.FaultyFieldsArray[i].item_part_no = this.materialData[itemname].part_no;
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }

  getFaultyItemInformation(event: any, i: any) {
    let item_id = event.target.value;
    let body = new URLSearchParams();
    body.append('action', 'getItemDetails');
    body.append('item_id', item_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.itemData = res;
          for (let itemname in this.itemData) {
            if (this.itemData[itemname].id == item_id) {
              this.FaultyFieldsArray[i].site_name = this.itemData[itemname].site_name;
              this.FaultyFieldsArray[i].serialNoValue = this.itemData[itemname].serial_no;
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }

  changeRepairItemList(event: any, i: any) {
    let material_id = event.target.value;
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialData = res;
          for (let itemname in this.materialData) {
            if (this.materialData[itemname].material_id == material_id) {
              this.UnderRepairFieldsArray[i].item_name = this.materialData[itemname].label;
              this.UnderRepairFieldsArray[i].item_part_no = this.materialData[itemname].part_no;
            }
          }
        }
        this.getRepairItemList(material_id, i);
      }, error => {
        console.log(error.json());
      });
  }
  getRepairItemInformation(event: any, i: any) {
    let item_id = event.target.value;
    let body = new URLSearchParams();
    body.append('action', 'getItemDetails');
    body.append('item_id', item_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.itemData = res;
          for (let itemname in this.itemData) {
            if (this.itemData[itemname].id == item_id) {
              this.UnderRepairFieldsArray[i].site_name = this.itemData[itemname].site_name;
              this.UnderRepairFieldsArray[i].serialNoValue = this.itemData[itemname].serial_no;
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }
  changeLoanItemList(event: any, i: any) {
    let material_id = event.target.value;
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialData = res;
          for (let itemname in this.materialData) {
            if (this.materialData[itemname].material_id == material_id) {
              this.LoanFieldsArray[i].item_name = this.materialData[itemname].label;
              this.LoanFieldsArray[i].item_part_no = this.materialData[itemname].part_no;
            }
          }
        }
        this.getLoanItemList(material_id, i);
      }, error => {
        console.log(error.json());
      });
  }
  getLoanItemInformation(event: any, i: any) {
    let item_id = event.target.value;
    let body = new URLSearchParams();
    body.append('action', 'getItemDetails');
    body.append('item_id', item_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.itemData = res;
          for (let itemname in this.itemData) {
            if (this.itemData[itemname].id == item_id) {
              this.LoanFieldsArray[i].site_name = this.itemData[itemname].site_name;
              this.LoanFieldsArray[i].serialNoValue = this.itemData[itemname].serial_no;
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }

  getIssueItemList(material_id: any, i: any) {
    let body = new URLSearchParams();
    body.append('action', 'getItemList');
    body.append('material_id', material_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.issuedItemList.splice(i, 1, res);
        }
      }, error => {
        // console.log(error.json());
      });
  }


  getDemandBookList() {
    let body = new URLSearchParams();
    body.append('action', 'getIssuedItems');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          for (var item in res) {
            res[item]["hideInnerEmpRow"] = false;
          }
          this.DemandNumberList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }

  getFaultyItemList(material_id: any, i: any) {
    let body = new URLSearchParams();
    body.append('action', 'getItemList');
    body.append('material_id', material_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.faultyItemList.splice(i, 1, res);
        }
      }, error => {
        // console.log(error.json());
      });
  }

  getRepairItemList(material_id: any, i: any) {
    let body = new URLSearchParams();
    body.append('action', 'getItemList');
    body.append('material_id', material_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.repairItemList.splice(i, 1, res);
        }
      }, error => {
        // console.log(error.json());
      });
  }

  getLoanItemList(material_id: any, i: any) {
    let body = new URLSearchParams();
    body.append('action', 'getItemList');
    body.append('material_id', material_id);
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.loanItemList.splice(i, 1, res);
        }
      }, error => {
        // console.log(error.json());
      });
  }


  getstoreUsersList() {
    let body = new URLSearchParams();
    body.append('action', 'getUserDetails');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.storeUsersList = res;
        }
      }, error => {
        console.log(error.json());
      });
  }

  addFieldsValue(material_id: any, quantity: any, formtype: any) {
    let body1 = new URLSearchParams();
    body1.append('action', 'getCountItems');
    body1.append('material_id', material_id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body1)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == '100') {
          setTimeout(() => {
            if (res.hasOwnProperty('data') && +res.data < +quantity) {
              alert("Only " + res.data + " Items are Avilable"  );
            } else {
              let body = new URLSearchParams();
              body.append('action', 'getMaterailList');
              this.http.post(environment.apikey + '/masterData.php', body)
                .map(res => res.json())
                .subscribe((res: any) => {
                  if (!!res) {
                    this.materialData = res;
                    for (let itemname in this.materialData) {
                      if ((this.materialData[itemname].material_id == material_id) && (this.materialData[itemname].category == 'Controllable')) {
                        for (let i = 0; i < quantity; i++) {
                          var object = {
                            material_id: "",
                            item_name: "",
                            item_part_no: "",
                            serial_no: "",
                            site_name: "",
                            remarks: ""
                          };
                          object.material_id = this.materialData[itemname].material_id;
                          object.item_name = this.materialData[itemname].label;
                          object.item_part_no = this.materialData[itemname].part_no;
                          if (formtype == 'Issue') {
                            this.issuedFieldsArray.push(object);
                          } else if (formtype == 'Loan') {
                            this.LoanFieldsArray.push(object);
                          }
                        }
                      } else if ((this.materialData[itemname].material_id == material_id) && (this.materialData[itemname].category == 'Non-Controllable')) {
                        var objectNc = {
                          material_id: "",
                          item_name: "",
                          item_part_no: "",
                          quantity_nc: "",
                          site_name: "",
                          remarks: ""
                        };
                        objectNc.material_id = this.materialData[itemname].material_id;
                        objectNc.item_name = this.materialData[itemname].label;
                        objectNc.item_part_no = this.materialData[itemname].part_no;
                        objectNc.quantity_nc = quantity;
                        if (formtype == 'Issue') {
                          this.issuedNonCtrlArray.push(objectNc);
                        } else if (formtype == 'Loan') {
                          this.loanNonCtrlArray.push(objectNc);
                        }
                      }
                    }
                  }
                }, error => {
                  console.log(error.json());
                });

            }
            // setted Delay for 3sec to get api response to fetch redirect to view page particular demand_number 
          }, 3000);
        } else if ((res.code == '101')) {
          alert(res.message);
        }
      }, error => {
        console.log(error.json());
      });
    // this.issuedFieldsArray.push(this.newAttribute);
    // this.newAttribute = {};
  }
  clearIssueFieldsValue() {
    this.materialIssue = "";
    this.quantityIssue = "";
  }
  clearLoanFieldsValue() {
    this.materialLoan = "";
    this.quantityLoan = "";
  }
  addFaultyFieldsValue() {
    this.FaultyFieldsArray.push(this.newAttribute);
    // this.newAttribute = {};
  }
  addUnderRepairFieldsValue() {
    this.UnderRepairFieldsArray.push(this.newAttribute);
    this.newAttribute = {};
  }
  addLoanFieldsValue() {
    this.LoanFieldsArray.push(this.newAttribute);
    this.newAttribute = {};
  }
  deleteIssueFieldsValue(index: any) {
    this.issuedNonCtrlArray.splice(index, 1);
    this.issuedFieldsArray.splice(index, 1);
    this.issuedItemList.splice(index, 1);
  }
  deleteFaultyFieldsValue(index: any) {
    this.FaultyFieldsArray.splice(index, 1);
    this.faultyItemList.splice(index, 1);
  }
  deleteUnderRepairFieldsValue(index: any) {
    this.UnderRepairFieldsArray.splice(index, 1);
    this.repairItemList.splice(index, 1);
  }
  deleteLoanFieldsValue(index: any) {
    this.loanNonCtrlArray.splice(index, 1);
    this.LoanFieldsArray.splice(index, 1);
    this.loanItemList.splice(index, 1);
  }
  deleteLoanReturnValue(index: any) {
    this.LoanReturnArray.splice(index, 1);
  }

  submitFaultyDemandNumber(DemandNumber: any) {
    let body = new URLSearchParams();
    body.append('action', 'getDemandItems');
    body.append('material_demand_no', DemandNumber);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.FaultyForm = res;
          this.FaultyFieldsArray = this.FaultyForm.store_item;
        }
      }, error => {
        console.log(error.json());
      });
  }
  submitUnderRepairDemandNumber(DemandNumber: any) {
    let body = new URLSearchParams();
    body.append('action', 'getDemandItems');
    body.append('material_demand_no', DemandNumber);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.RepairForm = res;
          this.UnderRepairFieldsArray = this.RepairForm.store_item;
        }
      }, error => {
        console.log(error.json());
      });
  }

  submitLoanReturnDemandNumber(DemandNumber: any) {
    let body = new URLSearchParams();
    body.append('action', 'getDemandItems');
    body.append('material_demand_no', DemandNumber);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.LoanReturnArray = res.store_item;
        }
      }, error => {
        console.log(error.json());
      });
  }

  // getStoreItemDetails() {
  //   let body = new URLSearchParams();
  //   body.append('action', "get_storeReport_items");
  //   this.http.post(environment.apikey + '/masterData.php', body)
  //     .map(res => res.json())
  //     .subscribe((res: any) => {
  //       this.StoreItemDetails = res;
  //     });
  // }



  addMaterialIssue(MaterialIssue: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    let userCookie = JSON.parse(this.cookieService.get('user'));
    MaterialIssue.username = userRoleName;
    var isModelIssueValid = this.isModelIssueValid(MaterialIssue);
    if (!isModelIssueValid) {
      return;
    }
    let countValidate: number = 0;
    for (let k = 0; k < this.issuedFieldsArray.length; k++) {
      if (this.issuedFieldsArray[k].serial_no == "") {
        countValidate++;
      }
    }
    if (countValidate > 0) {
      alert("please enter Serial no");
    } else {
      if (this.issuedFieldsArray.length > 1) {
        let count: number = 0;
        let duplicateSerialNumbers: any = [];
        for (var i = 0; i < this.issuedFieldsArray.length; i++) {
          for (var j = i + 1; j < this.issuedFieldsArray.length; j++) {
            if ((this.issuedFieldsArray[i].serial_no === this.issuedFieldsArray[j].serial_no) && (this.issuedFieldsArray[i].item_name === this.issuedFieldsArray[j].item_name)) {
              // alert("you have already selected Item with this Serial No" + " " + this.issuedFieldsArray[i].serial_no + " " + "please change it");
              duplicateSerialNumbers.push(this.issuedFieldsArray[i].serial_no);
              count++;
            }
          }
        }
        if (count == 0) {
          MaterialIssue.store_item = this.issuedFieldsArray;
          MaterialIssue.store_item_nc = this.issuedNonCtrlArray;
          MaterialIssue.form_type = "issue";
          let body = new URLSearchParams();
          body.append('action', 'addMaterialIssue');
          body.append('data', JSON.stringify(MaterialIssue));
          body.append('sessionId', userCookie.sessionId);
          this.http.post(environment.apikey + '/generateJsonUrl.php', body)
            .map(res => res.json())
            .subscribe(data => {
              if (data.code == 100) {
                this.demandBookId = data.materialDemandNo;
              } else {
                alert(data.message);
              }
            }, error => {
              console.log(error.json());
            }).add(() => {
              this.closeAndRedirectToView();
              //Called when operation is complete (both success and error)
            });
        } else {
          alert("you have already selected Item with this Serial No" + " ' " + duplicateSerialNumbers + " ' " + "please change it");
        }

      }
      else {
        MaterialIssue.store_item = this.issuedFieldsArray;
        MaterialIssue.store_item_nc = this.issuedNonCtrlArray;
        MaterialIssue.form_type = "issue";
        let body = new URLSearchParams();
        body.append('action', 'addMaterialIssue');
        body.append('data', JSON.stringify(MaterialIssue));
        body.append('sessionId', userCookie.sessionId);
        this.http.post(environment.apikey + '/generateJsonUrl.php', body)
          .map(res => res.json())
          .subscribe(data => {
            if (data.code == 100) {
              this.demandBookId = data.materialDemandNo;
            } else {
              alert(data.message);
            }
          }, error => {
            console.log(error.json());
          }).add(() => {
            this.closeAndRedirectToView();
            //Called when operation is complete (both success and error)
          });
      }
    }
  }
  addFaultyMaterial(FaultyMaterial: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    FaultyMaterial.username = userRoleName;
    let userCookie = JSON.parse(this.cookieService.get('user'));
    var isModelFaultyValid = this.isModelFaultyValid(FaultyMaterial);
    if (!isModelFaultyValid) {
      return;
    }
    FaultyMaterial.form_type = "faulty";
    FaultyMaterial.store_item = this.FaultyFieldsArray;
    delete FaultyMaterial.material_demand_no;

    let body = new URLSearchParams();
    body.append('action', 'addMaterialIssue');
    body.append('data', JSON.stringify(FaultyMaterial));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          this.demandBookId = data.materialDemandNo;
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      }).add(() => {
        this.closeAndRedirectToView();
        //Called when operation is complete (both success and error)
      });
  }
  addUnderRepairMaterial(UnderRepairMaterial: any) {

    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    UnderRepairMaterial.username = userRoleName;
    let userCookie = JSON.parse(this.cookieService.get('user'));
    var isModelUnderRepairValid = this.isModelUnderRepairValid(UnderRepairMaterial);
    if (!isModelUnderRepairValid) {
      return;
    }
    UnderRepairMaterial.form_type = "repair";
    UnderRepairMaterial.store_item = this.UnderRepairFieldsArray;
    delete UnderRepairMaterial.material_demand_no;
    let body = new URLSearchParams();
    body.append('action', 'addMaterialIssue');
    body.append('data', JSON.stringify(UnderRepairMaterial));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          this.demandBookId = data.materialDemandNo;
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      }).add(() => {
        this.closeAndRedirectToView();
        //Called when operation is complete (both success and error)
      });

  }
  addLoanMaterial(LoanForm: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    let userCookie = JSON.parse(this.cookieService.get('user'));
    LoanForm.username = userRoleName;
    var isModelLoanValid = this.isModelLoanValid(LoanForm);
    if (!isModelLoanValid) {
      return;
    }
    let countValidate: number = 0;
    for (let k = 0; k < this.LoanFieldsArray.length; k++) {
      if (this.LoanFieldsArray[k].serial_no == "") {
        countValidate++;
      }
    }
    if (countValidate > 0) {
      alert("please enter Serial no");
    } else {
      if (this.LoanFieldsArray.length > 1) {
        let count: number = 0;
        let duplicateSerialNumbers: any = [];
        for (var i = 0; i < this.LoanFieldsArray.length; i++) {
          for (var j = i + 1; j < this.LoanFieldsArray.length; j++) {
            if ((this.LoanFieldsArray[i].serial_no === this.LoanFieldsArray[j].serial_no) && (this.LoanFieldsArray[i].item_name === this.LoanFieldsArray[j].item_name)) {
              // alert("you have already selected Item with this Serial No" + " " + this.LoanFieldsArray[i].serial_no + " " + "please change it");
              duplicateSerialNumbers.push(this.LoanFieldsArray[i].serial_no);
              count++;
            }
          }
        }
        if (count == 0) {
          LoanForm.store_item = this.LoanFieldsArray;
          LoanForm.form_type = "loan";
          let body = new URLSearchParams();
          body.append('action', 'addMaterialIssue');
          body.append('data', JSON.stringify(LoanForm));
          body.append('sessionId', userCookie.sessionId);
          this.http.post(environment.apikey + '/generateJsonUrl.php', body)
            .map(res => res.json())
            .subscribe(data => {
              if (data.code == 100) {
                this.demandBookId = data.materialDemandNo;
              } else {
                alert(data.message);
              }
            }, error => {
              console.log(error.json());
            }).add(() => {
              this.closeAndRedirectToView();
              //Called when operation is complete (both success and error)
            });
        } else {
          alert("you have already selected Item with this Serial No" + " ' " + duplicateSerialNumbers + " ' " + "please change it");
        }

      }
      else {
        LoanForm.store_item = this.LoanFieldsArray;
        LoanForm.form_type = "loan";
        let body = new URLSearchParams();
        body.append('action', 'addMaterialIssue');
        body.append('data', JSON.stringify(LoanForm));
        body.append('sessionId', userCookie.sessionId);
        this.http.post(environment.apikey + '/generateJsonUrl.php', body)
          .map(res => res.json())
          .subscribe(data => {
            if (data.code == 100) {
              this.demandBookId = data.materialDemandNo;
            } else {
              alert(data.message);
            }
          }, error => {
            console.log(error.json());
          }).add(() => {
            this.closeAndRedirectToView();
            //Called when operation is complete (both success and error)
          });
      }
    }
  }
  addLoanReturnMaterial(LoanReturnForm: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    let userCookie = JSON.parse(this.cookieService.get('user'));
    LoanReturnForm.username = userRoleName;
    var isModelLoanReturnValid = this.isModelLoanReturnValid(LoanReturnForm);
    if (!isModelLoanReturnValid) {
      return;
    }
    LoanReturnForm.form_type = "loanReturn";
    LoanReturnForm.store_item = this.LoanReturnArray;
    delete LoanReturnForm.material_demand_no;
    let body = new URLSearchParams();
    body.append('action', 'addMaterialIssue');
    body.append('data', JSON.stringify(LoanReturnForm));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          this.demandBookId = data.materialDemandNo;
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      }).add(() => {
        this.closeAndRedirectToView();
        //Called when operation is complete (both success and error)
      });
  }
  Print(id: any) {
    window.print();
  }
  closeAndRedirect() {
    this.router.navigate(['/store/demandBookList']);
  }
  closeAndRedirectToView() {
    this.router.navigate(['/demandBookForm/view', this.demandBookId]);
  }
}

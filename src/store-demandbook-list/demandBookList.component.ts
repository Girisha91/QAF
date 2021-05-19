import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
import { LocalStorageService } from 'angular-2-local-storage';
import { storeDemandBookSearchPipe } from '../app/storepipes/store-demandbook.pipe';
declare var $ :any;
@Component({
  selector: 'demandBookList',
  templateUrl: './demandBookList.component.html',
  styleUrls: [('./demandBookList.component.css').toString()]
})
export class DemandBookListComponent implements OnInit {
  environment: any = environment;
  ss: any;
  DemandBookDetails: any[];
  SearchFilterDBDetails: any[] = [];
  storeUsersList: any = [];
  DepartmentList: any[];
  FilteredStoreItems: any[] = [];
  StoreItems: any[];
  userPermissionInfo: any;
  userRoleName: any;
  serialNo: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  opr: any;
  isDesc: boolean = false;
  direction: number;
  column: string;
  showAdvanceSearch: boolean;
  searchGenratedDBNo: any;
  searchDate: any;
  isLangArabic: boolean;
  currentLanguage: string;
  searchManualDBNo: any;
  searchMonitoring: any;
  searchControlNo: any;
  searchReferenceNo: any;
  searchRequestParty: any;
  searchRecipient: any;
  searchDistributor: any;
  searchWHOfficer: any;
  searchWHCommander: any;
  searchApplicant: any;
  searchForceCommanderApproval: any;
  searchFinancialNotes: any;
  searchOperationalRecommendations: any;
  selectedDeactivateDemandBook: any;
  formType: any[];
  statusList: any[];
  errorSup_bus_name: string = '';
  errorSup_ref_name: string = '';
  errorContact_person_name1: string = '';
  errorAddress1: string = '';
  errorCountry: string = '';
  errorContact_person_name2: string = '';
  errorAddress2: string = '';
  errorPo_box_no: string = '';
  errorTelephone1: string = '';
  errorTelephone2: string = '';
  errorTelephone3: string = '';
  errorFax_no_1: string = '';
  errorFax_no_2: string = '';
  errorFax_no_3: string = '';
  errorEmail1: string = '';
  errorEmail2: string = '';
  errorWebsite: string = '';
  errorDescriptions: string = '';
  errorStatus: string = '';


  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute,private _localStorageService: LocalStorageService, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.ss = {};
    if (action == 'edit' && param) {
      this.Id = param;
      this.title = 'Update supplier';
      this.opr = 1;
      this.isReadOnly = false;
    } else if (action == 'view' && param) {
      this.Id = param;
      this.title = 'View supplier';
      this.opr = 2;
      this.isReadOnly = true;

    } else {
      this.opr = 0;
      this.title = 'Add supplier';
      this.isReadOnly = false;
    }
    this.showAdvanceSearch = true;
    this.formType = [
      {
        type: "Issue",
        value: "1"
      },
      {
        type: "Faulty",
        value: "2"
      },
      {
        type: "Repair",
        value: "3"
      },
      {
        type: "LoanForm",
        value: "4"
      },
      {
        type: "LoanReturn",
        value: "5"
      },
      {
        type: "oldLoanItem",
        value: "6"
      }
    ];
    this.statusList = [
      {
        label: "Active",
        value: "1"
      },
      {
        label: "Inactive",
        value: "0"
      }
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
    this.getstoreUsersList();
    this.getDepartmentList();
    this.loadDemandData();
    this.sort('date_issued');
    this.sort('date_issued');
  }

  loadDemandData() {
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    $('.app-loader').show();
    let body = new URLSearchParams();
    body.append('action', 'getIssuedItems');
    // body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          for (var item in res) {
            // console.log(res[item].form_type);
            res[item]["hideInnerEmpRow"] = false;
            res[item]["highLightRow"] = false;
            if(res[item].form_type =='loan'){
              res[item].form_type ='LoanForm';
            }
          }
          this.DemandBookDetails = res;
          $('.app-loader').hide();
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

  setClickedRow(demand: any) {
    demand.highLightRow = !demand.highLightRow;
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

  showDeactivateDemandBookPopup(material_demand_no: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateDemandBook = material_demand_no;
  }
  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }
  deleteDemandBook() {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    let body = new URLSearchParams();
    body.append('action', 'deleteMaterialIssue');
    body.append('material_demand_no', this.selectedDeactivateDemandBook);
    body.append('username', userRoleName);
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
        this.loadDemandData();
      }, error => {
        console.log(error.json());
      });
    this.hidePopUp('modalDeactivate');
  }

  isModelValid(ss: any) {
    let isValid = true;
    this.errorSup_bus_name = '';
    this.errorSup_ref_name = '';
    this.errorContact_person_name1 = '';
    this.errorAddress1 = '';
    this.errorCountry = '';
    this.errorContact_person_name2 = '';
    this.errorAddress2 = '';
    this.errorPo_box_no = '';
    this.errorTelephone1 = '';
    this.errorTelephone2 = '';
    this.errorTelephone3 = '';
    this.errorFax_no_1 = '';
    this.errorFax_no_2 = '';
    this.errorFax_no_3 = '';
    this.errorEmail1 = '';
    this.errorEmail2 = '';
    this.errorWebsite = '';
    this.errorDescriptions = '';
    this.errorStatus = '';
    if (Object.keys(ss).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    if (Object.keys(ss).length && typeof ss.sup_bus_name == 'undefined') {
      this.errorSup_bus_name = 'Sup bus name is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.sup_ref_name == 'undefined') {
      this.errorSup_ref_name = 'Sup ref name is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.contact_person_name1 == 'undefined') {
      this.errorContact_person_name1 = 'Contact person name 1 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.address1 == 'undefined') {
      this.errorAddress1 = 'Address 1 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.country == 'undefined') {
      this.errorCountry = 'Country is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.contact_person_name2 == 'undefined') {
      this.errorContact_person_name2 = 'Contact person name 2 is Required';
      isValid = false;
    }
    if (Object.keys(ss).length && typeof ss.address2 == 'undefined') {
      this.errorAddress2 = 'Address 2 is Required';
      isValid = false;
    }
    if (Object.keys(ss).length && typeof ss.po_box_no == 'undefined') {
      this.errorPo_box_no = 'Po box no is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.telephone1 == 'undefined') {
      this.errorTelephone1 = 'Telephone 1 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.telephone2 == 'undefined') {
      this.errorTelephone2 = ' Telephone 2 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.telephone3 == 'undefined') {
      this.errorTelephone3 = 'Telephone 3 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.fax_no_1 == 'undefined') {
      this.errorFax_no_1 = 'fax no 1 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.fax_no_2 == 'undefined') {
      this.errorFax_no_2 = 'fax no 2 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.fax_no_3 == 'undefined') {
      this.errorFax_no_3 = 'Fax no 3 is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.email1 == 'undefined') {
      this.errorEmail1 = 'Email 1  is Required';
      isValid = false;
    }
    if (Object.keys(ss).length && typeof ss.email2 == 'undefined') {
      this.errorEmail2 = 'Email 2 is Required';
      isValid = false;
    }
    if (Object.keys(ss).length && typeof ss.website == 'undefined') {
      this.errorWebsite = 'Website is Required';
      isValid = false;
    }
    if (Object.keys(ss).length && typeof ss.descriptions == 'undefined') {
      this.errorDescriptions = 'Descriptions is Required';
      isValid = false;
    }

    if (Object.keys(ss).length && typeof ss.status == 'undefined') {
      this.errorStatus = 'Status is Required';
      isValid = false;
    }

    return isValid;
  }

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }

  closeandClearAdvanceSearch() {

    this.showAdvanceSearch = false;
    this.searchGenratedDBNo = '';
    this.searchDate = '';
    this.searchManualDBNo = '';
    this.searchMonitoring = '';
    this.searchControlNo = '';
    this.searchReferenceNo = '';
    this.searchRequestParty = '';
    this.searchRecipient = '';
    this.searchDistributor = '';
    this.searchWHOfficer = '';
    this.searchWHCommander = '';
    this.searchApplicant = '';
    this.searchForceCommanderApproval = '';
    this.searchFinancialNotes = '';
    this.searchOperationalRecommendations = '';
  }

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  searchSerialNo(SerialNo: any) {
    if ((this.FilteredStoreItems = []) && (this.SearchFilterDBDetails = [])) {
      let body = new URLSearchParams();
      body.append('action', 'getIssuedItems');
      this.http.post(environment.apikey + '/generateJsonUrl.php', body)
        .map(res => res.json())
        .subscribe((res: any) => {
          if (!!res) {
            for (var item in res) {
              res[item]["hideInnerEmpRow"] = false;
              this.StoreItems = res[item].store_item;
              for (var item1 in this.StoreItems) {
                if (this.StoreItems[item1].serial_no == SerialNo) {
                  this.FilteredStoreItems.push(this.StoreItems[item1]);
                }
              }
            }
            for (var item1 in res) {
              for (var item2 in this.FilteredStoreItems) {
                if (res[item1].material_demand_no == this.FilteredStoreItems[item2].material_demand_no) {
                  this.SearchFilterDBDetails.push(res[item1]);
                }
              }
            }
            this.DemandBookDetails = this.SearchFilterDBDetails;
          }
        }, error => {
          console.log(error.json());
        });
    }
    else {
      this.FilteredStoreItems = [];
      this.SearchFilterDBDetails = [];
    }
  }

  clearSerialNoSearch() {
    this.loadDemandData();
    this.serialNo = "";
    this.FilteredStoreItems = [];
    this.SearchFilterDBDetails = [];
  }

  AddSS(ss: any) {
    var isModelValid = this.isModelValid(ss);
    if (!isModelValid) {
      return;
    }

    let body = new URLSearchParams();
    body.append('action', 'addSupplier');
    body.append('data', JSON.stringify(ss));

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          //alert('Ex Order Created')
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  UpdateSS(ss: any) {

    var isModelValid = this.isModelValid(ss);
    if (!isModelValid) {
      return;
    }

    let body = new URLSearchParams();
    body.append('data', JSON.stringify(ss));
    body.append('action', 'updateSupplier');

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {

        if (data.code == 100) {
          //alert('Purchase Order Updated')
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }
  toggleHiddenEmpRow(demand: any) {
    demand.hideInnerEmpRow = !demand.hideInnerEmpRow;
  }

  Print(id: any) {
    window.print();
  }
  closeAndRedirect() {
    this.router.navigate(['/store-items']);
  }
}



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
  selector: 'app-pabx-trunk',
  templateUrl: './pabx-trunk.component.html',
  styleUrls: [('./pabx-trunk.component.css').toString()]
})
export class PabxTrunkComponent {

  environment: any = environment;
  showHideAllRows: boolean;
  showAdvanceSearch: boolean;
  selectedDeactivateEmployee: any;
  searchableList: any;
  isDesc: boolean = false;
  column: string = 'Name';
  subscription: Subscription;
  nodeSearch: any = '';
  systemSearch: any = '';
  phyAddressSearch: any = '';
  terminalSearch: any = '';
  rackAddressSearch: any = '';
  boardAddressSearch: any = '';
  setAddressSearch: any = '';
  //SMS Observables
  SmsId: string;
  SmsName: string;
  SmsRank: string;
  SmstelOffice: any;
  SmstelOffice1: any;
  SmstelOffice2: any;
  SmsPosition: string;
  SmsCompany: string;
  SmsDistributionUnit: string;
  SmsRegiment: string;
  SmstelMobile: any;
  SmstelMobile1: any;
  SmstelMobile2: any;
  lastUpdatedDate: any;
  txtToNumber: string;
  //checkbox ngmodel
  checkId: boolean = false;
  checkPosition: boolean = false;
  checkName: boolean = false;
  checkCompany: boolean = false;
  checkDisList: boolean = false;
  checkrank: boolean = false;
  checkForce_Unit: boolean = false;
  checkOfficePhone: boolean = false;
  checkMobile: boolean = false;
  checkOfficePhone1: boolean = false;
  checkOfficePhone2: boolean = false;
  checkOfficePhone3: boolean = false;


  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];
  SearchFrc_crp_unit_reg_dir: any = '';
  pager: any = {};// pager object

  // paged items
  pagedItems: any[];
  rankList: any[] = [];//= ["","Major","Major General","Brigadier", "Colonel","Lt Colonel","Captain","lieutenant"];
  forceList: any[] = [];
  unitList: any[] = [];
  corpsList: any[] = [];
  regimentList: any[] = [];
  directorateList: any[] = [];
  distributionListSearch: any = '';
  distributionUnitSearch: any = '';

  distributionList: any[] = [];
  distributionUnit: any[] = [];

  // Declare local variable
  direction: number;
  isLangArabic: boolean;
  currentLanguage: string;
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  // Change sort function to this:
  @ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private excelService: ExcelService, private formBuilder: FormBuilder, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];

    self.showHideAllRows = false;
    self.showAdvanceSearch = true;
    self.EmployeeDetails = [];
  };
  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.searchableList =
          ['Node', 'System', 'Physical_Address', 'Terminal_Type', 'Rack_Address', 'Board_Address', 'Set_Address']
        this.Permissions();
        this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
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

  setClickedRow = function (emp: any) {
    emp.highLightRow = !emp.highLightRow;
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: '',
      fieldValue: '',
    });
  }

  get items(): FormArray {
    return this.searchForm.get('items') as FormArray;
  };

  deleteAction(i: number) {
    this.items.removeAt(i);
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  public OnSubmit(formValue: any) {
    let body = new URLSearchParams();
    body.append('items', JSON.stringify(formValue));
    body.append('action', "trunk");

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

  resetSearchDropDownValues() {
    $('.searchRank').prop('selectedIndex', '0');
    $(".search-distributionList").prop('selectedIndex', '0');
    $(".search-distributionUnit").prop('selectedIndex', '0');
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
    this.searchKeyArray = [
      {
        "item": "Node",
        "label": "Node"
      },
      {
        "item": "Trunk_Groups",
        "label": "Trunk Groups"
      },
      {
        "item": "Trunk_Group_Type",
        "label": "Trunk Group Type"
      },
      {
        "item": "T2_Specification",
        "label": "T2 Specification"
      },
      {
        "item": "Trunk_COS",
        "label": "Trunk COS"
      },
      {
        "item": "B_Channel_Choice",
        "label": "B Channel Choice"
      },
      {
        "item": "Entity_Number",
        "label": "Entity Number"
      },
      {
        "item": "TS_Overflow",
        "label": "TS Overflow"
      },
      {
        "item": "Supervised_by_Routing",
        "label": "Supervised by Routing"
      },
      {
        "item": "VPN_TS_",
        "label": "VPN TS "
      },
      {
        "item": "Logical_Channel",
        "label": "Logical Channel"
      },
      {
        "item": "ARS_Class_of_service",
        "label": "ARS Class of service"
      },
      {
        "item": "IP_Compression_Type",
        "label": "IP Compression Type"
      },
      {
        "item": "Max_ABCF_IP_and_SIP_connections",
        "label": "Max ABCF IP and SIP connections"
      }
    ];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', "trunk");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          let keysT = Object.keys(res.data[0]);
          this.EmployeeDetails = res.data;
          this.getNodeArray();
          this.lastUpdatedDate = res.lastDate;
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




  getRank() {
    this.http.get(environment.apikey + "/generateJsonUrl.php?oper=getRanks&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            if (!this.isLangArabic) {
              this.rankList.push(data[item].Rank);
            } else {
              this.rankList.push(data[item].RankArabic);
            }
          }

        }
      });
  }

  getDistributionList() {
    this.http.get(environment.apikey + "/masterData.php?oper=getDistributionList&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            if (!this.isLangArabic) {
              this.distributionList.push(data[item].name);
            } else {
              this.distributionList.push(data[item].nameArabic);
            }
          }
        }
      });
  }

  //   onChange(id:any){
  //   this.getDistributionUnit(id);
  // }

  getDistributionUnit(id: any) {
    this.distributionUnit = [];
    this.http.get(environment.apikey + "/masterData.php?oper=getDistributionUnitList&language=" + this.currentLanguage + "&id=" + encodeURI(id))
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          data.sort((a: any,b: any) => a.unit_order - b.unit_order );
          for (var item in data) {
            if (!this.isLangArabic) {
              this.distributionUnit.push(data[item].name);
            } else {
              this.distributionUnit.push(data[item].nameArabic);
            }
          }

        }
      });
  }

  getForce() {
    this.http.get(environment.apikey + "/masterData.php?oper=getForces&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            if (!this.isLangArabic) {
              this.forceList.push(data[item].Forces);
            } else {
              this.forceList.push(data[item].ForcesArabic);
            }
          }
        }
      });
  }

  getUnit() {
    this.http.get(environment.apikey + "/masterData.php?oper=getUnits&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            if (!this.isLangArabic) {
              this.unitList.push(data[item].Unit);
            } else {
              this.unitList.push(data[item].UnitArabic);
            }
          }
        }
      });
  }

  getCorps() {
    this.http.get(environment.apikey + "/masterData.php?oper=getCorps&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            if (!this.isLangArabic) {
              this.corpsList.push(data[item].Corps);
            } else {
              this.corpsList.push(data[item].CorpsArabic);
            }
          }

        }
      });
  }

  getRegiment() {
    this.http.get(environment.apikey + "/masterData.php?oper=getRegiments&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            if (!this.isLangArabic) {
              this.regimentList.push(data[item].Regiment);
            } else {
              this.regimentList.push(data[item].RegimentArabic);
            }
          }
        }
      });
  }

  getDirectorate() {
    this.http.get(environment.apikey + "/masterData.php?oper=getDirectorates&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            if (!this.isLangArabic) {
              this.directorateList.push(data[item].Directorate);
            } else {
              this.directorateList.push(data[item].DirectorateArabic);
            }
          }
        }
      });
  }
  showUnitSearchDropDown: boolean = false;
  showCorpsSearchDropDown: boolean = false;
  showRegimentSearchDropDown: boolean = false;
  showDirectorateSearchDropDown: boolean = false;

  forceSearch: any = '';
  unitsearch: any = '';
  corpsSearch: any = '';
  directorateSearch: any = '';

  toggleHiddenEmpRow(emp: any) {
    emp.hideInnerEmpRow = !emp.hideInnerEmpRow;

  }

  showAllHiddenEmpRow() {
    this.showHideAllRows = true
    for (var item in this.EmployeeDetails) {
      this.EmployeeDetails[item].hideInnerEmpRow = true;
    }
  };

  hideAllHiddenRows() {
    this.showHideAllRows = false
    for (var item in this.EmployeeDetails) {
      this.EmployeeDetails[item].hideInnerEmpRow = false;
    }
  };

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  toggleAdvanceSearch() {
    this.showAdvanceSearch = !this.showAdvanceSearch;
  }

  closeandClearAdvanceSearch() {

    this.showAdvanceSearch = false;
    this.nodeSearch = null;
    this.systemSearch = null;
    this.phyAddressSearch = null;
    this.terminalSearch = null;
    this.rackAddressSearch = null;
    this.boardAddressSearch = null;
    this.setAddressSearch = null;

  }

  exportToExcel(event: any) {
    let dataArray = this.EmployeeDetails;
    for (var item in dataArray) { // removing unnecessary column before export.
      delete dataArray[item].id;
      delete dataArray[item].status;
    }
    this.excelService.download(dataArray, 'export_pabx_trunk');
  }


  showUploaPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }
  fileList: any;
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

  import() {
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('module', "trunk");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      //headers.append('Content-Type', 'json');
      //headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/pabx_csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        $('.app-loader').hide();
        this.hidePopUp('modalImport');
        alert("Import done successfully.");

      },
        error => { console.log(error) }
      );
    }
  }
  fileReset() {
    this.fileImportInput.nativeElement.value = "";
  }

  showDeactivateEmployeePopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateEmployee = emp;
  }

  deactivateEmp() {
    //this.EmployeeDetails = this.EmployeeDetails.filter(obj => obj !== this.selectedDeactivateEmployee);
    this.http.get(environment.apikey + "/generateJsonUrl.php?id=" + this.selectedDeactivateEmployee.id + "&oper=delete")
      .map(res => res)
      .subscribe(data => {
        data = data;
        this.loadData();
      });
    this.hidePopUp('modalDeactivate');
  }

  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }

  showSMSPopup(employee: any) {
    this.resetSmsValue();
    this.SmsId = employee.MilitaryId;
    this.SmsName = employee.name;
    this.SmsRank = employee.Rank;
    this.SmstelOffice = employee.OfficeTelephone1;
    this.SmstelOffice1 = employee.OfficeTelephone2;
    this.SmstelOffice2 = employee.OfficeTelephone3;
    this.SmsPosition = employee.Position;
    this.SmsDistributionUnit = employee.distributionUnit;
    //this.SmsCompany=employee.Company;
    //this.SmsRegiment=employee.Force_Corps_Units_Regi_Dire;
    this.SmstelMobile = employee.Mobile;
    //this.SmstelMobile1=employee.telephoneMobile;
    //this.SmstelMobile2=employee.telephoneMobile;
    $('#modalSendSMS').modal('show');
  }

  filterData(val: any) {
    if (val == 'id') {
      this.checkId = !this.checkId;
    }
    if (val == 'pos') {
      this.checkPosition = !this.checkPosition;
    }
    if (val = 'disList') {
      this.checkDisList = !this.checkDisList;
    }
    // if (val == 'com'){
    //   this.checkCompany = !this.checkCompany;
    // }
    if (val == 'rank') {
      this.checkrank = !this.checkrank;
    }
    if (val == 'name') {
      this.checkName = !this.checkName;
    }
    // if(val == 'frc'){
    //   this.checkForce_Unit = !this.checkForce_Unit;
    // }

    // if(val == 'offPhone'){
    //   this.checkOfficePhone = !this.checkOfficePhone;
    //   this.checkOfficePhone1 = !this.checkOfficePhone1;
    //   this.checkOfficePhone2= !this.checkOfficePhone2;
    //   this.checkOfficePhone3 = !this.checkOfficePhone3;
    // }
    if (val == 'offPhone1') {
      this.checkOfficePhone1 = !this.checkOfficePhone1;
    }
    if (val == 'offPhone2') {
      this.checkOfficePhone2 = !this.checkOfficePhone2;
    }
    if (val == 'offPhone3') {
      this.checkOfficePhone3 = !this.checkOfficePhone3;
    }
    if (val == 'mob') {
      this.checkMobile = !this.checkMobile;
    }

  }

  sendSMS() {

    if (this.txtToNumber.trim().length > 0) {
      var receipents = this.txtToNumber.trim();
    } else {
      alert(this._translate.currentLang == 'en' ? "enter recipent no." : "أدخل المستلم لا.");
      return false;
    }
    var message = '';
    if (this.checkId == true) {

      message += (!this.isLangArabic ? "MilitaryId:" : ':هوية شخصية') + this.SmsId.trim() + "\n";
      //"هوية شخصية"+ this.SmsId.trim() +"\n";
    }
    if (this.checkName == true) {
      message += (!this.isLangArabic ? "Name:" : ':اسم') + this.SmsName.trim() + "\n";
      //this.SmsName.trim() +":اسم \n";

    }
    if (this.checkPosition == true) {
      message += (!this.isLangArabic ? "Position:" : ':موضع') + this.SmsPosition.trim() + "\n";
      //this.SmsPosition.trim() +":موضع\n";
    }
    if (this.checkCompany == true) {
      message += (!this.isLangArabic ? "Distribution List:" : ':قائمة التوزيع') + this.SmsDistributionUnit.trim() + "\n";
      //this.SmsCompany.trim() +":شركة\n";
    }
    // if(this.checkCompany == true){
    //   message += (!this.isLangArabic ? "Company:":':شركة')+ this.SmsCompany.trim()+ "\n" ;
    //             //this.SmsCompany.trim() +":شركة\n";
    // }
    if (this.checkrank == true) {
      message += (!this.isLangArabic ? "Rank:" : ':مرتبة') + this.SmsRank.trim() + "\n";
      //this.SmsRank.trim() +":مرتبة\n";
    }
    // if(this.checkForce_Unit == true){
    //   message +=(!this.isLangArabic ? "Force_Regiment_Directorate:":':القوة/سلاح/وحدات/فوج/مديرية')+ this.SmsRegiment.trim()+ "\n" ;
    //             //this.SmsRegiment.trim() +":القوة/سلاح/وحدات/فوج/مديرية\n";
    // }

    // if(this.checkOfficePhone == true){
    //   message += "Office No:"+ this.SmstelOffice +","+this.SmstelOffice1 +","+this.SmstelOffice2+"\n";
    // }
    //if(this.checkOfficePhone == false){
    if (this.checkOfficePhone1 == true) {
      message += (!this.isLangArabic ? "Office No1:" : ':الهاتف-مكتب 1') + this.SmstelOffice.trim() + "\n";
      //this.SmstelOffice.trim() +":الهاتف-مكتب 1\n";
    }
    if (this.checkOfficePhone2 == true) {
      message += (!this.isLangArabic ? "Office No2:" : ':الهاتف-مكتب 2') + this.SmstelOffice1.trim() + "\n";
      //this.SmstelOffice1.trim() +":الهاتف-مكتب 2\n";
    }
    if (this.checkOfficePhone3 == true) {
      message += (!this.isLangArabic ? "Office No3:" : ':الهاتف-مكتب 3') + this.SmstelOffice2.trim() + "\n";
      this.SmstelOffice2.trim() + ":الهاتف-مكتب 3\n";
    }
    /// }
    if (this.checkMobile == true) {
      message += (!this.isLangArabic ? "Mobile:" : ':الهاتف المحمول') + this.SmstelMobile.trim() + "\n";
      //this.SmstelMobile.trim() +":الهاتف المحمول\n";
    }

    let body = new URLSearchParams();
    body.append('recipient', receipents);
    body.append('message', message);
    body.append('action', 'sendSms')
    this.http.post(environment.apikey + '/generateJsonUrl.php?language=' + this._translate.currentLang, body)
      .subscribe((data: any) => {
        var obj = JSON.stringify(data["_body"]).trim();
        this.hidePopUp('modalSendSMS');
      }, error => {
        console.log(error.json());
      });
  }
  resetSmsValue() {
    this.txtToNumber = "";
    this.checkId = false;
    this.checkPosition = false;
    this.checkName = false;
    this.checkCompany = false;
    this.checkrank = false;
    this.checkForce_Unit = false;
    this.checkOfficePhone = false;
    this.checkMobile = false;
    this.checkOfficePhone1 = false;
    this.checkOfficePhone2 = false;
    this.checkOfficePhone3 = false;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }


};


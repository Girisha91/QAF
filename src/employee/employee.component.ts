import { Pipe } from '@angular/core';
import { Component, ViewChild, ViewChildren } from '@angular/core';
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
import { ExcelService } from '../app/shared/excel.service';
import { EmployeeSearchPipe } from '../app/employee.pipe';
import { FilterPipe } from '../app/genericSearch.pipe';
Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-employee',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent {
  @ViewChildren('someVar') filteredItems: any;
  environment: any = environment;
  showHideAllRows: boolean;
  showAdvanceSearch: boolean;
  selectedDeactivateEmployee: any;
  searchableList: any;
  isDesc: boolean = false;
  column: string = 'MilitaryId';
  subscription: Subscription;
  idSearch: any = '';
  nameSearch: any = '';
  rankSearch: any = '';
  regimentSearch: any = '';
  positionSearch: any = '';
  companySearch: any = '';
  queryString: any = '';
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
  SmsDisUnit: string;
  SmsRegiment: string;
  SmstelMobile: any;
  SmsResTelPhone: any;
  SmsDirectLine: any;
  SmsFaxLine: any;
  SmstelMobile1: any;
  SmstelMobile2: any;
  txtToNumber: string;
  //checkbox ngmodel
  checkId: boolean = false;
  checkPosition: boolean = false;
  checkName: boolean = false;
  checkCompany: boolean = false;
  checkDisUnit: boolean = false;
  checkRank: boolean = false;
  checkForce_Unit: boolean = false;
  checkOfficePhone: boolean = false;
  checkMobile: boolean = false;
  checkOfficePhone1: boolean = false;
  checkOfficePhone2: boolean = false;
  checkOfficePhone3: boolean = false;
  checkResidentTelePhone: boolean = false;
  checkDirectLine: boolean = false;
  checkFaxLine: boolean = false;


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
  rankData: any[] = [];
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

  constructor(private excelService: ExcelService, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];

    self.showHideAllRows = false;
    self.showAdvanceSearch = true;
    self.EmployeeDetails = [{
      id: "",
      MilitaryId: 0,
      FirstName: "",
      Name: "",
      Rank: "",
      Force_Corps_Units_Regi_Dire: "",
      Position: "",
      Company: "",
      OfficeTelephone1: "",
      Mobile: "",
      hideInnerEmpRow: false,
      UserName: "",
      MiddleName: "",
      LastName: "",
      FamilyName: "",
      Organization: "",
      ReportingManager: "",
      OfficeTelephone2: "",
      OfficeTelephone3: "",
      DirectLine: "",
      FaxLine: "",
      HotLine: "",
      OtherSpecialLine: "",
      PrivateTelephone: "",
      Instruction: "",
      distributionList: "",
      distributionUnit: "",
      RankIds: 0
    }];
  };

  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.searchableList =
          ['MilitaryId', 'Name', 'Rank', 'Force_Corps_Units_Regi_Dire', 'Position', 'Company', 'FamilyName', 'OfficeTelephone1', 'Mobile', 'UserName', 'Organization', 'ReportingManager', 'OfficeTelephone2', 'OfficeTelephone3', 'DirectLine',
            'FaxLine', 'HotLine', 'OtherSpecialLine', 'PrivateTelephone', 'Instruction', 'distributionList', 'distributionUnit']
        this.Permissions();
        this.getRanks();
        this.getDistributionList();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  resetSearchDropDownValues() {
    $('.searchRank').prop('selectedIndex', '0');
    $(".search-distributionList").prop('selectedIndex', '0');
    $(".search-distributionUnit").prop('selectedIndex', '0');
  }

  setClickedRow = function (emp: any) {
    emp.highLightRow = !emp.highLightRow;
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

  loadData() {
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));
    this.http.get(environment.apikey + "/generateJsonUrl.php?oper=getJson&sessionId=" + userSession.sessionId + "&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            data[item].name = data[item].name.replace(/ـــ/g,'');            
            data[item]["MilitaryId"] = data[item].MilitaryId;
            data[item]["RankIds"] = data[item].RankIds;
            data[item]["Name"] = data[item].name;
            data[item]["Force_Corps_Units_Regi_Dire"] = data[item].Forces + '/' + data[item].Corps + '/' + data[item].Unit + '/' + data[item].Regiment + '/' + data[item].Directorate;
            data[item]["hideInnerEmpRow"] = false;
          }
          this.EmployeeDetails = data;
          this.sort("RankIds");
        }
        this.HideFieldValues();
      });
    if (this.currentLanguage == 'en') {
      this.isLangArabic = false;
    } else {
      this.isLangArabic = true;
    }
  }

  HideFieldValues() {
    var data = this.EmployeeDetails;
    for (var item in data) {
    }
  }


  getRanks() {
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

  onChange(id: any) {
    this.getDistributionUnit(id);
  }
  onRankChange(id: any) {
    this.getRankdData(id);
  }

  getRankdData(id: any) {
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));
    this.http.get(environment.apikey + "/generateJsonUrl.php?oper=getJson&sessionId=" + userSession.sessionId + "&language=" + this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          if (id == '') {
            filtered = data;
          } else {
            var filtered = [];
            for (var item in data) {
              if (data[item].Rank == id) {
                filtered.push(data[item]);
              }
            }
          }
          var dataMod = filtered;
          for (var item in dataMod) {
            dataMod[item]["Name"] = dataMod[item].name;
            dataMod[item]["Force_Corps_Units_Regi_Dire"] = dataMod[item].Forces + '/' + dataMod[item].Corps + '/' + dataMod[item].Unit + '/' + dataMod[item].Regiment + '/' + dataMod[item].Directorate;
            dataMod[item]["hideInnerEmpRow"] = false;
          }
          this.EmployeeDetails = dataMod;
        }
        this.HideFieldValues();
      });
  }

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
    this.idSearch = null;
    this.nameSearch = null;
    this.rankSearch = '';
    this.SearchFrc_crp_unit_reg_dir = null;
    this.positionSearch = null;
    this.companySearch = null;

    this.forceSearch = '';
    this.corpsSearch = '';
    this.unitsearch = '';
    this.regimentSearch = '';
    this.directorateSearch = '';
    this.distributionListSearch = '';
    this.distributionUnitSearch = '';
    this.resetSearchDropDownValues();
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
      formData.append('module', "employeeinfo");
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        this.hidePopUp('modalImport');
        $('.app-loader').hide();
        // alert(this._translate.currentLang == 'en' ? "upload complete" : "اكتمل التحميل");
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

  exportToExcel(event: any) {
    let dataArray = this.EmployeeDetails;
    for (var item in dataArray) { // removing unnecessary column before export.
      delete dataArray[item].id;
      delete dataArray[item].hideInnerEmpRow;
    }
    dataArray = EmployeeSearchPipe.prototype.transform(dataArray, this.idSearch, this.nameSearch, this.rankSearch, this.distributionListSearch, this.distributionUnitSearch, this.positionSearch, this.companySearch);
    dataArray = FilterPipe.prototype.transform(dataArray, this.queryString, this.searchableList);
    this.excelService.download(dataArray, 'export_Employees');
  }

  showSMSPopup(employee: any) {
    this.resetSmsValue();
    this.SmsId = employee.MilitaryId;
    this.SmsName = employee.name;
    this.SmsRank = employee.Rank + "" + employee.subRank;
    this.SmstelOffice = employee.OfficeTelephone1;
    this.SmstelOffice1 = employee.OfficeTelephone2;
    this.SmstelOffice2 = employee.OfficeTelephone3;
    this.SmsPosition = employee.Position;
    this.SmsDisUnit = employee.distributionUnit;
    this.SmstelMobile = employee.Mobile;
    this.SmsResTelPhone = employee.ResidenceTelephone;
    this.SmsDirectLine = employee.DirectLine;
    this.SmsFaxLine = employee.FaxLine;
    $('#modalSendSMS').modal('show');
  }

  checkAllCheckbox() {
    if ($("#checkAllIds").prop("checked") && this.SmsId != '') {
     // console.log("executedID true");
      this.checkId = true;
    } else {
      this.checkId = false;
     // console.log("executedID false");
    }

    if ($("#checkAllIds").prop("checked") && this.SmsRank != '') {
    //  console.log("executedRank");
      this.checkRank = true;
    } else {
      this.checkRank = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsName != '') {
    //  console.log("executedName");
      this.checkName = true;
    } else {
      this.checkName = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsPosition != '') {
     // console.log("executedcheckPosition");
      this.checkPosition = true;
    } else {
      this.checkPosition = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsDisUnit != '') {
     // console.log("executedcheckDisUnit");
      this.checkDisUnit = true;
    } else {
      this.checkDisUnit = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmstelOffice != '') {
     // console.log("executedchecktelOffice");
      this.checkOfficePhone1 = true;
    } else {
      this.checkOfficePhone1 = false;
    }
    if ($("#checkAllIds").prop("checked") && this.SmstelOffice1 != '') {
    //  console.log("executedchecktelOffice1");
      this.checkOfficePhone2 = true;
    } else {
      this.checkOfficePhone2 = false;
    }
    if ($("#checkAllIds").prop("checked") && this.SmstelOffice2 != '') {
     // console.log("executedchecktelOffice2");
      this.checkOfficePhone3 = true;
    } else {
      this.checkOfficePhone3 = false;
    }
    if ($("#checkAllIds").prop("checked") && this.SmstelMobile != '') {
     // console.log("executedchecktelMobile");
      this.checkMobile = true;
    } else {
      this.checkMobile = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsResTelPhone != '') {
     // console.log("executedcheckResTelPhone");
      this.checkResidentTelePhone = true;
    } else {
      this.checkResidentTelePhone = false;
    }
    if ($("#checkAllIds").prop("checked") && this.SmsDirectLine != '') {
    //  console.log("executedcheckDirectLine");
      this.checkDirectLine = true;
    } else {
      this.checkDirectLine = false;
    }
    if ($("#checkAllIds").prop("checked") && this.SmsFaxLine != '') {
    //  console.log("executedcheckFaxLine");
      this.checkFaxLine = true;
    } else {
      this.checkFaxLine = false;
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
      message += (!this.isLangArabic ? "Military Id:" : 'الرقم العسكري:') + this.SmsId + "\n";//trim() removed because MilitaryId is a integer
      //"هوية شخصية"+ this.SmsId.trim() +"\n";
    }
    if (this.checkRank == true) {
      message += (!this.isLangArabic ? "Rank:" : 'الرتبة:') + this.SmsRank.trim() + "\n";
      //this.SmsRank.trim() +":مرتبة\n";
    }
    if (this.checkName == true) {
      message += (!this.isLangArabic ? "Name:" : 'الأسم:') + this.SmsName.trim() + "\n";
      //this.SmsName.trim() +":اسم \n";

    }
    if (this.checkPosition == true) {
      message += (!this.isLangArabic ? "Position:" : 'المنصب:') + this.SmsPosition.trim() + "\n";
      //this.SmsPosition.trim() +":موضع\n";
    }
    if (this.checkDisUnit == true) {
      message += (!this.isLangArabic ? "DistributionUnit:" : 'الوحدة:') + this.SmsDisUnit.trim() + "\n";
      //this.SmsCompany.trim() +":شركة\n";
    }
    // if(this.checkCompany == true){
    //   message += (!this.isLangArabic ? "Company:":':شركة')+ this.SmsCompany.trim()+ "\n" ;
    //             //this.SmsCompany.trim() +":شركة\n";
    // }

    // if(this.checkForce_Unit == true){
    //   message +=(!this.isLangArabic ? "Force_Regiment_Directorate:":':القوة/سلاح/وحدات/فوج/مديرية')+ this.SmsRegiment.trim()+ "\n" ;
    //             //this.SmsRegiment.trim() +":القوة/سلاح/وحدات/فوج/مديرية\n";
    // }

    // if(this.checkOfficePhone == true){
    //   message += "Office No:"+ this.SmstelOffice +","+this.SmstelOffice1 +","+this.SmstelOffice2+"\n";
    // }
    //if(this.checkOfficePhone == false){
    if (this.checkOfficePhone1 == true) {
      //message += //(!this.isLangArabic ? "offPhone1:":'رقم المكتب 1:')+ this.SmstelOffice.trim()+ "\n" ;
      if (!this.isLangArabic) {
        message += "offPhone1:" + this.SmstelOffice.trim() + "\n";
      } else {
        let sms = this.SmstelOffice.trim();
       // console.log(sms);
        if (sms == "") {
          message += " : 1 رقم المكتب" + "\n";
       //   console.log(message);
        } else {
       //   console.log(sms);
          // message += this.SmstelOffice.trim() + " : 1 مكتب هاتف ";
          message += "رقم المكتب" + this.SmstelOffice.trim() + ":1" + "\n";
        }
        // message += "الهاتف-مكت"+this.SmstelOffice.trim()+":1"+"\n" ;
        //message +=  this.SmstelOffice.trim()+":الهاتف-مكت" +"1"+"\n" ; 
      }
    }
    if (this.checkOfficePhone2 == true) {
      // message += (!this.isLangArabic ? "offPhone2:" : 'رقم المكتب 2:') + this.SmstelOffice1.trim() + "\n";
      if (!this.isLangArabic) {
        message += "offPhone2:" + this.SmstelOffice1.trim() + "\n";
      } else {
        let sms1 = this.SmstelOffice1.trim();
     //   console.log(sms1);
        if (sms1 == "") {
          //  message += " : 2 مكتب هاتف "+"\n";
          message += " : 2 رقم المكتب " + "\n";;
       //   console.log(message);
        } else {
         // console.log(sms1);
          // message += this.SmstelOffice1.trim() + " : 2 مكتب هاتف ";
          message += "رقم المكتب " + this.SmstelOffice1.trim() + ":2" + "\n";
        }
        // message += "الهاتف-مكت"+this.SmstelOffice.trim()+":2"+"\n" ;
        // message +=  ":الهاتف-مكت2" +this.SmstelOffice.trim()+"\n" ;//:الهاتف-مكت216640
        //message +=  ":الهاتف-مكت" +this.SmstelOffice.trim()+"2"+"\n" ; //:الهاتف-مكت4452
        // message +=  ":الهاتف-مكت"+"2" +this.SmstelOffice.trim()+"\n" ;  //:الهاتف-مكت24656455
      }
      //
    }
    if (this.checkOfficePhone3 == true) {
      //message += (!this.isLangArabic ? "offPhone3:" : 'رقم المكتب 3:') + this.SmstelOffice2.trim() + "\n";
      // 
      if (!this.isLangArabic) {
        message += "offPhone3:" + this.SmstelOffice2.trim() + "\n";
      } else {
        let sms2 = this.SmstelOffice2.trim();
    //    console.log(sms2);
        if (sms2 == "") {

          message += " : 3 رقم المكتب " + "\n";
      //    console.log(message);
        } else {
    //      console.log(sms2);
          // message += this.SmstelOffice2.trim() + " : 3 مكتب هاتف ";
          message += "رقم المكتب" + this.SmstelOffice2.trim() + ":3" + "\n";
        }
        // message += "الهاتف-مكت"+this.SmstelOffice.trim()+":3"+"\n" ;
        //message +=  this.SmstelOffice.trim()+":الهاتف-مكت" +"3"+"\n" ;
      }
    }
    /// }
    if (this.checkMobile == true) {
      message += (!this.isLangArabic ? "Mobile:" : 'رقم الجوال:') + this.SmstelMobile.trim() + "\n";
      //this.SmstelMobile.trim() +":الهاتف المحمول\n";
    }

    if (this.checkResidentTelePhone == true) {
      message += (!this.isLangArabic ? "ResidenceTeleNo:" : 'هاتف المنزل:') + this.SmsResTelPhone.trim() + "\n";
      //this.SmsResTelPhone.trim() +":الهاتف المحمول\n";
    }

    if (this.checkDirectLine == true) {
      message += (!this.isLangArabic ? "Direct line:" : 'خط مباشر:') + this.SmsDirectLine.trim() + "\n";
      //this.SmsDirectLine.trim() +":الهاتف المحمول\n";
    }
    //     console.log(this.SmsFaxLine)
    // if(this.SmsFaxLine==''){
    //   console.log(this.SmsFaxLine);
    // this.checkFaxLine == false;
    // }else{
    //   console.log(this.SmsFaxLine);
    //   message += (!this.isLangArabic ? "Fax Line:" : 'خط فاكس:') + this.SmsFaxLine.trim() + "\n";
    // }
    if (this.checkFaxLine == true) {
      message += (!this.isLangArabic ? "Fax Line:" : 'خط فاكس:') + this.SmsFaxLine.trim() + "\n";
      //this.SmsFaxLine.trim() +":الهاتف المحمول\n";
    }

    let body = new URLSearchParams();
    body.append('recipient', receipents);
    body.append('message', message);
    body.append('action', 'sendSms');
    body.append('recipientContact', '0');
    this.http.post(environment.apikey + '/generateJsonUrl.php?language=' + this._translate.currentLang, body)
      .subscribe((data: any) => {
        console.log("value of send sms is",data);
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
    this.checkDisUnit = false;
    this.checkRank = false;
    this.checkForce_Unit = false;
    this.checkOfficePhone = false;
    this.checkMobile = false;
    this.checkOfficePhone1 = false;
    this.checkOfficePhone2 = false;
    this.checkOfficePhone3 = false;
    this.checkResidentTelePhone = false;
    this.checkDirectLine = false;
    this.checkFaxLine = false;
    $("#checkAllIds").prop("checked",false);
  }


  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }


};



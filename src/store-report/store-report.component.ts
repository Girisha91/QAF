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
import { ExcelServiceWorkBook } from '../app/shared/excelworksheet.service';
import { DatePipe } from '@angular/common'
Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'storeReport',
  templateUrl: './store-report.component.html',
  styleUrls: [('./store-report.component.css').toString()]
})
export class storeReportComponent {

  environment: any = environment;
  showHideAllRows: boolean;
  showAdvanceSearch: boolean;
  selectedDeactivateEmployee: any;
  searchableList: any;
  dataResult: any;
  highLightRow: boolean = false;
  showMaterialList: boolean = true;
  showItemList: boolean = false;
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
  txtToNumber: string;
  valueCheckedMaterial: any[] = [];
  valueCheckedItem: any[] = [];
  materialControlList: any[] = [];
  toggleAvil: boolean = true;
  toggleReorder: boolean = true;
  toggleOutofStck: boolean = true;
  toggleIssued: boolean = true;
  toggleFaulty: boolean = true;
  toggleRepair: boolean = true;
  toggleLoan: boolean = true;
  //SMS Observables
  SmsNode: string;
  SmsName: string;
  SmsIpAddress: any;
  SmsIpNetmask: any;
  materialList: any[];
  //checkbox ngmodel
  checkNode: boolean = false;
  checkName: boolean = false;
  checkIpAddress: boolean = false;
  checkIpNetmask: boolean = false;
  lastUpdatedDate: any;
  department: any;
  material: any;
  filterArray: any[];
  StoreStockType: string ="Materials";
  dropDisplay: string = "View By Material"
  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  StoreMaterialDetails: any[];
  ClearedStoreMaterialDetails: any[];
  storeMaterials: any[];
  SearchFilterStoreMaterialDetails: any[];
  StoreItemDetails: any[];
  ClearedStoreItemDetails: any[];
  storeItems: any[];
  SearchFilterStoreItemsDetails: any[];
  filteredSearchArray: any[];
  filteredSearchArrayItems: any[];
  finalArray: any[];
  finalArrayItems: any[];
  itemsExportDetails :any[];
  materialExportDetails :any[];
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
  DepartmentList: any[];
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

  constructor(private excelService: ExcelService, private excelServiceWorkBook: ExcelServiceWorkBook, public datepipe: DatePipe, private formBuilder: FormBuilder, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];

    self.showHideAllRows = false;
    self.showAdvanceSearch = true;
    self.StoreMaterialDetails = [];
  };
  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.userRoleId = this._localStorageService.get('userRoleId');
      }
    } else {
      this.router.navigate(['/login']);
    }
    this.getDepartmentList();
    this.getMaterailList();
    this.loadData();
    this.loadData1();
    this.applyNgSelectStyles();
  }
  exportToExcelMaterial(event: any) {
  //  console.log(event);
    this.finalArray = event;
    this.filteredSearchArray = [];
    let cntAvail = 0;
    let cntReorder = 0;
    let cntOutofstck = 0;
    let cntIssue = 0;
    let cntFaulty = 0;
    let cntRepair = 0;
    let cntLoan = 0;
    if (this.valueCheckedMaterial.length != 0) {
      for (var i in this.valueCheckedMaterial) {
        switch (this.valueCheckedMaterial[i].status) {
          case "Available":
            cntAvail = cntAvail + 1;
            break;
          case "ReOrder":
            cntReorder = cntReorder + 1;
            break;
          case "OutofStock":
            cntOutofstck = cntOutofstck + 1;
            break;
          case "Issued":
            cntIssue = cntIssue + 1;
            break;
          case "Faulty":
            cntFaulty = cntFaulty + 1;
            break;
          case "Repair":
            cntRepair = cntRepair + 1;
            break;
          case "Loan":
            cntLoan = cntLoan + 1;
            break;
        }
      }
      for (let itemname in this.finalArray) {
        delete this.finalArray[itemname].id;
        delete this.finalArray[itemname].highLightRow;
        delete this.finalArray[itemname].material_id;
        delete this.finalArray[itemname].item_image;
        if (cntAvail == 0) {
          delete this.finalArray[itemname].Available;
          this.toggleAvil = false;
        }
        if (cntReorder == 0) {
          delete this.finalArray[itemname].ReOrder;
          this.toggleReorder = false;
        }
        if (cntOutofstck == 0) {
          delete this.finalArray[itemname].OutofStock;
          this.toggleOutofStck = false;
        }
        if (cntIssue == 0) {
          delete this.finalArray[itemname].Issued;
          this.toggleIssued = false;
        }
        if (cntFaulty == 0) {
          delete this.finalArray[itemname].Faulty;
          this.toggleFaulty = false;
        }
        if (cntRepair == 0) {
          delete this.finalArray[itemname].Repair;
          this.toggleRepair = false;
        }
        if (cntLoan == 0) {
          delete this.finalArray[itemname].Loan;
          this.toggleLoan = false;
        }
        this.filteredSearchArray.push(this.finalArray[itemname]);
      }
    } else {
      for (let itemname in this.finalArray) {
        delete this.finalArray[itemname].id;
        delete this.finalArray[itemname].highLightRow;
        delete this.finalArray[itemname].material_id;
        delete this.finalArray[itemname].item_image;
        this.filteredSearchArray.push(this.finalArray[itemname]);
      }
    }
//   console.log(this.filteredSearchArray);
 this.materialExportDetails = this.filteredSearchArray;
 this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"item_name":').join('"Item Name":'));
 this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"item_no":').join('"Item No":'));
//  this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"OutofStock":').join('"Out Of Stock:'));
//  this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"ReOrder":').join('"Re Order":'));
 this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"department":').join('"Department":'));
 this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"category":').join('"Category":'));
 this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"description":').join('"Description":'));
 this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"manufacture":').join('"Manufacture":'));
 this.materialExportDetails = JSON.parse(JSON.stringify(this.materialExportDetails).split('"part_no":').join('"Part No":'));
 this.excelServiceWorkBook.exportAsExcelFile(this.materialExportDetails, 'store_material_details');
}

  exportToExcelItems(event: any) {
    // console.log(event);
    this.finalArrayItems = event;
    this.filteredSearchArrayItems = [];
    let cntAvail = 0;
    let cntIssue = 0;
    let cntFaulty = 0;
    let cntRepair = 0;
    let cntLoan = 0;
    if (this.valueCheckedItem.length != 0) {
      for (var i in this.valueCheckedItem) {
        switch (this.valueCheckedItem[i].status) {
          case "Available":
            cntAvail = cntAvail + 1;
            break;
          case "Issued":
            cntIssue = cntIssue + 1;
            break;
          case "Faulty":
            cntFaulty = cntFaulty + 1;
            break;
          case "Repair":
            cntRepair = cntRepair + 1;
            break;
          case "Loan":
            cntLoan = cntLoan + 1;
            break;
        }
      }
      for (let itemname in this.finalArrayItems) {
        if ((cntAvail == 1) && (this.finalArrayItems[itemname].status == '1')) {
          delete this.finalArrayItems[itemname].id;
          delete this.finalArrayItems[itemname].material_id;
          delete this.finalArrayItems[itemname].highLightRow;
          this.filteredSearchArrayItems.push(this.finalArrayItems[itemname]);
        }
        if ((cntIssue == 1) && (this.finalArrayItems[itemname].status == '5')) {
          delete this.finalArrayItems[itemname].id;
          delete this.finalArrayItems[itemname].material_id;
          delete this.finalArrayItems[itemname].highLightRow;
          this.filteredSearchArrayItems.push(this.finalArrayItems[itemname]);
        }
        if ((cntFaulty == 1) && (this.finalArrayItems[itemname].status == '3')) {
          delete this.finalArrayItems[itemname].id;
          delete this.finalArrayItems[itemname].material_id;
          delete this.finalArrayItems[itemname].highLightRow;
          this.filteredSearchArrayItems.push(this.finalArrayItems[itemname]);
        }
        if ((cntRepair == 1) && (this.finalArrayItems[itemname].status == '4')) {
          delete this.finalArrayItems[itemname].id;
          delete this.finalArrayItems[itemname].material_id;
          delete this.finalArrayItems[itemname].highLightRow;
          this.filteredSearchArrayItems.push(this.finalArrayItems[itemname]);
        }
        if ((cntLoan == 1) && (this.finalArrayItems[itemname].status == '6')) {
          delete this.finalArrayItems[itemname].id;
          delete this.finalArrayItems[itemname].material_id;
          delete this.finalArrayItems[itemname].highLightRow;
          this.filteredSearchArrayItems.push(this.finalArrayItems[itemname]);
        }
      }
      this.StoreItemDetails = this.filteredSearchArrayItems;
    } else {
      for (let itemname in this.finalArrayItems) {
        delete this.finalArrayItems[itemname].id;
        delete this.finalArrayItems[itemname].material_id;
        delete this.finalArrayItems[itemname].highLightRow;
        this.filteredSearchArrayItems.push(this.finalArrayItems[itemname]);
      }
    }
    this.StoreItemDetails = this.filteredSearchArrayItems;
    this.itemsExportDetails = this.filteredSearchArrayItems;
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"item_name":').join('"Item Name":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"item_no":').join('"Item No":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"serial_no":').join('"Serial No":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"purchase_order_no":').join('"Purchase Order No":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"department":').join('"Department":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"location":').join('"Location":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"warranty":').join('"Warranty":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"site_name":').join('"Site Name":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"loan_duration":').join('"Loan Duration":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"issued_by":').join('"Issued By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"approved_by":').join('"Approved By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"received_by":').join('"Received By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"reported_by":').join('"Reported By":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"date_in":').join('"Date In":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"status":').join('"Status":'));
    this.itemsExportDetails = JSON.parse(JSON.stringify(this.itemsExportDetails).split('"remarks":').join('"Remarks":'));
    this.excelServiceWorkBook.exportAsExcelFile(this.itemsExportDetails, 'store_item_details');
  }

  applyNgSelectStyles() {
    $(".ng-select.ng-select-opened>.ng-select-container").css({
      "background": "#76102b !important",
      "border-color": "#76102b !important",
    });
  }

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

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

  clearStoreMaterialDetails() {
    $('.app-loader').show();
    $('#tglAvilchck').prop('checked', false);
    $('#tglReorderchck').prop('checked', false);
    $('#tglOutofStockchck').prop('checked', false);
    $('#tglIssuedchck').prop('checked', false);
    $('#tglFaultychck').prop('checked', false);
    $('#tglRepairchck').prop('checked', false);
    $('#tglLoanchck').prop('checked', false);
    this.valueCheckedMaterial = [];
    this.StoreMaterialDetails = [];
    this.department = null;
    this.material = null;
    this.toggleAvil = true;
    this.toggleReorder = true;
    this.toggleOutofStck = true;
    this.toggleIssued = true;
    this.toggleFaulty = true;
    this.toggleRepair = true;
    this.toggleLoan = true;
    let body = new URLSearchParams();
    body.append('action', "get_store_items");
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        for (var item in res.data) {
          let countAvil = 0;
          let countIssue = 0;
          let countFaulty = 0;
          let countRepair = 0;
          let countLoan = 0;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            switch (storeItem[i].status) {
              case "1":
                countAvil = countAvil + 1;
                break;
              case "3":
                countFaulty = countFaulty + 1;
                break;
              case "4":
                countRepair = countRepair + 1;
                break;
              case "5":
                countIssue = countIssue + 1;
                break;
              case "6":
                countLoan = countLoan + 1;
                break;
            }
          }
          if (countAvil == 0) {
            res.data[item]["OutofStock"] = 'OutofStock';
            res.data[item]["Available"] = 0;
            res.data[item]["ReOrder"] = 0;
          } else if (res.data[item].reorder_qty > countAvil) {
            res.data[item]["ReOrder"] = countAvil;
            res.data[item]["OutofStock"] = 0;
            res.data[item]["Available"] = 0;
          } else {
            res.data[item]["Available"] = countAvil;
            res.data[item]["ReOrder"] = 0;
            res.data[item]["OutofStock"] = 0;
          }
          res.data[item]["highLightRow"] = this.highLightRow;
          res.data[item]["Issued"] = countIssue;
          res.data[item]["Faulty"] = countFaulty;
          res.data[item]["Repair"] = countRepair;
          res.data[item]["Loan"] = countLoan;
          delete res.data[item].added_at;
          delete res.data[item].added_by;
          delete res.data[item].is_deleted;
          delete res.data[item].itempic;
          delete res.data[item].reorder_qty;
          delete res.data[item].status;
          delete res.data[item].store_item;
          delete res.data[item].supplier_id;
          delete res.data[item].updated_at;
          delete res.data[item].updated_by;
          delete res.data[item].vendor;
          this.StoreMaterialDetails.push(res.data[item]);
        }
        this.ClearedStoreMaterialDetails = this.StoreMaterialDetails;
        this.storeMaterials = this.StoreMaterialDetails;
      });
    $('.app-loader').hide();
  }

  clearStoreItemDetails() {
    $('#tglAvilchckItem').prop('checked', false);
    $('#tglIssuedchckItem').prop('checked', false);
    $('#tglFaultychckItem').prop('checked', false);
    $('#tglRepairchckItem').prop('checked', false);
    $('#tglLoanchckItem').prop('checked', false);
    this.valueCheckedItem = [];
    this.department = null;
    this.material = null;
    this.StoreItemDetails = this.ClearedStoreItemDetails;
  }

  getMaterailList() {
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialList = res;
          for (let item1 in this.materialList) {
            if (this.materialList[item1].category == "Controllable") {
              this.materialControlList.push(this.materialList[item1]);
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }

  selectedDepartment(department: any) {
    if (department == null) {
      this.StoreMaterialDetails = this.ClearedStoreMaterialDetails;
    } else {
      this.SearchFilterStoreMaterialDetails = [];
      for (let itemname in this.ClearedStoreMaterialDetails) {
        if (this.ClearedStoreMaterialDetails[itemname].department == department) {
          this.SearchFilterStoreMaterialDetails.push(this.ClearedStoreMaterialDetails[itemname]);
        }
      }
      this.StoreMaterialDetails = this.SearchFilterStoreMaterialDetails;
    }
  }

  selectedMaterial(material_id: any) {
    if (material_id == null) {
      this.StoreMaterialDetails = this.ClearedStoreMaterialDetails;
    } else {
      this.SearchFilterStoreMaterialDetails = [];
      for (let itemname in this.ClearedStoreMaterialDetails) {
        if (this.ClearedStoreMaterialDetails[itemname].id == material_id) {
          this.SearchFilterStoreMaterialDetails.push(this.ClearedStoreMaterialDetails[itemname]);
        }
      }
      this.StoreMaterialDetails = this.SearchFilterStoreMaterialDetails;
    }
  }

  setHighLightRow(report: any) {
    report.highLightRow = !report.highLightRow;
  }

  onChange(status: string, isChecked: boolean) {
    var objectchecked = {
      status: "",
    };
    objectchecked.status = status;
    if (isChecked) {
      this.valueCheckedMaterial.push(objectchecked);
      // if (status == "Available") {
      //   this.toggleAvil = true;
      // }
      // if (status == "ReOrder") {
      //   this.toggleReorder = true;
      // } if (status == "OutofStock") {
      //   this.toggleOutofStck = true;
      // } if (status == "Issued") {
      //   this.toggleIssued = true;
      // } if (status == "Faulty") {
      //   this.toggleFaulty = true;
      // } if (status == "Repair") {
      //   this.toggleRepair = true;
      // } if (status == "Loan") {
      //   this.toggleLoan = true;
      // }
    } else {
      // if (status == "Available") {
      //   this.toggleAvil = false;
      // }
      // if (status == "ReOrder") {
      //   this.toggleReorder = false;
      // } if (status == "OutofStock") {
      //   this.toggleOutofStck = false;
      // } if (status == "Issued") {
      //   this.toggleIssued = false;
      // } if (status == "Faulty") {
      //   this.toggleFaulty = false;
      // } if (status == "Repair") {
      //   this.toggleRepair = false;
      // } if (status == "Loan") {
      //   this.toggleLoan = false;
      // }
      for (let item1 in this.valueCheckedMaterial) {
        if (this.valueCheckedMaterial[item1].status == objectchecked.status) {
          this.valueCheckedMaterial.splice(Number(item1), 1);
        }
      }
    }
  }

  onChangeItems(status: string, isChecked: boolean) {
    var objectchecked = {
      status: "",
    };
    objectchecked.status = status;
    if (isChecked) {
      this.valueCheckedItem.push(objectchecked);
    } else {
      for (let item1 in this.valueCheckedItem) {
        if (this.valueCheckedItem[item1].status == objectchecked.status) {
          this.valueCheckedItem.splice(Number(item1), 1);
        }
      }
    }
  }

  selectedItemsDepartment(department: any) {
    if (department == null) {
      this.StoreItemDetails = this.ClearedStoreItemDetails;
    } else {
      this.SearchFilterStoreItemsDetails = [];
      for (let itemname in this.ClearedStoreItemDetails) {
        if (this.ClearedStoreItemDetails[itemname].department == department) {
          this.SearchFilterStoreItemsDetails.push(this.ClearedStoreItemDetails[itemname]);
        }
      }
      this.StoreItemDetails = this.SearchFilterStoreItemsDetails;
    }
  }

  selectedItemsMaterial(material_id: any) {
    if (material_id == null) {
      this.StoreItemDetails = this.ClearedStoreItemDetails;
    } else {
      this.SearchFilterStoreItemsDetails = [];
      for (let itemname in this.ClearedStoreItemDetails) {
        if (this.ClearedStoreItemDetails[itemname].material_id == material_id) {
          this.SearchFilterStoreItemsDetails.push(this.ClearedStoreItemDetails[itemname]);
        }
      }
      this.StoreItemDetails = this.SearchFilterStoreItemsDetails;
    }
  }

  selectForm(status: any) {
    if (status == '1') {
      this.showItemList = false;
      this.showMaterialList = true;
      this.StoreStockType = "Materials";
      this.dropDisplay = "View By Material";
    } else {
      this.showItemList = true;
      this.showMaterialList = false;
      this.StoreStockType = "Items";
      this.dropDisplay = "View By Items";
    }
  }

  loadData() {
    let body = new URLSearchParams();
    body.append('action', "get_store_items");
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        // console.log(this.dataResult);
        this.dataResult = res.data;
        for (var item in res.data) {
          let countAvil = 0;
          let countIssue = 0;
          let countFaulty = 0;
          let countRepair = 0;
          let countLoan = 0;
          let storeItem = res.data[item].store_item;
        //  console.log(res.data[item]);
          for (var i in storeItem) {
            switch (storeItem[i].status) {
              case "1":
                countAvil = countAvil + 1;
                break;
              case "3":
                countFaulty = countFaulty + 1;
                break;
              case "4":
                countRepair = countRepair + 1;
                break;
              case "5":
                countIssue = countIssue + 1;
                break;
              case "6":
                countLoan = countLoan + 1;
                break;
            }
          }
          if (countAvil == 0) {
            res.data[item]["OutofStock"] = 'OutofStock';
            res.data[item]["Available"] = 0;
            res.data[item]["ReOrder"] = 0;
          } else if (res.data[item].reorder_qty > countAvil) {
            res.data[item]["ReOrder"] = countAvil;
            res.data[item]["OutofStock"] = 0;
            res.data[item]["Available"] = 0;
          } else {
            res.data[item]["Available"] = countAvil;
            res.data[item]["ReOrder"] = 0;
            res.data[item]["OutofStock"] = 0;
          }
          res.data[item]["highLightRow"] = this.highLightRow;
          res.data[item]["Issued"] = countIssue;
          res.data[item]["Faulty"] = countFaulty;
          res.data[item]["Repair"] = countRepair;
          res.data[item]["Loan"] = countLoan;
          delete res.data[item].added_at;
          delete res.data[item].added_by;
          delete res.data[item].is_deleted;
          delete res.data[item].itempic;
          delete res.data[item].reorder_qty;
          delete res.data[item].status;
          delete res.data[item].store_item;
          delete res.data[item].supplier_id;
          delete res.data[item].updated_at;
          delete res.data[item].updated_by;
          delete res.data[item].vendor;
          this.StoreMaterialDetails.push(res.data[item]);
        }
        this.ClearedStoreMaterialDetails = this.StoreMaterialDetails;
        this.storeMaterials = this.StoreMaterialDetails;
      });
  }
  loadData1() {
    let body = new URLSearchParams();
    body.append('action', "get_storeReport_items");
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        this.StoreItemDetails = res;
        this.ClearedStoreItemDetails = this.StoreItemDetails;
      });
  }
};


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { CookieService } from 'angular2-cookie/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';
import { LocalStorageService } from 'angular-2-local-storage';
@Component({
  selector: 'StoreItemForm',
  templateUrl: './storeItemForm.component.html'
})
export class StoreItemFormComponent implements OnInit {
  environment: any = environment;
  sm: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  opr: any;
  currentLanguage: string;
  suprefnameList: any[];
  StoreItem: any[];
  ItemStatusList: any[];
  materialList: any[];
//   distributionList : any[]= [];
//   distributionListArabic : any[]= [];
//   distributionUnit : any[]= [];
//   distributionUnitArabic : any[]= [];

//   errorType_enquiry: string = '';
//   errorEnquiry_from: string = '';
//   errorClient_dev_name: string = '';
//   errorConsultant_name: string = '';
//   errorContractor_name: string = '';
//   errorProject_name: string = '';
//   errorProject_no: string = '';
//   errorDistribution_menu: string = '';
//   errorDistribution_unit: string = '';
//   errorLocation: string = '';
//   errorPin_no: string = '';
//   errorDrawing_name: string = '';
//   errorDrawing_no: string = '';
//   errorOriginator: string = '';
//   errorDescription_work: string = '';
//   errorRemarks: string = '';
//   errorStatus: string = ''; 


  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService,private _localStorageService: LocalStorageService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.getMaterailList();
    this.sm = {};
    if (action == 'edit' && param) {
     this.opr = 1;
      this.Id = param;
      this.title = 'Update Block Wiring';
      this.isReadOnly = false;
      alert("update");
    } else if (action == 'view' && param) {
        
      this.opr = 2;
      this.Id = param;
      alert(this.Id);
      this.title = 'View Block Wiring';
      this.isReadOnly = true;
      
    } else {
        alert("add");
      this.opr = 0;
      this.title = 'Add Block Wiring';
      this.isReadOnly = false;
    }

    this.ItemStatusList = [
        {
          "value": "1",
          "label": "Available"
        },
        {
          "value": "2",
          "label": "ReOrder"
        },
        {
          "value": "3",
          "label": "Faulty"
        },
        {
          "value": "4",
          "label": "Under Repair"
        },
        {
          "value": "5",
          "label": "Issued"
        },
        {
          "value": "6",
          "label": "Loan"
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

loadData() {

    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', 'get_store_items');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        for (var item in res.data) {
          let QuantityAvilable = 0;
          let QuantityReOrder = 0;
          let QuantityFaulty = 0;
          let QuantityUnderRepair = 0;
          let QuantityIssued = 0;
          let QuantityLoan = 0;

          res.data[item]["hideInnerRowAvilable"] = false;
          res.data[item]["hideInnerRowReOrder"] = false;
          res.data[item]["hideInnerRowFaulty"] = false;
          res.data[item]["hideInnerRowUnderRepair"] = false;
          res.data[item]["hideInnerRowIssued"] = false;
          res.data[item]["hideInnerRowLoan"] = false;
          let storeItem = res.data[item].store_item;
          for (var i in storeItem) {
            if (storeItem[i].status == '1') {
              QuantityAvilable = QuantityAvilable + 1;
            } else if (storeItem[i].status == '2') {
              QuantityReOrder = QuantityReOrder + 1;
            }
            else if (storeItem[i].status == '3') {
              QuantityFaulty = QuantityFaulty + 1;
            }
            else if (storeItem[i].status == '4') {
              QuantityUnderRepair = QuantityUnderRepair + 1;
            }
            else if (storeItem[i].status == '5') {
              QuantityIssued = QuantityIssued + 1;
            }
            else {
              QuantityLoan = QuantityLoan + 1;
            }
          }

          res.data[item]["Quantity1"] = QuantityAvilable;
          res.data[item]["Quantity2"] = QuantityReOrder;
          res.data[item]["Quantity3"] = QuantityFaulty;
          res.data[item]["Quantity4"] = QuantityUnderRepair;
          res.data[item]["Quantity5"] = QuantityIssued;
          res.data[item]["Quantity6"] = QuantityLoan;
        }
        this.sm = res.data;
      }, error => {
        console.log(error.json());
      });

  }
AddStoreItem(StoreItem: any) {

    // var isModelValid = this.isModelValid(StoreItem);
    // if (!isModelValid) {
    //   return;
    // }

    // warranty: "2"
    delete StoreItem.date_in;
    delete StoreItem.date_out;
    delete StoreItem.item_no;
    delete StoreItem.location;
    delete StoreItem.part_no;
    delete StoreItem.problem_reported;
    delete StoreItem.loan_duration;
    delete StoreItem.site_name;
    let body = new URLSearchParams();
    body.append('data', JSON.stringify(StoreItem));
    body.append('action', 'addStoreItem');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          this.loadData();
          this.closeAndRedirect();
        } else if (data.code == 101) {
          alert(data.message);
        } else {
          alert("Item Not Stored. Please Check Logs.");
        }
      }, error => {
        console.log(error.json());
      });
      this.closeAndRedirect();
  }


  addSupplier($event:any){
    if ($event.target.value == ''){
      this.router.navigate(['/store/supplier/supplier/add']);
    }
  }
  
  getSupplierList(){
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

  UpdateStoreItem(StoreMaterial: any) {
    delete StoreMaterial["supplierName"];
    delete StoreMaterial["hideInnerEmpRow"];
    delete StoreMaterial["highLightRow1"];
    let body = new URLSearchParams();
    body.append('action', "updateStoreMaterial");
    body.append('data', JSON.stringify(StoreMaterial));
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
            this.closeAndRedirect();
        } else {
            alert(res.message);
        }
      }, error => {
        console.log(error.json());
      });
  }


  closeAndRedirect() {
    this.router.navigate(['/StoreItemList']);
  }
}

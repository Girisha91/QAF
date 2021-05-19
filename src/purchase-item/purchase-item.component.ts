import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-purchase-item',
  templateUrl: './purchase-item.component.html',
  styleUrls: [('./purchase-item.component.css').toString()]

})

export class PurchaseItemComponent implements OnInit {

  environment: any = environment;
  item: any;
  opr: any;
  ItemLocationList: any[];
  CategoryList: any[];
  MethodList: any[];
  UnitList: any[];
  DepartmentList: any[];
  PriorityList: any[];
  ItemStatusList: any[];
  CurrencyList: any[];
  purchaseOrderList: any[];
  materialList: any[];
  statusChange: any[];
  materialData: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  isItemReadOnly: Boolean = false;
  isItemSerialNo: Boolean = true;
  // errorPurOrderNo:any;
  // errorItem_name:any;
  // errorItem_no:any;
  // errorAlt_item_no:any;
  // errorItem_part_no:any;
  // errorCategory:any;
  // errorQuntity:any;
  // errorManufacturerItem:any;
  // errorWarranty:any;
  // errorDescriptions:any;
  // errorRemarks:any;
  // errorParcel_no:any;

  currentLanguage: string;
  isLangArabic: Boolean = false;

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.item = {};

    if (action == 'edit' && param) {
      this.title = 'Update Item';
      this.opr = 1;
      this.isReadOnly = true;
      this.isItemReadOnly = false;
      this.isItemSerialNo = true;
      this.Id = param;
      this.getOrderItemData();

    } else if (action == 'view' && param) {
      this.title = 'View Item';
      this.opr = 2;
      this.isReadOnly = true;
      this.isItemReadOnly = true;
      this.isItemSerialNo = true;
      this.Id = param;
      this.getOrderItemData();

    } else {
      this.opr = 0;
      this.title = 'Add Item';
      this.isReadOnly = true;
      this.isItemReadOnly = false;
      this.item['purchase_order_no'] = param;
    }

    this.purchaseOrderList = [];
    this.http.get(environment.apikey + "/masterData.php?oper=purchaseOrderList")
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            this.purchaseOrderList.push({ 'value': data[item].purchase_order_no, label: data[item].purchase_order_no });
          }
        }
      });

    this.ItemLocationList = [];

    this.http.get(environment.apikey + "/masterData.php?oper=storeLocation")
      .map(res => res.json())
      .subscribe(data => {
        if (!!data) {
          for (var item in data) {
            this.ItemLocationList.push({ 'value': data[item].id, label: data[item].name });
          }
        }
      });

    this.statusChange = [
      {
        label: "Available",
        value: "1"
      },
      {
        label: "Faulty",
        value: "3"
      },
      {
        label: "UnderRepair",
        value: "4"
      },
      {
        label: "Issued",
        value: "5"
      },
      {
        label: "Loan",
        value: "6"
      }
    ];

    this.CurrencyList = [
      {
        label: "QAR",
        value: "QAR"
      }, {
        label: "USD",
        value: "USD"
      },
      {
        label: "AED",
        value: "AED"
      }
    ];
    // this.ItemStatusList = [
    //   {
    //     label:"Accepted",
    //     value:"1"
    //   },
    //   {
    //     label:"Awaiting Inspection",
    //     value:"2"
    //   },
    //   {
    //     label:"Inspected",
    //     value:"3"
    //   },
    //   {
    //     label:"Rejected",
    //     value:"4"
    //   },
    //   {
    //     label:"Corrected",
    //     value:"5"
    //   }
    // ];
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

    this.CategoryList = [
      {
        label: "Controlled",
        value: "Controlled"
      },
      {
        label: "Non-Controlled",
        value: "Non-Controlled"
      }
    ];

    this.MethodList = [
      {
        label: "Add",
        value: "Add"
      },
      {
        label: "Remove",
        value: "Remove"
      },
      {
        label: "Adjust",
        value: "Adjust"
      },
      {
        label: "Rejected",
        value: "Rejected"
      }
    ];

    this.UnitList = [
      {
        label: "QESC",
        value: "QESC"
      },
      {
        label: "Land Forces",
        value: "Land Forces"
      },
      {
        label: "Navy",
        value: "Navy"
      },
      {
        label: "Air Force",
        value: "Air Force"
      },
      {
        label: "Qatar Emiri Guard",
        value: "Qatar Emiri Guard"
      }
    ];

    this.DepartmentList = [
      {
        label: "IT",
        value: "IT"
      },
      {
        label: "Radio",
        value: "Radio"
      },
      {
        label: "PABX",
        value: "PABX"
      },
      {
        label: "Workshop",
        value: "Workshop"
      },
      {
        label: "Transmission",
        value: "Transmission"
      }
    ];

    this.PriorityList = [
      {
        label: "High",
        value: "High"
      },
      {
        label: "Medium",
        value: "Medium"
      },
      {
        label: "Low",
        value: "Low"
      }
    ];
    this.getMaterailList();
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

  // isModelValid(item: any) {
  //   let isValid = true;
  //   console.log(item);

  //   this.errorPurOrderNo= '';
  //   this.errorItem_name= '';
  //   this.errorItem_no= '';
  //   this.errorAlt_item_no= '';
  //   this.errorItem_part_no= '';
  //   this.errorCategory= '';
  //   this.errorQuntity= '';
  //   this.errorManufacturerItem= '';
  //   this.errorWarranty= '';
  //   this.errorDescriptions= '';
  //   this.errorRemarks= '';
  //   this.errorParcel_no = '';

  //   if (Object.keys(item).length == 0) {
  //     alert('Please Fill all the required fields');
  //     return false;
  //   }

  //    if (Object.keys(item).length && typeof item.purchase_order_no == 'undefined') {
  //      this.errorPurOrderNo = 'purchase order no is Required';
  //      isValid = false;
  //    }

  //   if (Object.keys(item).length && typeof item.parcel_no == 'undefined') {
  //     this.errorParcel_no = 'Parcel No is Required';
  //     isValid = false;
  //   }
  //   console.log(isValid);
  //   if (Object.keys(item).length && typeof item.item_name == 'undefined') {
  //     this.errorItem_name = 'item name is Required';
  //     isValid = false;
  //   }


  //   if (Object.keys(item).length && typeof item.item_no == 'undefined') {
  //     this.errorItem_no = 'item no is Required';
  //     isValid = false;
  //   }

  //   if (Object.keys(item).length && typeof item.alt_item_no == 'undefined') {
  //     this.errorAlt_item_no = 'alt item no is Required';
  //     isValid = false;
  //   }
  //   console.log(isValid);
  //   if (Object.keys(item).length && typeof item.item_part_no == 'undefined') {
  //     this.errorItem_part_no = 'item  part no is Required';
  //     isValid = false;
  //   }

  //   if (Object.keys(item).length && typeof item.category == 'undefined') {
  //     this.errorCategory = 'category is Required';
  //     isValid = false;
  //   }
  //   if (Object.keys(item).length && typeof item.quantity == 'undefined') {
  //     this.errorQuntity = 'quantity is Required';
  //     isValid = false;
  //   }
  //   if (Object.keys(item).length && typeof item.manufacture_item == 'undefined') {
  //     this.errorManufacturerItem = 'manufacture item is Required';
  //     isValid = false;
  //   }
  //   console.log(isValid);
  //   if (Object.keys(item).length && typeof item.warranty == 'undefined') {
  //     this.errorWarranty = 'warranty is Required';
  //     isValid = false;
  //   }

  //   if (Object.keys(item).length && typeof item.descriptions == 'undefined') {
  //     this.errorDescriptions = ' descriptions is Required';
  //     isValid = false;
  //   }

  //   if (Object.keys(item).length && typeof item.remarks == 'undefined') {
  //     this.errorRemarks = 'remarks is Required';
  //     isValid = false;
  //   }

  //   return isValid;
  // }


  getOrderItemData() {
    let body = new URLSearchParams();
    body.append('action', 'get_purchase_order_item');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        console.log("value of order itemdata is",res)
        if (!!res) {
          var itemData = res.data;          
          let body = new URLSearchParams();
          body.append('action', 'getMaterailList');
          this.http.post(environment.apikey + '/masterData.php', body)
            .map(res => res.json())
            .subscribe((res: any) => {
              if (!!res) {
                // this.fieldArray = res;
                // console.log(this.fieldArray);
                this.materialData = res;
                for (let itemname in this.materialData) {
                  if (this.materialData[itemname].material_id == itemData.material_id) {
                    this.item = itemData;
                    this.item.label = this.materialData[itemname].label;
                    this.item.item_no = this.materialData[itemname].item_no;
                    this.item.part_no = this.materialData[itemname].part_no;
                    this.item.category = this.materialData[itemname].category;
                  }
                }
                // console.log(this.fieldArray);
              }
            }, error => {
              console.log(error.json());
            });



        }
      }, error => {
        console.log(error.json());
      });
  }

  AddStoreItem(item: any) {
    delete item.item_no;
    delete item.item_part_no;
    let body = new URLSearchParams();
    body.append('data', JSON.stringify(item));
    body.append('action', 'addStoreItem');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe(data => {
        data = data;
        this.closeAndRedirect();
      }, error => {
        console.log(error.json());
      });
  }


  UpdateStoreItem(item: any) {
    let name = item.label;
    let itemItem = item.item_no;
    let itemPart = item.part_no;
    let itemCat = item.category;
    delete item.label;
    delete item.item_no;
    delete item.part_no;
    delete item.category;
    let body = new URLSearchParams();
    body.append('data', JSON.stringify(item));
    body.append('action', 'updateStoreItemPO');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        // console.log(data);
        if (data.code == 100) {
          this.closeAndRedirect();
        } else {
          item.label = name;
          item.item_no = itemItem;
          item.part_no = itemPart;
          item.category = itemCat;
          alert("there is a " + " " + data.message);
        }
        // let Resultcode:any;
        // data = data;
        // console.log(data);
        // Resultcode = data;
        // console.log(Resultcode);

        // this.closeAndRedirect();
      }, error => {
        console.log(error.json());
      });
  }

  closeAndRedirect() {
    this.router.navigate(['/store-items']);
  }


}

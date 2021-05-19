import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
import { LocalStorageService } from 'angular-2-local-storage';
declare var $: any;
@Component({
  selector: 'storewithoutPo',
  templateUrl: './store-withoutpo.component.html',
  styleUrls: [('./store-withoutpo.component.css').toString()]
})
export class storewithoutPoComponent implements OnInit {
  environment: any = environment;
  opr: any;
  Id: any;
  demandBookId: any;
  title: string;
  isReadOnly: Boolean = false;
  statusChange: any[];
  PageTitle : string;
  DepartmentList: any[];
  materialList: any = [];
  materialListAll: any[];
  storeUsersList: any = [];
  isGenereatedDemandNoOnly: Boolean = true;
  isItemSerialNo: Boolean = true;
  isItemNameOnly: Boolean = true;
  isItemPartNoOnly: Boolean = true;
  isCurrentDateOnly: Boolean = true;
  storeItemsWoPo: any;
  materialData: any[];
  materialControlList: any[]= [];
  NcArrrayList:any =[];
  isAddonly:  Boolean = true;
  materialwoPo: any;
  quantitywoPo: any;
  ItemsWoPoArray: any = [];
  userPermissionInfo: any;
  errorStoreWithoutPoManualDemandNo: string = '';
  errorStoreWithoutPoDepartment: string = '';
  errorStoreWithoutPoRecipient: string = '';
  errorStoreWithoutPoApplicant: string = '';

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private _localStorageService: LocalStorageService, private router: Router) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.storeItemsWoPo = {};
    if (action == 'edit' && param) {
      this.Id = param;
      this.title = 'Update Form';
      this.opr = 1;
      this.PageTitle = 'Store Item Without PO';
      this.isReadOnly = false;
      this.isGenereatedDemandNoOnly = true;
      this.isItemNameOnly = true;
      this.isItemSerialNo = true;
      this.isItemPartNoOnly = true;
      this.isAddonly = true;
      this.isCurrentDateOnly = true;
      this.getDemandBookData('edit');
    } else if (action == 'view') {
      this.Id = param;
      this.title = 'View  Form';
      this.PageTitle = 'Receiveing Material to Store';
      this.opr = 2;
      this.isReadOnly = true;
      this.isGenereatedDemandNoOnly = true;
      this.isItemNameOnly = true;
      this.isItemPartNoOnly = true;
      this.isAddonly = true;
      this.isCurrentDateOnly = true;
      this.isItemSerialNo = true;
      this.getDemandBookData('view');
    } else {
      this.opr = 0;
      this.title = 'Add Form';
      this.PageTitle = 'Store Item Without PO';
      this.isGenereatedDemandNoOnly = false;
      this.isCurrentDateOnly = false;
      this.isItemNameOnly = true;
      this.isItemSerialNo = false;
      this.isAddonly = false;
      this.isItemPartNoOnly = true;
      this.isReadOnly = false;
    }
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
  }

  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.getMaterailList();
        this.getstoreUsersList();
        this.getDepartmentList();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  errorStoreWithoutPoClear() {
    this.errorStoreWithoutPoManualDemandNo = '';
    this.errorStoreWithoutPoDepartment = '';
    this.errorStoreWithoutPoRecipient = '';
    this.errorStoreWithoutPoApplicant = '';
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

  // getMaterailList() {
  //   let body = new URLSearchParams();
  //   body.append('action', 'getMaterailList');
  //   this.http.post(environment.apikey + '/masterData.php', body)
  //     .map(res => res.json())
  //     .subscribe((res: any) => {
  //       if (!!res) {
  //         this.materialList = res;
  //       }
  //     }, error => {
  //       console.log(error.json());
  //     });
  // }

  getMaterailList() {
    let body = new URLSearchParams();
    body.append('action', 'getMaterailList');
    this.http.post(environment.apikey + '/masterData.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.materialList = res;
          for(let item1 in this.materialList){
            if(this.materialList[item1].category=="Controllable"){
              this.materialControlList.push(this.materialList[item1]);
            }
          }
          this.NcArrrayList=this.materialControlList;
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

  getDemandBookData(method: any) {
    let body = new URLSearchParams();
    body.append('action', 'getDemandItems');
    body.append('material_demand_no', this.Id);
    body.append('method', method);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          if (res.form_type == 'oldLoanItem') {
            this.storeItemsWoPo = res;
            for (let item in this.storeItemsWoPo.store_item) {
              this.ItemsWoPoArray.push(this.storeItemsWoPo.store_item[item]);
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }

  isModelIssueValid(storeWoPo: any) {
    let isValid = true;
    this.errorStoreWithoutPoManualDemandNo = '';
    this.errorStoreWithoutPoDepartment = '';
    this.errorStoreWithoutPoRecipient = '';
    this.errorStoreWithoutPoApplicant = '';
    if (Object.keys(storeWoPo).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }
    if (Object.keys(storeWoPo).length && typeof storeWoPo.issued_by == 'undefined') {
      this.errorStoreWithoutPoRecipient = 'Recipient is Required';
      isValid = false;
    }

    if (Object.keys(storeWoPo).length && typeof storeWoPo.department == 'undefined') {
      this.errorStoreWithoutPoDepartment = 'Department is Required';
      isValid = false;
    }

    if (Object.keys(storeWoPo).length && typeof storeWoPo.manual_demand_no == 'undefined') {
      this.errorStoreWithoutPoManualDemandNo = 'Manual Demand No is Required';
      isValid = false;
    }
    if (Object.keys(storeWoPo).length && typeof storeWoPo.applicant == 'undefined') {
      this.errorStoreWithoutPoApplicant = 'Applicant is Required';
      isValid = false;
    }
    return isValid;
  }
  addFieldsValue(material_id: any, quantity: any, formtype: any) {
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
                  expireDate:"",
                  serial_no: "",
                  site_name: "",
                  status: "",
                  remarks: ""
                };
                object.material_id = this.materialData[itemname].material_id;
                object.item_name = this.materialData[itemname].label;
                object.item_part_no = this.materialData[itemname].part_no;
                object.expireDate = this.materialData[itemname].expireDate;
                if (formtype == 'oldLoanItem') {
                  this.ItemsWoPoArray.push(object);
                }
              }
            }
          }
        }
      }, error => {
        console.log(error.json());
      });
  }
  clearstoreItemsWoPoValue() {
    this.materialwoPo = " ";
    this.quantitywoPo = " ";
    this.storeItemsWoPo = " ";
  }
  deleteStoreItemsWoPoValue(index: any) {
    this.ItemsWoPoArray.splice(index, 1);
  }

  updateItemsWoPo(storeItemsWoPo: any) {
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    var userCookie = JSON.parse(this.cookieService.get('user'));
    storeItemsWoPo.store_item = this.ItemsWoPoArray;
    storeItemsWoPo.form_type = "oldLoanItem";
    let body = new URLSearchParams();
    body.append('action', 'updateMaterialIssue');
    body.append('data', JSON.stringify(storeItemsWoPo));
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
      this.closeAndRedirect();
  }

  addItemsWoPo(storeItemsWoPo: any) {

    storeItemsWoPo.store_item = this.ItemsWoPoArray;
    storeItemsWoPo.form_type = "oldLoanItem";
    this.userPermissionInfo = JSON.parse(this._localStorageService.get('userPermission'));
    let userPermissionDataInfo = this.userPermissionInfo;
    let userRoleName = userPermissionDataInfo.RoleInfo.RoleName;
    let userCookie = JSON.parse(this.cookieService.get('user'));
    storeItemsWoPo.username = userRoleName;
    var isModelIssueValid = this.isModelIssueValid(storeItemsWoPo);
    if (!isModelIssueValid) {
      return;
    }
    if (storeItemsWoPo.store_item.length == 0) {
      alert("please add items");
    } else {
      let countValidate: number = 0;
      for (let k = 0; k < this.ItemsWoPoArray.length; k++) {
        if (this.ItemsWoPoArray[k].serial_no == "") {
          countValidate++;
        }
      }
      if (countValidate > 0) {
        alert("please enter Serial no");
      } else {
        if (this.ItemsWoPoArray.length > 1) {
          let count: number = 0;
          let duplicateSerialNumbers: any = [];
          for (var i = 0; i < this.ItemsWoPoArray.length; i++) {
            for (var j = i + 1; j < this.ItemsWoPoArray.length; j++) {
              if ((this.ItemsWoPoArray[i].serial_no === this.ItemsWoPoArray[j].serial_no) && (this.ItemsWoPoArray[i].item_name === this.ItemsWoPoArray[j].item_name)) {
                // alert("you have already selected Item with this Serial No" + " " + this.ItemsWoPoArray[i].serial_no + " " + "please change it");
                duplicateSerialNumbers.push(this.ItemsWoPoArray[i].serial_no);
                count++;
              }
            }
          }
          if (count == 0) {
            let body = new URLSearchParams();
            body.append('action', 'addNewItemWOPO');
            body.append('data', JSON.stringify(storeItemsWoPo));
            body.append('sessionId', userCookie.sessionId);
            this.http.post(environment.apikey + '/generateJsonUrl.php', body)
              .map(res => res.json())
              .subscribe(data => {
                if (data.code == 100) {
                  //alert('Ex Order Created')
                  if(data.hasOwnProperty('data')){
                    alert(data.message + " "+data.data);
                  }else{
                    this.demandBookId = data.materialDemandNo;
                    this.router.navigate(['/print/oldLoanItem', this.demandBookId]);
                  }
                } else {
                  alert(data.message);
                }
              }, error => {
                console.log(error.json());
              })
          } else {
            alert("you have already selected Item with this Serial No" + " ' " + duplicateSerialNumbers + " ' " + "please change it");
            // this.closeAndRedirect();
          }
        }
        else {
          // storeItemsWoPo.store_item = this.ItemsWoPoArray;
          // storeItemsWoPo.form_type = "oldLoanItem";
          let body = new URLSearchParams();
          body.append('action', 'addNewItemWOPO');
          body.append('data', JSON.stringify(storeItemsWoPo));
          body.append('sessionId', userCookie.sessionId);
          this.http.post(environment.apikey + '/generateJsonUrl.php', body)
            .map(res => res.json())
            .subscribe(data => {
              if(data.hasOwnProperty('data')){
                alert(data.message + " "+data.data);
              }else{
                this.demandBookId = data.materialDemandNo;
                this.router.navigate(['/print/oldLoanItem', this.demandBookId]);
              }
            }, error => {
              console.log(error.json());
            })
        }
      }
    }
  }
  Print(id: any) {
    window.print();
    this.PageTitle = "Receiveing Material to Store";
  }

//   Print(id: any){
//     this.PageTitle = "Receiveing Material to Store";
// }
  closeAndRedirect() {
    this.router.navigate(['/store-items']);
  }
  closeAndRedirectToView() {
    this.router.navigate(['/storewithoutPo/view', this.demandBookId]);
  }
}

import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from "angular-2-local-storage";
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SharedService } from '../shared.service';

@Injectable()
export class AuthGuard implements CanActivate {

  isLogIn: boolean;
  isUserLogIn = this.ss.userLoggedIn.subscribe((log) => {
    return (this.isLogIn = log);
  })
  currentUser: any;
  navi:any = false;


  constructor(private router: Router, private atr: ActivatedRoute, private ls: LocalStorageService, private ss: SharedService) {
    // this.ss.userPermission.subscribe((value)=>{this.currentUser = value});
    let cuValue = this.ss.userPermission.subscribe((data) => {
      return (this.currentUser = data);
    })
  }
  selectedPage: any = {};

  setSelectedPage(url: any) {
    if (url == '/employee' || url == '/AddNewEmployee' || url.search('updateEmployee') != -1 || url.search('viewEmployee') != -1) {
      this.selectedPage.PageUrl = '/employee';
      // this.selectedPage.op = ''
      if (url == '/AddNewEmployee') {
        this.selectedPage.op = 'add'
      } else if (url.search('updateEmployee') != -1) {
        this.selectedPage.op = 'modify'
      } else if (url.search('viewEmployee') != -1) {
        this.selectedPage.op = ''
      } else {
        this.selectedPage.op = ''
      }
    } else if (url == '/user-requests' || url.search('/users/request') != -1) {
      this.selectedPage.PageUrl = '/user-requests';
      if (url.search('/users/request') != -1) {
        this.selectedPage.op = 'modify'
      } else {
        this.selectedPage.op = ''
      }
    } else if (url == '/users' || url == '/users/add' || url.search('/user/edit') != -1) {
      this.selectedPage.PageUrl = 'admin'
      this.selectedPage.op = ''
    } else if (url == '/user-role' || url == '/user-role/add' || url.search('/user-role/edit') != -1) {
      this.selectedPage.PageUrl = 'admin'
      this.selectedPage.op = ''
    } else if (url == '/pabx/entities' || url == '/pabx/free-address' || url == '/pabx/pcs-Address' || url == '/pabx/routingTable' || url == '/pabx/softpack' || url == '/pabx/tsc-Ip-attendent' || url == '/pabx/tsc-Ip-user' || url == '/pabx/trunk' || url == '/pabx/user-all-nodes' || url == '/pabx/topology' || url == '/pabx/xlsheet' || url == '/pabx/configuration-info' || url == '/pabx/configuration-info/add' || url.search('/pabx/configuration-info/view') != -1 || url.search('/pabx/configuration-info/edit') != -1 || url == '/pabx/switch-info' || url == '/pabx/switch-info/add' || url.search('/pabx/switch-info/view') != -1 || url.search('/pabx/switch-info/edit') != -1) {
      this.selectedPage.PageUrl = '/pabx/entities'
      if (url == '/pabx/switch-info/add' || url == '/pabx/configuration-info/add') {
        this.selectedPage.op = 'add'
      } else if (url.search('/pabx/configuration-info/edit') != -1 || url.search('/pabx/switch-info/edit') != -1) {
        this.selectedPage.op = 'modify'
      } else {
        this.selectedPage.op = ''
      }
    } else if (url == '/pabx/external-lines' || url.search('/pabx/external-lines/view') != -1 || url.search('/pabx/external-lines/edit') != -1 || url == '/pabx/external-lines/add' || url.search('/pabx/external-lines-rent/add') != -1) {
      this.selectedPage.PageUrl = '/pabx/external-lines'
      if (url == '/pabx/external-lines/add' || url.search('/pabx/external-lines-rent/add') != -1) {
        this.selectedPage.op = 'add'
      } else if (url.search('/pabx/external-lines/edit') != -1) {
        this.selectedPage.op = 'modify'
      } else {
        this.selectedPage.op = ''
      }
    } else if (url == '/store-items' || url == '/store' || url == '/store-transaction' || url.search('/demandPrint/view') != -1 ||
      url.search('/store-items/purchase-item/edit') != -1 || url.search('/StoreMaterialForm/view') != -1 ||
      url.search('/StoreMaterialForm/edit') != -1 || url.search('/storewithoutPo/edit') != -1 ||
      url.search('/storewithoutPo/view') != -1 || url.search('/store/supplier/edit') != -1 || url.search('/print/loanReturn') != -1 ||
      url == '/storeReport' || url.search('/demandBookForm/view') != -1 || url.search('/print/LoanForm') != -1 ||
      url.search('/demandBookForm/edit') != -1 || url == '/store/demandBookList' || url.search('/print/repair') != -1 ||
      url == '/demandBookForm/add' || url.search('/store/supplier') != -1 || url.search('/print/faulty') != -1 ||
      url == '/StoreMaterialForm/add' || url.search('/StoreMaterialForm') != -1 || url.search('/print/issue') != -1 ||
      url == '/StoreItemList' || url == '/storewithoutPo' || url == '/store/supplier/add' || url.search('/print/oldLoanItem') != -1 ||
      url.search('/store/purchase-order') != -1 || url.search('/store/purchase-order/add') != -1) {

        this.selectedPage.PageUrl = "/store-items";
      if (url.search('purchase-item/edit') != -1) {
        this.selectedPage.op = 'modify'
      } else { this.selectedPage.op = '' }


      // this.selectedPage.PageUrl = '/store-items';
      // if (url == '/storewithoutPo' || url == '/demandBookForm/add' || url == '/store/supplier/add' 
      // || url.search('/store/purchase-order/add') != -1 || url == '/StoreMaterialForm/add') {
      //   this.selectedPage.op = 'add'
      // } else if (url.search('/store-items/purchase-item/edit') != -1 ||
      //  url.search('/demandBookForm/edit') != -1 || url.search('/StoreMaterialForm/edit') != -1 ||
      //   url.search('/store/supplier/edit') != -1 || url.search('/storewithoutPo/edit') != -1) {
      //   this.selectedPage.op = 'modify'
      // } else {
      //   this.selectedPage.op = ''
      // }



    } else if (url == '/blockWiringList' || url.search('/blockWiringList/view') != -1 || url.search('/blockWiringAttach/view') != -1 || url == '/blockWiringList/add' || url.search('/blockWiringList/edit') != -1 || url.search('/blockWiringAttach/add') != -1 || url.search('/blockWiringAttach/edit') != -1) {
      this.selectedPage.PageUrl = "/blockWiringList"
      if (url == '/blockWiringList/add') {
        this.selectedPage.op = 'add'
      } else if (url.search('/blockWiringList/edit') != -1) {
        this.selectedPage.op = 'modify'
      } else {
        this.selectedPage.op = ''
      }
    } else if (url == '/workOrder' || url.search('/work-order-form-dp-info/view') != -1 || url == '/work-order-form-exchange-info' || url.search('/work-order-form-dp-info/edit') != -1 || url == '/work-order-form-dp-info' || url.search('/work-order-form-exchange-info/edit') != -1) {
      this.selectedPage.PageUrl = "/workOrder"
      if (url == '/work-order-form-exchange-info' || url == '/work-order-form-dp-info') {
        this.selectedPage.op = 'add'
      } else if (url.search('/work-order-form-exchange-info/edit') != -1 || url.search('/work-order-form-dp-info/edit') != -1) {
        this.selectedPage.op = 'modify'
      } else {
        this.selectedPage.op = ''
      }
    } else if (url == '/faultIssueManagement' || url == '/AddJobFault' || url.search('/AddJobFault/edit') != -1) {
      this.selectedPage.PageUrl = "/faultIssueManagement"
      if (url == '/AddJobFault') {
        this.selectedPage.op = 'add'
      } else if (url.search('/AddJobFault/edit') != -1) {
        this.selectedPage.op = 'modify'
      } else {
        this.selectedPage.op = ''
      }
    }
    else {
      this.selectedPage.PageUrl = '';
      this.selectedPage.op = '';
    }
  }


  async canActivate(rt: ActivatedRouteSnapshot, st: RouterStateSnapshot) {
    if (this.currentUser === null || this.currentUser === '' || this.currentUser === undefined) {
      this.currentUser = JSON.parse(this.ls.get('userPermission'))
    }
    console.log("value of current user is", this.currentUser);
    let userPermission = this.currentUser.OtherInfo.pages
    await this.setSelectedPage(st.url);
    console.log("value of selected page op is", this.selectedPage);
    // this.navi = false;
    this.navi = true;
    if(this.selectedPage.PageUrl == 'admin'){
      this.navi = true;
    } else {
      userPermission.some((ele: any) => {
        if (ele.PageUrl == this.selectedPage.PageUrl && ele.selected == true) {
          ele.operation_pages.some((ite: any) => {
            if (this.selectedPage.op == '') {
              this.navi = true;
              return true;
            } else if ((ite.label == this.selectedPage.op && ite.selected == true)) {
              this.navi = true;
            }
          })
        }
      });
    }
   
    if (this.navi == true) {
      return true;
    } else {
      this.router.navigate(['/home']);
    }
  }


}
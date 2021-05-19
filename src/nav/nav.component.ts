import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { CookieService } from 'angular2-cookie/core';
import { SharedService } from '../app/shared.service';
declare var $: any;
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: [('./nav.component.css').toString()]
})

export class NavComponent implements OnInit {

  showSubMenu: boolean;
  showPabxSubMenu: boolean;
  showRoleSubMenu: boolean;
  showUserSubMenu: boolean;
  showMenu: boolean;
  public UserMenu:any;
  public userPermission:any;
  public UserModulePermission:any;
  public UserModuleOperation:any;
  public OrganisationalChart:any;

  constructor(private cookieService: CookieService,private router: Router,private sharedService: SharedService,private _localStorageService:LocalStorageService) {
    this.showSubMenu= false;
    this.showPabxSubMenu = false;
    this.showRoleSubMenu = false;
    this.showUserSubMenu = false;
    this.UserMenu = {};
    this.userPermission=[];
    this.UserModulePermission=[];
    this.UserModuleOperation=[];
    this.OrganisationalChart = false;
    console.log("value of roleid is",router.url);
    if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      this.router.navigate(['/login']);
    }else{
      this.userPermission = JSON.parse(this._localStorageService.get('userPermission'));
      // console.log(this.userPermission);
      let UserModulePermissionArr:any = [];
      let UserModuleOperationArr:any = [];
      for (let key in this.userPermission) {
          if(key == 'OtherInfo'){
            let value = this.userPermission[key];
            for (let key2 in value) {
              let value2 = value[key2];
              value2.forEach((value3:any,key3:any) => {
                key3 =key3;
                if(value3.selected){
                  UserModulePermissionArr.push(value3.id);
                }
                for (let key4 in value3) {
                  let value4 = value3[key4];
                  if(key4 == 'operation_pages'){
                    for (let key5 in value4) {
                      let value5 = value4[key5];
                      if(value5.selected){
                        if(value5.selected){
                          UserModuleOperationArr.push(value5.id);
                        }
                      }
                    }
                  }
                }
                this.UserModuleOperation.push({'page_id':value3.id,'operations':UserModuleOperationArr});
                UserModuleOperationArr = [];
              });
            }
          }
          if(key == 'RoleInfo'){
            let value = this.userPermission[key];
            this.OrganisationalChart = value.organisation_chart ? true:false;
          }
      }
      this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
      this.UserModulePermission = UserModulePermissionArr;
    }
  }

  ngOnInit() {
  
  }

  checkUserPermission(menuId:any){
    //  console.log(menuId);
    //  console.log(this.UserModulePermission);
    return this.UserModulePermission.indexOf(menuId) > -1;
  }

  checkOperation(page_id:any,operation_id:any){
    let operations = [];
    for (let key in this.UserModuleOperation) {
      let value = this.UserModuleOperation[key];
      if(value.page_id == page_id){
        operations = value.operations;
      }
    }    
    return operations.indexOf(operation_id) > -1;
  }

  toggleSubMenu(){
    this.showSubMenu = !this.showSubMenu;
  }
  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }

  togglePabxSubMenu(){
    this.showPabxSubMenu = !this.showPabxSubMenu;
  }

  toggleRoleSubMenu(){
    this.showRoleSubMenu = !this.showRoleSubMenu;
  }

  toggleUserSubMenu(){
    this.showUserSubMenu = !this.showUserSubMenu;
  }
  
  addClass(me:any){
    $(".position-relative").children(':first-child').removeClass('sub-active');
    var submenuId = me.srcElement.attributes.id.nodeValue;
    var superParent = $("#"+submenuId).parent().parent();
    
    if(!superParent.children(':first-child').hasClass('sub-active')){
    superParent.children(':first-child').addClass('sub-active');
    }
  }

  removeClass(){
    $(".position-relative").children(':first-child').removeClass('sub-active');
  }
}

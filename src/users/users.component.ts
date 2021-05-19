import { Component, OnInit } from '@angular/core';
import { Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http,URLSearchParams } from '@angular/http';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
Pipe({
  name: 'SearchFilter'
 })

declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: [('./users.component.css').toString()]
})


export class UsersComponent implements OnInit {
  //UserList
  usersList:any[];
  searchableList:any;

  //Pagination
  isDesc: boolean = false;
  column: string = 'UserName';
  direction: number;

  //Language Boolean
  isLangArabic: boolean;

  //Edit Employee
  txtId:any;
  txtPassword:any;
  txtUserName:any;
  txtLanguage:any;
  txtReportingTo:any;
  txtRole:any;
  txtStatus:any;
  txtFirstName:any;
  txtLastName:any;
  setClickedRow:Function;
showMenu: boolean;

  constructor(private sharedService: SharedService ,private http:Http,private router: Router,private cookieService: CookieService,private _localStorageService:LocalStorageService) {
    this.usersList =[{
      MilitaryId:'',
      RoleId:'',
      username:'',
      reporting_to:'',
      status:''
    }];
    this.setClickedRow = function(emp:any){
      emp.highLightRow = !emp.highLightRow;
  }

    this.searchableList = ['MilitaryId','RoleId','username','primary_language', 'reporting_to','status'];

  }

  ngOnInit() {
    if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      this.router.navigate(['/login']);
    }else{
      this.loadCurrentLanguage();
      this.loadData();
    }
  }

  loadData(){
    this.http.get(environment.apikey+"/generateJsonUrl.php?action=listUserDetails")
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
         this.usersList = data;
      }
    });
  }

  loadCurrentLanguage(){
    if(this._localStorageService.get("CurrentLanguage") == 'en'){
      this.isLangArabic = false;
    }else{
      this.isLangArabic = true;
    }
  }
  // rankList: string[]  = ["Major","Lieutenant", "Colonel","Lt Colonel","Captain"];
  // rankListArabic: string[]  = ["رائد","ملازم", "عقيد","الملازم كولونيل","قائد المنتخب"];
  // statusList: string[]=  ["Active",'Deactive'];
  // companyListArabic: string[]=  ["العنق"];

  sort(property:any){
    this.isDesc = !this.isDesc; //change the direction
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  showEditUserPopup(user:any){
    this.txtId = user.MilitaryId;
    this.txtPassword=user.Password;
    this.txtUserName=user.UserName;
    this.txtLanguage =user.Language;
    this.txtReportingTo=user.ReportingTo;
    this.txtRole= user.Role;
    this.txtStatus=user.Status;
    this.txtFirstName=user.FirstName;
    this.txtLastName=user.LastName;
    $('#modalUserDetailEdit').modal('show');
  }

  deleteUser(id:any)
  {
    let body = new URLSearchParams();
    body.append('id', id);
    body.append('action', 'deleteUserDetails');
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .subscribe((data: any) => {
       this.loadData();
      }, error => {
        console.log(error.json());
      });

  }

  hidePopUp(popUpId:any)
  {
    $('#'+popUpId).modal('hide');
  }

  toggleMenu(){
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }
}

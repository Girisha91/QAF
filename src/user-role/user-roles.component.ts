import { Component } from '@angular/core';
import { Pipe } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
//import { PagerService } from './'
import { environment } from '../environments/environment';
import {SharedService} from '../app/shared.service';

Pipe({
  name: 'SearchFilter'
})

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: [('./user-roles.component.css').toString()]
})

export class UserRolesComponent {
  
  RolesDetails: any[];
  MyRoleId: any;
  showHideAllRows: boolean;
  showAdvanceSearch: boolean;
  selectedDeactivateEmployee : any;
  searchableList:any;
  isDesc: boolean = false;
  column: string = 'RoleName';
  subscription: Subscription;
  showMenu: boolean;
  setClickedRow:Function;
  
  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails :any[];

  pager: any = {};// pager object

  // paged items
  pagedItems: any[];

 // Declare local variable
 direction: number;
 isLangArabic : boolean;
 currentLanguage: string;

 // Change sort function to this: 

  constructor(private sharedService: SharedService,private router: Router,private cookieService: CookieService,private http:Http, private _translate: TranslateService) {

    let self = this;
    self.setClickedRow = function(role:any){
      role.highLightRow = !role.highLightRow;
  }
    //this.sort(this.column);
    self.RolesDetails = [{
      RoleId:'',
      RoleName:'',
      Descirption:'',
      Status:'',
    }];
   };

   ngOnInit() { 
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined"){
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if(userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1){
        this.MyRoleId = userCookie.RoleId;
        this.loadData();
        this.searchableList = ['RoleId','RoleName','Description','Status'];
        // this.sharedService.getVisibility().subscribe((value:any) => this.showMenu = value);
      }
    }else {
      this.router.navigate(['/login']);
    }
   }

  loadData(){
    this.currentLanguage = this._translate.currentLang;
    this.http.get(environment.apikey+"/generateJsonUrl.php?action=listRole&language="+ this.currentLanguage)
      .map(res => res.json())
      .subscribe(data => {
        if(!!data){
          for(var item in data){
            data[item]["Status"] =data[item].Status == 1? 'Active': 'Inactive';
           }
           this.RolesDetails = data;
        }
      });

    if(this.currentLanguage == 'en'){
      this.isLangArabic = false;
    }else {
      this.isLangArabic = true;
    }
  }

   

  sort(property:any){
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };
  
  toggleMenu(){
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }

};
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router, NavigationEnd } from '@angular/router';
import { SharedService } from '../shared.service';
import { CookieService } from 'angular2-cookie/core';
import { Http,URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { TranslateService } from '../shared/translate/translate.service';
import { AuthGuard } from '../shared/authguard.service';
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  environment: any = environment;
  currentLanguage: string;
  isLangArabic: boolean;
  isUserLoggedIn: boolean;
  userName: string;
  dashboard: string;
  profile_pic: string;
  userRoleId: any;
  headName:any;
  lnht: boolean;

  constructor(private router: Router,private http:Http,private cookieService: CookieService,private sharedService: SharedService,private _localStorageService:LocalStorageService,private _translate: TranslateService) {
    this._translate= this._translate;
    // this.router.events.subscribe(
    //   (event: any) => {
    //     if (event instanceof NavigationEnd) {
    //       this.headName = this.router.url;
    //     }
    //   }
    // );
   // this.headName = window.location.href.replace('http://localhost:4200/','');
    this.sharedService.userLoggedIn.subscribe( value => {
      this.isUserLoggedIn = value;
    });
    this.sharedService.LoggedInUserName.subscribe( value => {
      this.userName = value;
    });
    this.isLangArabic = false;
    this.sharedService.userProfileImage.subscribe(value => {this.profile_pic = value });
  }

  ngOnInit()
   {
    this.sharedService.currentDashboard.subscribe(value => {this.dashboard = value });
    this.profile_pic = typeof this._localStorageService.get('profile_pic') != 'undefined' ? this._localStorageService.get('profile_pic'):'';
   // this.headName=this.router.url;
    //this.headName = window.location.href.replace('http://localhost:4200/','');
    if(this.cookieService.get('user') != null && typeof this.cookieService.get('user') != "undefined")
    {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      this.userName = userCookie.username;
      this.dashboard = this.cookieService.get('dashboard');
    //  console.log(this.dashboard);
      this.userRoleId = this._localStorageService.get('userRoleId');
      this.loadCurrentLanguage();
      this.isUserLoggedIn = true;
    }else{
      this.dashboard = '/';
    }

    if(this.profile_pic == ''){
      this.lnht = true;
    } else {
      this.lnht = false;
    }
  }

  loadCurrentLanguage(){
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    
    if(this.currentLanguage == 'en'){
      this.isLangArabic = false;
    }else {
      this.isLangArabic = true;
    }
  }

  getEnStyleClass = function()  {  
    var status='';
    if(this._translate.currentLang == 'en'){
      this.isLangArabic = true;
      status = 'activate'; 
    }else {
      this.isLangArabic = false;
      status='not-active';
    }
    return status;
  }
  
  getArStyleClass = function()  { 
    if(this._translate.currentLang == 'ar'){
      return "activate" 
    }else {
      return 'not-active' 
    }
  }

  logout(){
    var userCookie = JSON.parse(this.cookieService.get('user'));
    // localStorage.clear();
    let body = new URLSearchParams();
    body.append('sessionId', userCookie.sessionId);
    this.http.post(environment.apikey+'/logout.php', body)
      .subscribe((data:any) => {
        if(data["_body"] == ""){
          this.isUserLoggedIn = false;
          this.cookieService.remove('user');
          this.cookieService.remove('dashboard');
          this._localStorageService.remove('userPermission');
          // this._localStorageService.set('isLogIn',false);
          this.sharedService.setUserLoggedIn(false);
          this.dashboard ='/';
          this.router.navigate(['/login']); 
        }
      }, error => {
          console.log(error.json());
      });
  }

}

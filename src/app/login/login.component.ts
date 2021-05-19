import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { TranslateService } from '../shared/translate/translate.service';
import { Router } from '@angular/router';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserRegisterComponent } from '../../user-register/user-register.component';
import { UserRequestPasswordComponent } from '../../user-request-password/user-request-password.component';
import { AuthGuard } from '../shared/authguard.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [('./login.component.css').toString()]
})

export class LoginComponent implements OnInit {
  bsModalRef: BsModalRef;
  public txtUserName: any;
  public txtPassword: any;
  public supportedLanguages: any[];
  public currentLanguage: any = 'ar';
  public isLangArabic:boolean;
  public errorMsg: string;
  environment: any = environment;
  public showLoader: boolean= false;
  constructor(private modalService: BsModalService, private sharedService: SharedService,private cookieService: CookieService,private http:Http,private router: Router, private _translate: TranslateService,private _localStorageService:LocalStorageService) { }

  ngOnInit() {
    
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined"){
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if(userCookie.sessionId != null ||userCookie.sessionId != '' && userCookie.status === 1){
        this.router.navigate(['/employee']);
        return;
      }
    }
    if(this._localStorageService.get("CurrentLanguage") != null){
      this._localStorageService.remove("CurrentLanguage");
    }

    this.supportedLanguages = [
      { display: 'English', value: 'en' },
      { display: 'عربى', value: 'ar' },
    ];

    this.selectLang(this.currentLanguage);
    this.showLoader = false;
  }

  


  isCurrentLang(lang: string) {
    // check if the selected lang is current lang
    return lang === this._translate.currentLang;
  }
  
  selectLang(lang: string) {
    // set current lang;
    this._translate.use(lang);
    this.currentLanguage = lang;
    if(lang == 'en'){
      this.isLangArabic = false;
    }else {
      this.isLangArabic = true;
    }
    this.sharedService.setCurrentLanguage(this.isLangArabic);
    this.reset();
  }

  login(){
    let ServeruserPermission: any;
    if((this.txtUserName == null && this.txtPassword == null) || (this.txtUserName == "" && this.txtPassword == "") ){
      this.errorMsg =this.currentLanguage == 'en'? "Please enter username or password." :"الرجاء إدخال اسم المستخدم أو كلمة المرور.";
      return false;
    }else{
      let body = new URLSearchParams();
      body.append('username', this.txtUserName);
      body.append('password', this.txtPassword);
      body.append('language', this.currentLanguage);
      body.append('action','login');

      this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(dataResp => {
        
        if(dataResp.code == 101){
          this.errorMsg =this.currentLanguage == 'en' ?"Unauthorized Users. Please check username or password.": "المستخدمون غير المصرح لهم، يرجى التحقق من اسم المستخدم أو كلمة المرور.";
          return false;
        }else{
          let obj = dataResp.data;
          
          if(obj.user['status'] == 1){
            this.errorMsg= null;
            this.cookieService.put('user',JSON.stringify(obj.user));
            ServeruserPermission = JSON.stringify(obj.userPermission);
            this._localStorageService.set('profile_pic',obj.user['profile_pic']);
            this._localStorageService.set('userRoleId',obj.user['RoleId']);
            this._localStorageService.set('userPermission',ServeruserPermission);
            this._localStorageService.set('CurrentLanguage', this.currentLanguage);
            // this._localStorageService.set('isLogIn',true);
            this.sharedService.setUserLoggedIn(true);
            this.sharedService.setMenuVisibility(true);
            this.sharedService.setCurrentLanguage(this.isLangArabic);
            this.sharedService.setUserProfilePic(obj.user['profile_pic'])
            this.sharedService.LoggedInUserName.next(obj.user['username']);
            let PageUrl:any = [];
            let UPermission = JSON.parse(ServeruserPermission);
            this.sharedService.setUserPermission(UPermission);
            
            for (let key in UPermission) {
              if(key == 'OtherInfo'){
                let value = UPermission[key];
                for (let key2 in value) {
                  let value2 = value[key2];
                  value2.forEach((value3:any,key3:any) => {
                    key3 = key3;
                    if(value3.selected){
                      PageUrl.push(value3.PageUrl);
                      return false;
                    }
                  });
                }
              }
            }
            if(obj.user['reset_pass'] == 1){

              let body = new URLSearchParams();
              body.append('username', this.txtUserName);
              body.append('reset_pass','0');
              body.append('action','forcechange');

              this.http.post(environment.apikey+'/generateJsonUrl.php', body)
              .map(res => res.json())
              .subscribe(dataResp => {
                dataResp = dataResp;
              }, error => {
                  console.log(error.json());
              });

              let r = confirm("Do you want to change Password?");
              if(r){
                this.router.navigate(['/user-profile']);
                return;
              }
            }
            
            // let PageUrlFinal = PageUrl.length ? PageUrl[0] :'/employee';
            if(PageUrl[0] == '/employee'){
              let PageUrlFinal = '/employee';
              this.cookieService.put('dashboard',PageUrlFinal);
              this.sharedService.setDashBoard(PageUrlFinal);
              this.router.navigate([PageUrlFinal]);
            }else{
              let PageUrlFinal = '/home';
              this.cookieService.put('dashboard',PageUrlFinal);
              this.sharedService.setDashBoard(PageUrlFinal);
              this.router.navigate([PageUrlFinal]);
            }
      
          }else {
            this.errorMsg =this.currentLanguage == 'en' ?"User is Inactive/Not Present. Please check username or password.": "المستخدم غير نشط / غير موجود. يرجى التحقق من اسم المستخدم أو كلمة المرور.";
            return false;
          }
        }
      }, error => {
          console.log(error.json());
      });
    }
  }

  reset(){
    this.errorMsg = "";
    this.txtUserName = "";
    this.txtPassword = "";
  }

  registercomponent() {
    const initialState = {
      title: 'Register'
    };
    this.bsModalRef = this.modalService.show(UserRegisterComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  passwordcomponent(){
    this.bsModalRef = this.modalService.show(UserRequestPasswordComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}

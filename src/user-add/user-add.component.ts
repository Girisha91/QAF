import { Component,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '../app/shared/translate/translate.service'
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-form.component.html',
  styleUrls: [('./user-add.component.css').toString()]
})

export class UserAddComponent implements OnInit{

  public user:any = {};
  public RolesDetails: any[];
  public UserDetails: any[];
  public primary_language: any[];
  public currentLanguage: any;

  constructor(private cookieService: CookieService, private http:Http, private router: Router, private _translate: TranslateService) {

    this.currentLanguage = this._translate.currentLang;
    this.user['primary_language'] = 'en';
    this.user['reporting_to'] = -1;
    this.user['RoleId'] = -1;

    this.http.get(environment.apikey+"/generateJsonUrl.php?action=listRole&method=drop")
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
         this.RolesDetails = data;
      }
    });

    this.http.get(environment.apikey+"/generateJsonUrl.php?action=listUserDetails&method=drop")
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
         this.UserDetails = data;
      }
    });

    this.primary_language = [{'id':'en','label':'English'},{'id':'ar','label':'Arabic'}];
  }

  ngOnInit() {
  	if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      this.router.navigate(['/login']);
    }else{
    }
  }

  trim(str:string){
    //return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    return str;
  }

  saveUser(){

    if(typeof (this.user['username']) == null  || typeof (this.user['MilitaryId']) == 'undefined' || typeof (this.user['mobile']) == 'undefined' || (this.user['RoleId']) == '-1' || typeof (this.user['primary_language']) == 'undefined' ||  (this.user['reporting_to']) == '-1'){
      alert('Please Provide the User Info.');
      return false;
    }

    let body = new URLSearchParams();
  	body.append('userDetails',JSON.stringify(this.user));
  	body.append('action','addUserDetails');

  	this.http.post(environment.apikey+'/generateJsonUrl.php', body)
  		.map(res => res.json())
  	    .subscribe(data => {
  	      if(data.code == 100){
  	        //this._translate.currentLang == 'en'
  	        this.closeAndRedirect();
  	      }else if(data.code == 101){
  	      	alert(data.message);
  	      }else{
  	      	alert("Role Not Stored. Please Check Logs.");
  	      }
  	    }, error => {
  	        console.log(error.json());
  	    });
  }

  WhiteSpaceUserName(event:any){
    if(event.keyCode == 32){
      return false;
    }
  }

  closeAndRedirect(){
  	this.router.navigate(['/users']);
  }
}

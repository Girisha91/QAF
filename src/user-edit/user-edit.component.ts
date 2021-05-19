import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-form.component.html',
  styleUrls: [('./user-form.component.css').toString()]
})

export class UserEditComponent implements OnInit{

  public user: any = {};
  public RolesDetails: Object = {};
  public Id: string;
  public currentLanguage: any;
  public UserDetails: Object = {};
  public primary_language: any[];
  
  constructor(private cookieService: CookieService,private http:Http, private _localStorageService:LocalStorageService, route: ActivatedRoute, private router: Router) {

    this.Id= route.snapshot.params['id'];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");

    this.http.get(environment.apikey+"/generateJsonUrl.php?action=listRole")
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

    let body = new URLSearchParams();
    body.append('action','viewUserDetails');
    body.append('id',this.Id);
    
    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
          if(!!data){
             this.user = data;
          }
        });

  }

  ngOnInit() {
  	if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      this.router.navigate(['/login']);
    }
  }

  saveUser(){

  	if(typeof (this.user['username']) == 'undefined' || typeof (this.user['MilitaryId']) == 'undefined' || typeof (this.user['mobile']) == 'undefined' || (this.user['RoleId']) == '-1' || (this.user['primary_language']) == '-1' ||  (this.user['reporting_to']) == '-1'){
      alert('Please Provide the User Info.');
      return false;
    }
  	
    let body = new URLSearchParams();
    body.append('userDetails',JSON.stringify(this.user));
    body.append('action','editUserDetails');
    body.append('id',this.Id);

  	this.http.post(environment.apikey+'/generateJsonUrl.php', body)
  		.map(res => res.json())
	    .subscribe(data => {
	      if(data.code == 100){
	        this.closeAndRedirect();
	      }else if(data.code == 101){
	      	alert(data.message);
	      }else{
	      	alert("User Not Stored. Please Check Logs.");
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

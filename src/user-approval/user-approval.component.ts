import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-approval-form.component.html',
  styleUrls: [('./user-approval-form.component.css').toString()]
})

export class UserApprovalComponent implements OnInit{

  public user: any = {};
  public RolesDetails: any[];
  public Id: string;
  public currentLanguage: any;
  public UserDetails: any[];
  public primary_language: any[];
  public approvalStatus: any[];

  constructor(private cookieService: CookieService,private http:Http, private _localStorageService:LocalStorageService, route: ActivatedRoute, private router: Router) {

    this.Id= route.snapshot.params['id'];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this.approvalStatus = [
      {id:0,label:'Rejected'},
      {id:1,label:'Approved'},
      {id:2,label:'Pending'}
    ];

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

    let body = new URLSearchParams();
    body.append('action','viewRequestDetails');
    body.append('id',this.Id);

    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
          if(!!data){
            if(data['extra_fields'] != ''){
              let XFields = JSON.parse(data['extra_fields']);
              for(let key in XFields) {
                let valueField = XFields[key];
                data[key]= valueField;
              }
            }
            this.user = data;
          }
        });

  }

  ngOnInit() {
    if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      this.router.navigate(['/login']);
    }
  }

  saveUser(status:any){

    let body = new URLSearchParams();

    if(status == 1 || status == 2){
      if( status == 1 && (typeof (this.user['username']) == 'undefined' || typeof (this.user['MilitaryId']) == 'undefined' || typeof (this.user['mobile']) == 'undefined' || typeof (this.user['RoleId']) == 'undefined' || typeof (this.user['primary_language']) == 'undefined' || typeof (this.user['reporting_to']) == 'undefined') ){
        alert('Please Provide the User Info.');
        return false;
      }

      body.append('userDetails',JSON.stringify(this.user));
      body.append('approvalStatus',status);
      body.append('action','approvalDetails');
      body.append('id',this.Id);
    }else if(status == 3){

      body.append('userDetails',JSON.stringify(this.user));
      body.append('approvalStatus','1');
      body.append('approvalPass','1');
      body.append('action','approvalDetails');
      body.append('id',this.Id);
    }

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
    this.router.navigate(['/user-requests']);
  }
}

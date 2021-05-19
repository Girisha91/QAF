import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { environment } from '../environments/environment';


@Component({
  selector: 'app-user-add',
  templateUrl: './user-register-form.component.html',
  styleUrls: [('./user-register-form.component.css').toString()]
})

export class UserRegisterComponent implements OnInit
{

  public user: any = {};
  successMessage: string;
      
  constructor(public bsModalRef: BsModalRef, private cookieService: CookieService, private http:Http,private router: Router) {
    
  }

  ngOnInit() {
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined"){
      var dashboard = this.cookieService.get('dashboard');
      this.router.navigate([dashboard]);
    }
    this.user['request_type'] = "REGISTER";
  }

  saveUser(){

    if(typeof (this.user['username']) == 'undefined' || typeof (this.user['MilitaryId']) == 'undefined' || typeof (this.user['mobile']) == 'undefined' || typeof (this.user['firstname']) == 'undefined' || typeof (this.user['lastname']) == 'undefined' || typeof (this.user['description']) == 'undefined'){
      alert('Please Provide the User Info.');
      return false;
    }
    
    let body = new URLSearchParams();
    body.append('userDetails',JSON.stringify(this.user));
    body.append('action','registerUserDetails');

    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
        .subscribe(data => {
          if(data.code == 100){
            this.successMessage = "Request Raised to Admin for Approval";
            this.user = [];
            this.user['request_type'] = "REGISTER";
            this.router.navigate(['/login']);
          }else if(data.code == 101){
            alert(data.message);
          }else{
            alert("Role Not Stored. Please Check Logs.");
          }
        }, error => {
            console.log(error.json());
        });
  }


  closeAndRedirect(){
    this.router.navigate(['/']);
  }
}

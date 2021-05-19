import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { Http } from '@angular/http';
import { URLSearchParams } from "@angular/http";
import { environment } from '../environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-user-request-password',
  templateUrl: './user-request-password-form.component.html',
  styleUrls: [('./user-request-password-form.component.css').toString()]
})

export class UserRequestPasswordComponent implements OnInit {
  
  public user: any = {};
  public successMessage:any;
  public isLangArabic:any;

  constructor(public bsModalRef: BsModalRef, private http:Http,private router: Router,private cookieService: CookieService) {
    this.user['primary_language'] = 'en';
  }

  ngOnInit() {
    
    this.isLangArabic = false;
    
    if(this.cookieService.get('user') != null || typeof this.cookieService.get('user') != "undefined"){
      this.router.navigate([this.cookieService.get('dashboard')]);
    }
  }

  requestPassword(){
    let body = new URLSearchParams();
    body.append('userDetails',JSON.stringify(this.user));
    body.append('action','requestPassword');

    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
        .subscribe(data => {       
          if(data.code == 100){
            this.successMessage = (data.message);
          }else {
            this.successMessage = (data.message);
          }
        }, error => {
            console.log(error.json());
        });
  }

  closeAndRedirect(){
    this.router.navigate(['/login']);
  }

}

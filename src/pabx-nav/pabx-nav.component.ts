import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { CookieService } from 'angular2-cookie/core';
declare var $: any;
@Component({
  selector: 'app-pabx-nav',
  templateUrl: './pabx-nav.component.html'
})

export class PabxNavComponent implements OnInit {

  
  constructor(private cookieService: CookieService,private router: Router,private _localStorageService:LocalStorageService) {
    
  }

  ngOnInit() {
    if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      this.router.navigate(['/login']);
    }else{
 
    }
  }

 
}

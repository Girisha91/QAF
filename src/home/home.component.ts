import { Component, OnInit } from '@angular/core';
import { SharedService } from '../app/shared.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: [('./home.component.css').toString()]

})
export class HomeComponent implements OnInit {
    showMenu: boolean;
    userRoleId: any;
    isLangArabic: boolean;
    currentLanguage: string;
    constructor(private sharedService: SharedService, private cookieService: CookieService, private router: Router, private _localStorageService: LocalStorageService, ) {  }
    ngOnInit() {
        let userpermission
        if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
            var userCookie = JSON.parse(this.cookieService.get('user'));
            if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
                this.userRoleId = this._localStorageService.get('userRoleId');
                this.currentLanguage = this._localStorageService.get("CurrentLanguage");
                userpermission = this._localStorageService.get("userPermission");
                this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
                if (this.currentLanguage == 'en') {
                    this.isLangArabic = false;
                  } else {
                    this.isLangArabic = true;
                  }
            }
            console.log("value of roleid is",this.userRoleId)
            console.log("value of userpermission is",userpermission)
        } else {
            this.router.navigate(['/login']);
        }
    }
    toggleMenu() {
        this.showMenu = !this.showMenu;
        this.sharedService.setMenuVisibility(this.showMenu);
    }
}
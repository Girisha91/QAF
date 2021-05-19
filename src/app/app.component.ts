// import { Component } from '@angular/core';
// import { TranslateService } from './shared/translate/translate.service';
// import { LocalStorageService } from 'angular-2-local-storage';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-root',
//   template: `
// <div class="container-fluid">
// <div class = "divwidth eng-nav">
// <app-nav *ngIf="router.url != '/login'" class="hidePrint"></app-nav>
// </div>
// <div class = "divwidthhead" [ngClass]="isLangArabic ? 'push-none':'push-right'">
// <header></header>
// <router-outlet></router-outlet>
// </div>

// <app-footer></app-footer>
// </div>
//   `
// })
// export class AppComponent {
//   currentLang:any;
//   public UserMenu:any;
//   public userPermission:any;
//   public UserModulePermission:any;
//   public UserModuleOperation:any;
//   public OrganisationalChart:any;
//   constructor(private _translate: TranslateService,private router: Router, private _localStorageService:LocalStorageService) {}
//   ngOnInit() {
//  if(this._localStorageService.get('CurrentLanguage') == null)
//      {
//       // set current langage
//       this.currentLang = 'ar'
//       this._localStorageService.set('CurrentLanguage', 'ar');
//     }else {
//       this.currentLang = this._localStorageService.get('CurrentLanguage');
//       this.userPermission = JSON.parse(this._localStorageService.get('userPermission'));
//       // console.log(this.userPermission);
//       let UserModulePermissionArr:any = [];
//       let UserModuleOperationArr:any = [];
//       for (let key in this.userPermission) {
//           if(key == 'OtherInfo'){
//             let value = this.userPermission[key];
//             for (let key2 in value) {
//               let value2 = value[key2];
//               value2.forEach((value3:any,key3:any) => {
//                 key3 =key3;
//                 if(value3.selected){
//                   UserModulePermissionArr.push(value3.id);
//                 }
//                 for (let key4 in value3) {
//                   let value4 = value3[key4];
//                   if(key4 == 'operation_pages'){
//                     for (let key5 in value4) {
//                       let value5 = value4[key5];
//                       if(value5.selected){
//                         if(value5.selected){
//                           UserModuleOperationArr.push(value5.id);
//                         }
//                       }
//                     }
//                   }
//                 }
//                 this.UserModuleOperation.push({'page_id':value3.id,'operations':UserModuleOperationArr});
//                 UserModuleOperationArr = [];
//               });
//             }
//           }
//           if(key == 'RoleInfo'){
//             let value = this.userPermission[key];
//             this.OrganisationalChart = value.organisation_chart ? true:false;
//           }
//       }
//       // this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
//       this.UserModulePermission = UserModulePermissionArr;
//     }
//     this._translate.use(this.currentLang);
//   }
// }

import { Component } from '@angular/core';
import { TranslateService } from './shared/translate/translate.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
@Component({
selector: 'app-root',
template: `
<div class="container-fluid" [ngClass]="router.url == '/login' ? 'login':'container-fluid'">
<div class = "divwidth eng-nav" [ngClass]="isLangArabic ? 'float-right':'float-left'">
<app-nav *ngIf="(router.url != '/login')&&(router.url != '/user/register')&&(router.url != '/user/requestpassword')"></app-nav>
</div>
<div class = "divwidthhead" [ngClass]="isLangArabic ? 'push-none':'push-right'" style="height: 100%;">
<header *ngIf="(router.url != '/login')&&(router.url != '/user/register')&&(router.url != '/user/requestpassword')"></header>
<router-outlet></router-outlet>
</div>
<app-footer></app-footer>
</div>
`,
styles: [`.login {background: #ffffff !important; height: 96vh;}`]
})
export class AppComponent {
currentLang: any;
currentLanguage: string;
isLangArabic: boolean;
constructor(private _translate: TranslateService, private sharedService: SharedService, private router: Router, private _localStorageService: LocalStorageService) {
this.sharedService.isArabic.subscribe(value => { this.isLangArabic = value });
}
ngOnInit() {
if (this._localStorageService.get('CurrentLanguage') == null) {
// set current langage
this.currentLang = 'ar'
this._localStorageService.set('CurrentLanguage', 'ar');
// this.loadCurrentLanguage();

} else {
this.currentLang = this._localStorageService.get('CurrentLanguage');
if (this.currentLang == 'en') {
this.isLangArabic = false;
} else {
this.isLangArabic = true;
}
}
this._translate.use(this.currentLang);
}
}
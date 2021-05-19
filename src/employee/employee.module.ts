import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
import { SharedService } from '../app/shared.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { TranslateService }   from '../app/translate/translate.service';
import { TRANSLATION_PROVIDERS}   from '../app/translate/translation';
import { FileUtil } from '../app/file.util';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
//import { FilterPipe } from './../app/genericSearch.pipe';
//import { OrderrByPipe } from './../app/orderBy.pipe';
import {EmployeeSearchPipe} from '../app/employee.pipe';
import { TranslatePipe } from '../app/shared/translate/translate.pipe';
//import {NavComponent} from '../nav/nav.component';
//import { BsModalModule } from 'ng2-bs3-modal';
// containers
import { EmployeeComponent } from './employee.component';
import { CommonModule } from '@angular/common';
import { Ng2PaginationModule } from 'ng2-pagination';

// routes
export const ROUTES: Routes = [
  { path: '', component: EmployeeComponent }
];

@NgModule({
  imports: [
    CommonModule ,
    RouterModule.forChild(ROUTES),
    FormsModule,
    HttpModule,
    SharedModule,
    BsModalModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
  }),
  Ng2PaginationModule
  ],
  providers: [CookieService],

  declarations: [
    EmployeeComponent,
    EmployeeSearchPipe
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class EmployeeModule {}
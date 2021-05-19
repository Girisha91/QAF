import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
import { SharedService } from '../app/shared.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
//import { TranslateService }   from './../app/translate/translate.service';
//import { TRANSLATION_PROVIDERS}   from './../app/translate/translation';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../app/shared/translate/translate.pipe';
// containers
import { UsersComponent } from './users.component';
import { CommonModule } from '@angular/common';
import { Ng2PaginationModule } from 'ng2-pagination';
import { BsModalModule } from 'ng2-bs3-modal';
//import { FilterPipe } from './../app/genericSearch.pipe';
//import { OrderrByPipe } from './../app/orderBy.pipe';

// routes
export const ROUTES: Routes = [
  { path: '', component: UsersComponent }
];

@NgModule({
  imports: [
    CommonModule ,
    RouterModule.forChild(ROUTES),
    FormsModule,
    HttpModule,
    BsModalModule,
    SharedModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
  }),
  Ng2PaginationModule
  ],
  providers: [CookieService,SharedService],

  declarations: [
    UsersComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class UsersModule {}
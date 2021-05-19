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
import { UserRoleEditComponent } from './user-role-edit.component';
import { CommonModule } from '@angular/common';
// routes
export const ROUTES: Routes = [
  { path: '', component: UserRoleEditComponent }
];

@NgModule({
  imports: [
    CommonModule ,
    RouterModule.forChild(ROUTES),
    FormsModule,
    HttpModule,
    SharedModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
  })
  ],
  providers: [CookieService,SharedService],

  declarations: [
    UserRoleEditComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class UserRoleEditModule {}
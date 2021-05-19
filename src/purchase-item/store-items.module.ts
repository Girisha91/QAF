import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Pipe } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
// import { SharedService } from './../app/shared.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
// import { TranslateService } from './../app/translate/translate.service';
// import { TRANSLATION_PROVIDERS } from './../app/translate/translation';
// import { FileUtil } from './../app/file.util';
import { HttpModule } from '@angular/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';

// import { EmployeeSearchPipe } from './../app/employee.pipe';
// import { TranslatePipe } from './../app/shared/translate/translate.pipe';
// containers
import { StoreItemsComponent } from './store-items.component';
import { CommonModule } from '@angular/common';
import { Ng2PaginationModule } from 'ng2-pagination';
import { OrderrByPipe } from '../app/orderBy.pipe';
import { StoreItemsSearchPipe } from '../app/storepipes/store-items.pipe';
// routes
export const ROUTES: Routes = [
  { path: '', component: StoreItemsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BsDatepickerModule,
    SharedModule,
    BsModalModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    Ng2PaginationModule
  ],
  providers: [CookieService,StoreItemsSearchPipe],
  exports: [OrderrByPipe],
  declarations: [
    StoreItemsComponent,
    StoreItemsSearchPipe,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StoreItemsModule { }
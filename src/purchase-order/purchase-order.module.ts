import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
import { SharedService } from '../app/shared.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
//import { TranslateService }   from './../app/translate/translate.service';
//import { TRANSLATION_PROVIDERS}   from './../app/translate/translation';
import { HttpModule } from '@angular/http';
import { TranslatePipe } from '../app/shared/translate/translate.pipe';
// containers
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PurchaseOrderComponent } from './purchase-order.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
// routes
export const ROUTES: Routes = [
  { path: '', component: PurchaseOrderComponent }
];

@NgModule({
  imports: [
    CommonModule ,
    NgSelectModule,
    RouterModule.forChild(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    BsDatepickerModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
  })
  ],
  providers: [CookieService,SharedService],

  declarations: [
    PurchaseOrderComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class PurchaseOrderModule {}
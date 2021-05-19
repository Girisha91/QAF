import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
import { storewithoutPoComponent } from './store-withoutpo.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2PaginationModule } from 'ng2-pagination';
export const ROUTES: Routes = [
  { path: '', component: storewithoutPoComponent }
];

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    RouterModule.forChild(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    BsModalModule,
    BsDatepickerModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    Ng2PaginationModule
  ],
  providers: [CookieService],

  declarations: [
    storewithoutPoComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class storewithoutPoModule { }

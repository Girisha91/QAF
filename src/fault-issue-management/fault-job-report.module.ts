import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { HttpModule } from '@angular/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common'
import { fJReportComponent } from './fault-job-report.component';
import { CommonModule } from '@angular/common';
import { Ng2PaginationModule } from 'ng2-pagination';

// routes
export const ROUTES: Routes = [
  { path: '', component: fJReportComponent }
];

@NgModule({
  imports: [
    CommonModule ,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    NgSelectModule,
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
  providers: [CookieService,DatePipe],

  declarations: [
    fJReportComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class fJReportModule {}
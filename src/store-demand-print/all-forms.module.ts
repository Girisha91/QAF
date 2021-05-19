import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { issuePrintComponent } from './issue.component';
import { faultPrintComponent } from './fault.component';
import { repairPrintComponent } from './repair.component';
import { loanPrintComponent } from './loan.component';
import { loanexchangePrintComponent } from './loan-exchange.component';
import { storeWoPoPrintPageComponent } from './store-wo-po.component';

import { CommonModule } from '@angular/common';
export const ROUTES: Routes = [
  { path: 'issue/:id', component: issuePrintComponent },
  { path: 'faulty/:id', component: faultPrintComponent },
  { path: 'repair/:id', component: repairPrintComponent },
  { path: 'LoanForm/:id', component: loanPrintComponent },
  { path: 'loanReturn/:id', component: loanexchangePrintComponent },
  { path: 'oldLoanItem/:id', component: storeWoPoPrintPageComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    SharedModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    })
  ],
  providers: [CookieService],
  declarations: [
    issuePrintComponent,
    faultPrintComponent,
    repairPrintComponent,
    loanPrintComponent,
    loanexchangePrintComponent,
    storeWoPoPrintPageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AllFormsPrintModule { }

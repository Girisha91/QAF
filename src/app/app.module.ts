import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { TranslatePipe } from './shared/translate/translate.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from './shared/shared.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HttpModule } from '@angular/http';
import { CustomPreloadingStrategy } from './customPreload';
import { DatepickerModule } from "ngx-bootstrap";
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap';
import { SharedService } from './shared.service';
// containers
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserRequestPasswordComponent } from '../user-request-password/user-request-password.component';
import { AuthGuard } from './shared/authguard.service';
// routes
export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employee', loadChildren: '../employee/employee.module#EmployeeModule', canActivate: [AuthGuard] },
  { path: 'AddNewEmployee', loadChildren: '../add-new-employee/add-new-employee.module#AddNewEmployeeModule', canActivate: [AuthGuard] },
  { path: 'updateEmployee/:id', loadChildren: '../update-employee/update-employee.module#UpdateEmployeeModule', canActivate: [AuthGuard] },
  { path: 'viewEmployee/:id', loadChildren: '../view-employee/view-employee.module#ViewEmployeeModule', canActivate: [AuthGuard] },
  { path: 'user-profile', loadChildren: '../user-profile/user-profile.module#UserProfileModule' },
  { path: 'user/register', component: UserRegisterComponent},
  { path: 'user/requestpassword', component: UserRequestPasswordComponent},
  { path: 'users/request/:id', loadChildren: '../user-approval/user-approval.module#UserApprovalModule', canActivate: [AuthGuard] },
  { path: 'user-requests', loadChildren: '../user-request/user-request.module#UserRequestModule', canActivate: [AuthGuard]},
  { path: 'users', loadChildren: '../users/users.module#UsersModule', canActivate: [AuthGuard] },
  { path: 'user/edit/:id', loadChildren: '../user-edit/user-edit.module#UserEditModule', canActivate: [AuthGuard] },
  { path: 'users/add', loadChildren: '../user-add/user-add.module#UserAddModule', canActivate: [AuthGuard] },
  { path: 'user-role', loadChildren: '../user-role/users-role.module#UserRolesModule', canActivate: [AuthGuard] },
  { path: 'user-role/add', loadChildren: '../user-role-add/user-role-add.module#UserRoleAddModule', canActivate: [AuthGuard] },
  { path: 'user-role/edit/:id', loadChildren: '../user-role-edit/user-role-edit.module#UserRoleEditModule', canActivate: [AuthGuard] },
  { path: 'pabx/entities', loadChildren: '../pabx-entities/pabx-entities.module#PabxEntitiesModule', canActivate: [AuthGuard] },
  { path: 'pabx/free-address', loadChildren: '../pabx-freeAddress/pabx-freeAddress.module#PabxFreeAddressModule', canActivate: [AuthGuard] },
  { path: 'pabx/pcs-Address', loadChildren: '../pabx-pcsAddress/pabx-pcsAddress.module#PabxPcsAddressModule', canActivate: [AuthGuard] },
  { path: 'pabx/routingTable', loadChildren: '../pabx-routingTable/pabx-routingTable.module#PabxRoutingTableModule', canActivate: [AuthGuard] },
  { path: 'pabx/softpack', loadChildren: '../pabx-softpack/pabx-softpack.module#PabxSoftPackModule', canActivate: [AuthGuard] },
  { path: 'pabx/trunk', loadChildren: '../pabx-trunk/pabx-trunk.module#PabxTrunkModule', canActivate: [AuthGuard] },
  { path: 'pabx/tsc-Ip-attendent', loadChildren: '../pabx-tscIp-attendent/pabx-tscIp-attendent.module#PabxTscIpAttendentModule', canActivate: [AuthGuard] },
  { path: 'pabx/tsc-Ip-user', loadChildren: '../pabx-tscIp-user/pabx-tscIp-user.module#PabxTscIpUserModule', canActivate: [AuthGuard] },
  { path: 'pabx/user-all-nodes', loadChildren: '../pabx-user_allNodes/pabx-user_allNodes.module#PabxUserAllNodesModule', canActivate: [AuthGuard] },
  // can activate is not done to below
  { path: 'pabx/user-all-nodes/view/:id', loadChildren: '../pabx-user_allNodes/user_allNodes.module#userAllNodesModule' },
  { path: 'pabx/topology', loadChildren: '../pabx-topology/pabx-topology.module#PabxTopologyModule', canActivate: [AuthGuard] },
  { path: 'pabx/xlsheet', loadChildren: '../pabx-xlsheet/pabx-xlsheet.module#PabxXlsheetModule', canActivate: [AuthGuard] },
  //listing
  { path: 'pabx/configuration-info', loadChildren: '../pabx-configurationInfo/pabx-configurationInfo.module#PabxConfigurationInfoModule', canActivate: [AuthGuard] },
  { path: 'pabx/external-lines', loadChildren: '../pabx-externalLines/pabx-externalLines.module#PabxExternalLinesModule', canActivate: [AuthGuard] },
  { path: 'pabx/switch-info', loadChildren: '../pabx-switchInfo/pabx-switchInfo.module#PabxSwitchInfoModule', canActivate: [AuthGuard] },

  //operations
  { path: 'pabx/configuration-info/:action', loadChildren: '../pabx-configurationInfo/configurationInfo.module#ConfigurationInfoModule', canActivate: [AuthGuard] },
  { path: 'pabx/configuration-info/:action/:id', loadChildren: '../pabx-configurationInfo/configurationInfo.module#ConfigurationInfoModule', canActivate: [AuthGuard] },


  { path: 'pabx/external-lines/:action', loadChildren: '../pabx-externalLines/externalLines.module#ExternalLinesModule', canActivate: [AuthGuard] },
  { path: 'pabx/external-lines/:action/:id', loadChildren: '../pabx-externalLines/externalLines.module#ExternalLinesModule', canActivate: [AuthGuard] },
  { path: 'pabx/external-lines-rent/:action/:id', loadChildren: '../pabx-externalLines-rent/externalLinesRent.module#ExternalLinesRentModule', canActivate: [AuthGuard] },

 { path: 'pabx/switch-info/:action', loadChildren: '../pabx-switchInfo/switchInfo.module#SwitchInfoModule', canActivate: [AuthGuard] },
  { path: 'pabx/switch-info/:action/:id', loadChildren: '../pabx-switchInfo/switchInfo.module#SwitchInfoModule', canActivate: [AuthGuard] },
  //Stores

  { path: 'store', loadChildren: '../store/store.module#StoreModule', canActivate: [AuthGuard] },
  { path: 'store-items', loadChildren: '../purchase-item/store-items.module#StoreItemsModule' , canActivate: [AuthGuard]},
  { path: 'store/purchase-order/:action', loadChildren: '../purchase-order/purchase-order.module#PurchaseOrderModule' , canActivate: [AuthGuard]},
  { path: 'store/purchase-order/:action/:id', loadChildren: '../purchase-order/purchase-order.module#PurchaseOrderModule' , canActivate: [AuthGuard]},
  { path: 'store-items/purchase-item/:action', loadChildren: '../purchase-item/purchase-item.module#PurchaseItemModule', canActivate: [AuthGuard] },
  { path: 'store-items/purchase-item/:action/:id', loadChildren: '../purchase-item/purchase-item.module#PurchaseItemModule' , canActivate: [AuthGuard]},
  { path: 'StoreItemList', loadChildren: '../purchase-item/store-itemList.module#StoreItemListModule' , canActivate: [AuthGuard]},
  { path: 'store-transaction', loadChildren: '../store-transaction/store-transaction.module#StoreTransactionModule' , canActivate: [AuthGuard]},
  { path: 'store/supplier', loadChildren: '../supplier/store-supplier.module#StoreSupplierModule' , canActivate: [AuthGuard]},
  { path: 'store/supplier/:action', loadChildren: '../supplier/supplier.module#SupplierModule' , canActivate: [AuthGuard]},
  { path: 'store/supplier/:action/:id', loadChildren: '../supplier/supplier.module#SupplierModule' , canActivate: [AuthGuard]},
  
  { path: 'store/demandBookList', loadChildren: '../store-demandbook-list/demandBookList.module#DemandBookListModule' , canActivate: [AuthGuard]},
  { path: 'StoreMaterialForm', loadChildren: '../store-materailadd/store-material.module#StoreMaterialFormModule', canActivate: [AuthGuard] },
  { path: 'StoreMaterialForm/:action', loadChildren: '../store-materailadd/store-material.module#StoreMaterialFormModule', canActivate: [AuthGuard] },
  { path: 'StoreMaterialForm/:action/:id', loadChildren: '../store-materailadd/store-material.module#StoreMaterialFormModule', canActivate: [AuthGuard] },
  // start from below 
  { path: 'blockWiringList', loadChildren: '../block-wiring/blockWiringList.module#blockWiringListModule', canActivate: [AuthGuard] },
  { path: 'blockWiringList/:action', loadChildren: '../block-wiring/blockWiringForm.module#blockWiringFormModule', canActivate: [AuthGuard] },
  { path: 'blockWiringList/:action/:id', loadChildren: '../block-wiring/blockWiringForm.module#blockWiringFormModule', canActivate: [AuthGuard] },
  { path: 'blockWiringAttach/:action/:id', loadChildren: '../block-wiring-attach/blockWiringAttach.module#blockWiringAttachModule', canActivate: [AuthGuard] },
  { path: 'workOrder', loadChildren: '../work-order/work-order.module#WorkOrderModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-exchange-info', loadChildren: '../work-order/work-order-exchange.module#WorkOrderFormExchangeModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-exchange-info/:action', loadChildren: '../work-order/work-order-exchange.module#WorkOrderFormExchangeModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-exchange-info/:action/:id', loadChildren: '../work-order/work-order-exchange.module#WorkOrderFormExchangeModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-dp-info', loadChildren: '../work-order/work-order-dp.module#WorkOrderFormDPModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-dp-info/:action', loadChildren: '../work-order/work-order-dp.module#WorkOrderFormDPModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-dp-info/:action/:id', loadChildren: '../work-order/work-order-dp.module#WorkOrderFormDPModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-general-info', loadChildren: '../work-order/work-order-general.module#WorkOrderFormGeneralModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-general-info/:action', loadChildren: '../work-order/work-order-general.module#WorkOrderFormGeneralModule', canActivate: [AuthGuard] },
  { path: 'work-order-form-general-info/:action/:id', loadChildren: '../work-order/work-order-general.module#WorkOrderFormGeneralModule', canActivate: [AuthGuard] },
 
  
  { path: 'StoreItemForm', loadChildren: '../storeitem-add/storeItemForm.module#StoreItemFormModule', canActivate: [AuthGuard] },
  { path: 'StoreItemForm/:action', loadChildren: '../storeitem-add/storeItemForm.module#StoreItemFormModule', canActivate: [AuthGuard] },
  { path: 'StoreItemForm/:action/:id', loadChildren: '../storeitem-add/storeItemForm.module#StoreItemFormModule', canActivate: [AuthGuard] },
  { path: 'storeReport', loadChildren: '../store-report/store-report.module#storeReportModule', canActivate: [AuthGuard] },
  { path: 'storeReport/:action', loadChildren: '../store-report/store-report.module#storeReportModule', canActivate: [AuthGuard] },
  { path: 'storeReport/:action/:id', loadChildren: '../store-report/store-report.module#storeReportModule', canActivate: [AuthGuard] },
  { path: 'demandBookForm', loadChildren: '../store-demandbook-form/demandBookForm.module#DemandBookFormModule', canActivate: [AuthGuard] },
  { path: 'demandBookForm/:action', loadChildren: '../store-demandbook-form/demandBookForm.module#DemandBookFormModule', canActivate: [AuthGuard] },
  { path: 'demandBookForm/:action/:id', loadChildren: '../store-demandbook-form/demandBookForm.module#DemandBookFormModule', canActivate: [AuthGuard] },
  { path: 'storewithoutPo', loadChildren: '../store-withoutpo/store-withoutpo.module#storewithoutPoModule', canActivate: [AuthGuard] },
  { path: 'storewithoutPo/:action', loadChildren: '../store-withoutpo/store-withoutpo.module#storewithoutPoModule', canActivate: [AuthGuard] },
  { path: 'storewithoutPo/:action/:id', loadChildren: '../store-withoutpo/store-withoutpo.module#storewithoutPoModule', canActivate: [AuthGuard] },
  { path: 'demandPrint', loadChildren: '../store-demandprint-form/demandPrint.module#DemandPrintModule', canActivate: [AuthGuard] },
  { path: 'demandPrint/:action', loadChildren: '../store-demandprint-form/demandPrint.module#DemandPrintModule', canActivate: [AuthGuard] },
  { path: 'demandPrint/:action/:id', loadChildren: '../store-demandprint-form/demandPrint.module#DemandPrintModule', canActivate: [AuthGuard] },

  
  { path: 'faultIssueManagement',loadChildren: '../fault-issue-management/fault-issue-management.module#FaultIssueManagementModule', canActivate: [AuthGuard]},
  { path: 'AddJobFault',loadChildren: '../fault-issue-management/add-job-fault-form.module#AddJobFaultModule', canActivate: [AuthGuard]},
  { path: 'AddJobFault/:action', loadChildren: '../fault-issue-management/add-job-fault-form.module#AddJobFaultModule', canActivate: [AuthGuard] },
  { path: 'AddJobFault/:action/:id', loadChildren: '../fault-issue-management/add-job-fault-form.module#AddJobFaultModule', canActivate: [AuthGuard] },
  { path: 'fj-report',loadChildren: '../fault-issue-management/fault-job-report.module#fJReportModule', canActivate: [AuthGuard]},
  { path: 'print',loadChildren: '../store-demand-print/all-forms.module#AllFormsPrintModule', canActivate: [AuthGuard]}
];
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    NgSelectModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(ROUTES,
      {
        preloadingStrategy: CustomPreloadingStrategy
      }),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    HttpModule,
    FormsModule,
    SharedModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    HomeComponent,
    AppComponent,
    LoginComponent,
    UserRegisterComponent,
    UserRequestPasswordComponent,
    HeaderComponent,
    FooterComponent,
    
  ],
  providers: [CookieService, CustomPreloadingStrategy, SharedService, BsModalService, AuthGuard],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [UserRegisterComponent, UserRequestPasswordComponent],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }

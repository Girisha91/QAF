import { NgModule,ModuleWithProviders } from '@angular/core';
import { TranslatePipe }   from './translate/translate.pipe';
import { TranslateService }   from './translate/translate.service';
import { TRANSLATION_PROVIDERS}   from './translate/translation';
import { SharedService } from '../shared.service';
import { NavComponent } from '../../nav/nav.component';
import { PabxNavComponent } from '../../pabx-nav/pabx-nav.component';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {FilterPipe} from '../genericSearch.pipe';
import { OrderrByPipe } from '../orderBy.pipe';
import { FileUtil } from '../file.util';
import { ExcelService } from './excel.service';
import { ExcelServiceWorkBook } from './excelworksheet.service';
import { SafePipe } from './safe-img-upload.pipe';
@NgModule({
  imports:      [RouterModule, CommonModule,ReactiveFormsModule],
    declarations: [
      NavComponent,
        TranslatePipe,
        FilterPipe,
        SafePipe,
        OrderrByPipe,
        PabxNavComponent
      ],
  providers: [ExcelService,ExcelServiceWorkBook,FileUtil],
  exports: [
    NavComponent,
    PabxNavComponent,
    FilterPipe,
    SafePipe,
    TranslatePipe,
    CommonModule, 
    FormsModule,
    OrderrByPipe
  ],
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [TRANSLATION_PROVIDERS, TranslateService,SharedService]
    };
  }
}
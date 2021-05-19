import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../app/shared/shared.module';
import { SharedService } from '../app/shared.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { TranslateService }   from '../app/translate/translate.service';
import { TRANSLATION_PROVIDERS}   from '../app/translate/translation';
import { HttpModule } from '@angular/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { pabxTopologySearchPipe } from '../app/pabxPipes/pabxTopology.pipe';
import { TranslatePipe } from '../app/shared/translate/translate.pipe';
// containers
import { PabxTopologyComponent } from './pabx-topology.component';
import { CommonModule } from '@angular/common';
import { Ng2PaginationModule } from 'ng2-pagination';
import { ImageViewerModule,ImageViewerConfig } from "ngx-image-viewer";
// routes
export const ROUTES: Routes = [
  { path: '', component: PabxTopologyComponent }
];

const imageConfig:ImageViewerConfig={
  btnClass: 'default', // The CSS class(es) that will apply to the buttons
  zoomFactor: 0.1, // The amount that the scale will be increased by
  containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
  wheelZoom: true, // If true, the mouse wheel can be used to zoom in
  allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
  allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
  btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
    zoomIn: 'fa fa-plus',
    zoomOut: 'fa fa-minus',
    rotateClockwise: 'fa fa-repeat',
    rotateCounterClockwise: 'fa fa-undo',
    next: 'fa fa-arrow-right',
    prev: 'fa fa-arrow-left',
    fullscreen: 'fa fa-arrows-alt',
  },
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: true,
    rotateCounterClockwise: true,
    next: true,
    prev: true
  }
};

@NgModule({
  imports: [
    CommonModule ,
    RouterModule.forChild(ROUTES),
    ImageViewerModule,
    FormsModule,
    ReactiveFormsModule,
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
    PabxTopologyComponent,
    pabxTopologySearchPipe
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class PabxTopologyModule {}

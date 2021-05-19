import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { TranslateService } from '../shared/translate/translate.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentLanguage: string;
  isLangArabic: boolean;
  constructor(private sharedService: SharedService,private _localStorageService:LocalStorageService,private _translate: TranslateService) {
    
    this.sharedService.isArabic.subscribe(value => {this.isLangArabic = value });
   }

  ngOnInit() {
   this.loadCurrentLanguage();
  }

  loadCurrentLanguage(){
    this.currentLanguage = this._translate.currentLang;
    
    if(this.currentLanguage == 'en'){
      this.isLangArabic = false;
    }else {
      this.isLangArabic = true;
    }
  }

}

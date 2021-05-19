import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class SharedService {
    public IsUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public LoggedInUserName: Subject<string> = new Subject<string>();
    public showMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public UserProfilePic: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public isArabic: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public setDashboard: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private uP: BehaviorSubject<any> = new BehaviorSubject<any>('');
//this._localStorageService.get('MenuVisibilityStatus');


    constructor(private _localStorageService:LocalStorageService) { }
    
    currentMenuStatus = this.showMenu.asObservable();
    userLoggedIn = this.IsUserLoggedIn.asObservable();
    userProfileImage = this.UserProfilePic.asObservable();
    isCurrentlanguageArabic = this.isArabic.asObservable();
    currentDashboard = this.setDashboard.asObservable();
userPermission = this.uP.asObservable();
    setMenuVisibility(value: boolean) {
        this._localStorageService.set('MenuVisibilityStatus', value);
        this.showMenu.next(value);
    }

    setCurrentLanguage(value:boolean){
        this.isArabic.next(value);
    }

    setUserProfilePic(value:string){
        this.UserProfilePic.next(value);
    }

    setUserLoggedIn(value: boolean) {
        this.IsUserLoggedIn.next(value);
    }

    getVisibility = function(){
        return this.showMenu.asObservable();
    }
    setDashBoard(value:string){
        this.setDashboard.next(value);
      //  console.log(value);
    }

    setUserPermission(value: any){
        this.uP.next(value);
    }
}
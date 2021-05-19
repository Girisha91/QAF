import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Router } from '@angular/router';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { SharedService } from '../app/shared.service';
import { environment } from '../environments/environment';

@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: [('./user-profile.component.css').toString()]
})

export class UserProfileComponent implements OnInit {

	public username: any;
	public userProfile: any = {};
	public isUserLoggedIn: boolean = true;
	constructor(private sharedService: SharedService, private cookieService: CookieService, private http: Http, private router: Router, private _localStorageService: LocalStorageService) {

	}

	ngOnInit() {
		if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
			var userCookie = JSON.parse(this.cookieService.get('user'));
			this.username = userCookie.username;

			let body = new URLSearchParams();
			body.append('action', 'viewProfile');
			body.append('username', this.username);

			this.http.post(environment.apikey + '/generateJsonUrl.php', body)
				.map(res => res.json())
				.subscribe(data => {
					if (!!data) {
						this.userProfile = data;
					}
				});
		}
	}

	saveProfile() {
		let body = new URLSearchParams();
		body.append('userProfile', JSON.stringify(this.userProfile));
		body.append('action', 'saveProfile');
		body.append('username', this.username);

		this.http.post(environment.apikey + '/generateJsonUrl.php', body)
			.map(res => res.json())
			.subscribe(data => {
				if (data.code == 100) {
					//this._translate.currentLang == 'en'
					//this.closeAndRedirect();
					alert(data.message);
					this.sharedService.setUserProfilePic((this.userProfile['profile_pic']));
					this.userProfile['txtOldPassword'] = '';
					this.userProfile['txtNewPassword'] = '';
					this.userProfile['txtConfirmPassword'] = '';
					//added.

				}
				else if (data.code == 104) {
					alert(data.message);
					this.logout();
				}
				else {
					alert(data.message);
				}
			}, error => {
				console.log(error.json());
			});
	}

	fileChangeListener(event: any): void {
		//file upload event  
		var target = event.target || event.srcElement;
		var files = target.files;

    /*if(!this._fileUtil.isCSVFile(files[0])){
      alert(this._translate.currentLang == 'en'?"Please import valid .csv file.":"الرجاء استيراد ملف .csv صالح.");
      this.fileReset();
    }*/

		let fileList: FileList = event.target.files;
		if (files && fileList.length > 0) {
			let file: File = fileList[0];
			let formData: FormData = new FormData();
			formData.append('action', "profilePic");
			formData.append('profilePic', file, file.name);
			let headers = new Headers()
			//headers.append('Content-Type', 'json');  
			//headers.append('Accept', 'application/json');  
			let options = new RequestOptions({ headers: headers });
			this.http.post(environment.apikey + "/generateJsonUrl.php", formData, options)
				.map(res => res.json())
				.subscribe(dataRes => {
					this.userProfile['profile_pic'] = environment.apikey + dataRes.data;
				}, error => {
					console.log(error.json());
				});

		}
	}

	closeAndRedirect() {
		this.router.navigate([this.cookieService.get('dashboard')]);
	}

	logout() {
		var userCookie = JSON.parse(this.cookieService.get('user'));

		let body = new URLSearchParams();
		body.append('sessionId', userCookie.sessionId);
		this.http.post(environment.apikey + '/logout.php', body)
			.subscribe((data: any) => {
				if (data["_body"] == "") {
					this.isUserLoggedIn = false;
					this.cookieService.remove('user');
					this._localStorageService.remove('userPermission');
					this.router.navigate(['/login']);
				}
			}, error => {
				console.log(error.json());
			});
	}

}

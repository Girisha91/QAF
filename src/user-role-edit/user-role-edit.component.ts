import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute,Router } from '@angular/router';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-user-role-edit',
  templateUrl: './user-role-edit.component.html',
  styleUrls: [('./user-role-edit.component.css').toString()]
})

export class UserRoleEditComponent implements OnInit{

	currentLanguage: string;
	public RoleId: string;
	public pages: any[];
	public userRole:any = {};
	public pageRole:any = {};
	public operation_pages: any[];
	public page_fields: any[];
	public hidePermissions:any;
  	public modified:any;
  
  	constructor(private cookieService: CookieService,private http:Http, private _localStorageService:LocalStorageService, route: ActivatedRoute, private router: Router) {
  	
	  	this.hidePermissions = true;
	  	this.RoleId= route.snapshot.params['id'];
	  	this.currentLanguage = this._localStorageService.get("CurrentLanguage");

	  	let body = new URLSearchParams();
	  	body.append('action','viewRole');
		body.append('id',this.RoleId);

		this.http.post(environment.apikey+'/generateJsonUrl.php', body)
		.map(res => res.json())
		.subscribe(data => {
	      	if(!!data){
		      	this.userRole = data.RoleInfo;
		        this.pages = data.OtherInfo.pages;
	      	}
	    });
  	}

  	ShowRolePermissions(){
  		this.hidePermissions = !this.hidePermissions;
  	}

  	selectPage(page:any) {
	  	this.pageRole['page_id'] = page;
	  	this.hidePermissions = false;
	    this.operation_pages = Object.assign([], this.pages).filter(
		      item => item.id == page
		   )[0].operation_pages;
		this.page_fields = Object.assign([], this.pages).filter(
		      item => item.id == page
		   )[0].page_fields;
  	}

  	ngOnInit() {
  		if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      		this.router.navigate(['/login']);
    	}
  	}

  	CheckModuleOpr(e:any,page_id:any,id:any){
  		if(page_id){
	  		this.operation_pages.forEach((value,key) => {
		    	if(value.id == id){
		    		Object.assign(this.operation_pages[key], {selected: e.target.checked ? true : false});
		    		this.modified = true;
		    	}
			});
		}
  	}

  	CheckViewAccess(e:any,page_id:any,id:any){
  		if(page_id){
	  		this.page_fields.forEach((value,key) => {
		    	if(value.id == id){
		    		Object.assign(this.page_fields[key], {selected: e.target.checked ? true : false});
		    		this.modified = true;
		    	}
			});
		}
  	}

  	CheckAllModuleOpr(e:any,page_id:any){
  		if(page_id){
	  		this.operation_pages.forEach((value,key) => {
	  			value= value;
		    	Object.assign(this.operation_pages[key], {selected: e.target.checked ? true : false});
		    	this.modified = true;
			});
		}
  	}

  	CheckAllViewAccess(e:any,page_id:any){
  		if(page_id){
	  		this.page_fields.forEach((value,key) => {
	  			value = value;
		    	Object.assign(this.page_fields[key], {selected: e.target.checked ? true : false});
		    	this.modified = true;
			});
		}
  	}

  	checkAnyValueSelected(){
  		var anySelected = 0;
  		this.page_fields.forEach((value,key) => {
	    	if(value && this.page_fields[key].selected == true){
	    		anySelected = 1;
	    	}
		});

		this.operation_pages.forEach((value,key) => {
	    	if(value && this.operation_pages[key].selected == true){
	    		anySelected = 1;
	    	}
		});

		if(anySelected == 1){
			return true;
		}
		return false;
  	}

  	AddAccess(){
  		this.pages.forEach((value,key) => {
	    	if(this.pageRole['page_id'] == value.id){
	    		if(this.checkAnyValueSelected()){
		    		Object.assign(this.pages[key], {selected:true,modified:this.modified,selected_opr:this.operation_pages,selected_viewfields:this.page_fields});
		    		this.page_fields = [];
		    		this.operation_pages = [];
					this.pageRole['page_id'] = 0;
		    	}else{
		    		Object.assign(this.pages[key], {selected:false});
		    	}
	    	}
		});
		this.hidePermissions = true;
  	}

  	CancelAccess(){
  		this.modified = false;
	    this.hidePermissions = true;
	    this.page_fields = [];
	    this.operation_pages = [];
	    this.pageRole['page_id'] = 0;
	}

	saveRole(){

	  	if(this.userRole['RoleName'] == '' || this.userRole['Description'] == ''){
	  		alert('Please Provide the Role Info.');
	  		return false;
	  	}

	    let atleastOne = false;
	    for(let key in this.pages){
	      let value = this.pages[key];
	      if(value.selected){
	        atleastOne = true;
	      }
	    }

	    if(!atleastOne){
	      alert('Please Enable atleast one Module.');
	      return false;
	    }
	  	
	  	let body = new URLSearchParams();
	  	body.append('userRole',JSON.stringify(this.userRole));
		body.append('pages',JSON.stringify(this.pages));
		body.append('action','editRole');
		body.append('id',this.RoleId);

		this.http.post(environment.apikey+'/generateJsonUrl.php', body)
			.map(res => res.json())
		    .subscribe(data => {	      
		      if(data.code == 100){
		        this.closeAndRedirect(true);
		      }else if(data.code == 101){
		      	alert(data.message);
		      }else{
		      	alert("Role Not Stored. Please Check Logs.");
		      }
		    }, error => {
		        console.log(error.json());
		    });
  	}

	closeAndRedirect(redirect:any){
		let atleastOne = false;
	    for(let key in this.pages){
	      let value = this.pages[key];
	      if(value.hasOwnProperty('modified') && value.modified){
	        atleastOne = true;
	      }
	    }

	    if(atleastOne && !redirect){
	      let r = confirm('Do you want to ignore the changes?');
	      if(r){
	      	this.router.navigate(['/user-role']);
	      }
	    }else{
	    	this.router.navigate(['/user-role']);
	    }
	}
}

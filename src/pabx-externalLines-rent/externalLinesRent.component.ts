import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
declare var $: any;
@Component({
  selector: 'externalLines-rent',
  templateUrl: './externalLinesRent.component.html',
  styleUrls: [('./externalLinesRent.component.css').toString()]
})
export class ExternalLinesRentComponent implements OnInit {
  environment: any = environment;
  el:any;
  Id:any;
  title:string;
  isReadOnly:Boolean = false;
  opr:any;
  StatusList: any[];

  errorTelephone: string = '';
  errorRentStartDate: string = '';
  errorRentEndDate: string = '';
  errorRentAmount: string = '';
  errorRemarks: string = '';
  errorStatus: string = '';

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.el = {};

    this.StatusList = [
      {
        label:"Active",
        value:"Active"
      },{
        label:"Pending",
        value:"Pending"
      },
      {
        label:"Done",
        value:"Done"
      }
    ];

    if(action == 'edit' && param ){
      this.Id = param;
      this.title = 'Update External Line Rent';
      this.opr = 1;
      this.isReadOnly = false;
      this.getExternalData();
    }else if(action== 'view' && param ){
      this.Id = param;
      this.title = 'View External Line Rent';
      this.opr = 2;
      this.isReadOnly = true;
      this.getExternalData();
    }else {
      this.opr = 0;
      this.el.telephone_no = param;
      this.title = 'الخطوط الخارجية تأجيرإضافة';
      this.isReadOnly = false;
    }
  }

  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {

      }
    } else {
      this.router.navigate(['/login']);
    }

  }

  getExternalData() {
    let body = new URLSearchParams();
    body.append('action', 'get_el_rent_data');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
    .map(res => res.json())
    .subscribe((res: any) => {
        if (!!res) {
          this.el = res.data;
        }
      }, error => {
        console.log(error.json());
      });
  }

  isModelValid(el: any){
    let isValid = true;
    this.errorTelephone = '';
    this.errorRentStartDate = '';
    this.errorRentEndDate = '';
    this.errorRentAmount = '';
    this.errorRemarks = '';
    this.errorStatus = '';


    if(Object.keys(el).length == 0){
      alert('Please Fill all the required fields');
      return false;
    }

    if(Object.keys(el).length && typeof el.telephone_no == 'undefined'){
       this.errorTelephone = 'Telephone is Required';
       isValid =  false;
    }

    if(Object.keys(el).length && typeof el.rent_start_date == 'undefined'){
       this.errorRentStartDate= 'Rent Start Date is Required';
       isValid =  false;
    }

    if(Object.keys(el).length && typeof el.rent_end_date == 'undefined'){
       this.errorRentEndDate= 'Rent Start Date is Required';
       isValid =  false;
    }

    if(Object.keys(el).length && typeof el.rent_amount == 'undefined'){
       this.errorRentAmount= 'Rent Amount is Required';
       isValid =  false;
    }

    if(Object.keys(el).length && typeof el.remarks == 'undefined'){
       this.errorRemarks= 'Remarks is Required';
       isValid =  false;
    }

    if(Object.keys(el).length && typeof el.status == 'undefined'){
       this.errorStatus = 'Status is Required';
       isValid =  false;
    }

    return isValid;
  }

  AddEL(el:any){

    var isModelValid = this.isModelValid(el);
    if(!isModelValid){
      return ;
    }
    el.rent_start_date = $('#rent_start_date').val();
    el.rent_end_date = $('#rent_end_date').val();
    let body = new URLSearchParams();
    body.append('action', 'addExternalLinesRent');
    body.append('data',JSON.stringify(el));

    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if(data.code == 100){
          //alert('Ex Order Created')
          this.closeAndRedirect();
        }else{
          alert(data.message);
        }
      }, error => {
          console.log(error.json());
      });
  }

  UpdateEL(el:any){

    var isModelValid = this.isModelValid(el);
    if(!isModelValid){
      return ;
    }
    el.rent_start_date = $('#rent_start_date').val();
    el.rent_end_date = $('#rent_end_date').val();
    let body = new URLSearchParams();
    body.append('data',JSON.stringify(el));
    body.append('action','updateExternalLinesRent');

    this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {

        if(data.code == 100){
          //alert('Purchase Order Updated')
          this.closeAndRedirect();
        }else{
          alert(data.message);
        }
      }, error => {
          console.log(error.json());
      });
  }

  closeAndRedirect(){
    this.router.navigate(['/pabx/external-lines']);
  }
}

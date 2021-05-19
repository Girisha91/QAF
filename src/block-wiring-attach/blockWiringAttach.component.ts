import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http,Headers,RequestOptions,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'blockWiringAttach',
  templateUrl: './blockWiringAttach.component.html',
  styleUrls: [('./blockWiringAttach.component.css').toString()]
})
export class blockWiringAttachComponent implements OnInit {
  environment: any = environment;
  bw: any;
  Id: any;
  title: string;
  environment_apikey: string;
  isReadOnly: Boolean = false;
  opr: any;
  StatusList: any[];
  

  errorFile_name: string = '';
  errorOriginator: string = '';
  errorUploaded_by: string = '';
  errorVerified_by: string = '';
  errorApproved_by: string = '';
  errorUploaded_at:string = '';
  errorDescription: string = '';
  errorNo_sn_points: string = '';
  errorNo_vn_points: string = '';
  errorNo_gn_points: string = '';
  errorNo_ln_points: string = '';
  errorNo_wap_points: string = '';
  errorNo_dect_points: string = '';
  errorNo_lms_points: string = '';
  errorTotal_no_points: string = '';


  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.bw = {};
    this.environment_apikey = environment.apikey;

    this.StatusList = [
      {
        label: "Active",
        value: "Active"
      }, {
        label: "Pending",
        value: "Pending"
      },
      {
        label: "Done",
        value: "Done"
      }
    ];

    if (action == 'edit' && param) {
      this.Id = param;
      this.title = 'Update External Lines';
      this.opr = 1;
      this.isReadOnly = false;
      this.getExternalData();
    } else if (action == 'view' && param) {
      this.Id = param;
      this.title = 'View External Lines';
      this.opr = 2;
      this.isReadOnly = true;
      this.getExternalData();
    } else {
      this.opr = 0;
      this.bw.wiring_id_ref = param;
      this.title = 'Add External Lines';
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

  showTotal(bw :any){
    this.bw.no_sn_points = isNaN(parseInt(bw.no_sn_points)) ? 0 : parseInt(bw.no_sn_points);
    this.bw.no_vn_points = isNaN(parseInt(bw.no_vn_points)) ? 0 : parseInt(bw.no_vn_points);
    this.bw.no_gn_points = isNaN(parseInt(bw.no_gn_points)) ? 0 : parseInt(bw.no_gn_points);
    this.bw.no_ln_points = isNaN(parseInt(bw.no_ln_points)) ? 0 : parseInt(bw.no_ln_points);
    this.bw.no_wap_points = isNaN(parseInt(bw.no_wap_points)) ? 0 : parseInt(bw.no_wap_points);
    this.bw.no_dect_points = isNaN(parseInt(bw.no_dect_points)) ? 0 : parseInt(bw.no_dect_points);
    this.bw.no_lms_points = isNaN(parseInt(bw.no_lms_points)) ? 0 : parseInt(bw.no_lms_points);

    this.bw.total_no_points = (this.bw.no_sn_points) + ( this.bw.no_vn_points) + 
    ( this.bw.no_gn_points) + ( this.bw.no_ln_points) + ( this.bw.no_wap_points) + 
    ( this.bw.no_dect_points) + (this.bw.no_lms_points);
  }

  getExternalData() {
    let body = new URLSearchParams();
    body.append('action', 'getBlockWiringAttach');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.bw = res.data;
        }
      }, error => {
        console.log(error.json());
      });
  }

  isModelValid(bw: any) {
    let isValid = true;
    this.errorFile_name = '';
    this.errorOriginator = '';
    this.errorUploaded_by = '';
    this.errorVerified_by = '';
    this.errorApproved_by = '';
    this.errorUploaded_at ='';
    this.errorDescription = '';
    this.errorNo_sn_points = '';
    this.errorNo_vn_points = '';
    this.errorNo_gn_points = '';
    this.errorNo_ln_points = '';
    this.errorNo_wap_points = '';
    this.errorNo_dect_points = '';
    this.errorNo_lms_points = '';
    this.errorTotal_no_points = '';


    if (Object.keys(bw).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    // if (typeof this.fileList != 'undefined' && this.fileList.length == 0) {
    //   this.errorFile_name = 'Attachment is Required';
    //   isValid = false;
    // }

    if (Object.keys(bw).length && typeof bw.originator == 'undefined') {
      this.errorOriginator = 'Originator is Required';
      isValid = false;
    }

    // if (Object.keys(bw).length && typeof bw.description == 'undefined') {
    //   this.errorDescription = 'Description  is Required';
    //   isValid = false;
    // }

    if (Object.keys(bw).length && typeof bw.no_sn_points == 'undefined') {
      this.errorNo_sn_points = 'no sn points is Required';
      isValid = false;
    }
    // if (Object.keys(bw).length && typeof bw.no_vn_points == 'undefined') {
    //   this.errorNo_vn_points = 'no vn points is Required';
    //   isValid = false;
    // }
    // if (Object.keys(bw).length && typeof bw.no_gn_points == 'undefined') {
    //   this.errorNo_gn_points = 'no gn points is Required';
    //   isValid = false;
    // }
    // if (Object.keys(bw).length && typeof bw.no_ln_points == 'undefined') {
    //   this.errorNo_ln_points = 'no ln points is Required';
    //   isValid = false;
    // }
    // if (Object.keys(bw).length && typeof bw.no_wap_points == 'undefined') {
    //   this.errorNo_wap_points = 'no wap points is Required';
    //   isValid = false;
    // }
    // if (Object.keys(bw).length && typeof bw.no_dect_points == 'undefined') {
    //   this.errorNo_dect_points = 'no dect points is Required';
    //   isValid = false;
    // }
    // if (Object.keys(bw).length && typeof bw.no_lms_points == 'undefined') {
    //   this.errorNo_lms_points = 'no lms points is Required';
    //   isValid = false;
    // } if (Object.keys(bw).length && typeof bw.total_no_points == 'undefined') {
    //   this.errorTotal_no_points = 'Total no points is Required';
    //   isValid = false;
    // }
    return isValid;
  }

  fileList:FileList;
  txtDescription:any='';
  fileChangeListener(event: any): void {
    //file upload event
    var target = event.target || event.srcElement;
    var files = target.files;
    //if (Constants.validateHeaderAndRecordLengthFlag) {
      /*if (!this._fileUtil.isCSVFile(files[0])) {
        alert(this._translate.currentLang == 'en' ? "Please import valid .csv file." : "الرجاء استيراد ملف .csv صالح.");
        this.fileReset();
      }*/
    //}

    this.fileList = event.target.files;
  }

  AddBWA(bw: any) {

    var isModelValid = this.isModelValid(bw);
    if (!isModelValid) {
      return;
    }
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('action', "addBlockWiringAttach");
      formData.append('file_name', file, file.name);
      formData.append('data', JSON.stringify(bw));
      let headers = new Headers()
      //headers.append('Content-Type', 'json');
      //headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/generateJsonUrl.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.closeAndRedirect();
      },
        error => { console.log(error) }
      );
    }

  }

  UpdateBWA(bw: any) {

    var isModelValid = this.isModelValid(bw);
    if (!isModelValid) {
      return;
    }
    if (typeof this.fileList != 'undefined' && this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('action', "updateBlockWiringAttach");
      formData.append('file_name', file, file.name);
      formData.append('data', JSON.stringify(bw));
      let headers = new Headers()
      //headers.append('Content-Type', 'json');
      //headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/generateJsonUrl.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        //this.closeAndRedirect();
      },
        error => { console.log(error) }
      );
    }else{
      let formData: FormData = new FormData();
      formData.append('action', "updateBlockWiringAttach");
      formData.append('data', JSON.stringify(bw));
      let headers = new Headers()
      //headers.append('Content-Type', 'json');
      //headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/generateJsonUrl.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        //this.closeAndRedirect();
      },
        error => { console.log(error) }
      );
    }

  }

  closeAndRedirect() {
    this.router.navigate(['/blockWiringList']);
  }
}

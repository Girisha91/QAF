import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'blockWiringForm',
  templateUrl: './blockWiringForm.component.html',
  styleUrls: [('./blockWiringForm.component.css').toString()]
})
export class blockWiringFormComponent implements OnInit {
  environment: any = environment;
  bw: any;
  Id: any;
  title: string;
  isReadOnly: Boolean = false;
  opr: any;
  StatusList: any[];
  TypeEnquiryList :any[];
  EnquiryFromList:any[];
  ServiceList: any[];
  CatList: any[];
  Location: any[];
  rent_items: any[];

  distributionList : any[]= [];
  distributionListArabic : any[]= [];
  distributionUnit : any[]= [];
  distributionUnitArabic : any[]= [];

  errorType_enquiry: string = '';
  errorEnquiry_from: string = '';
  errorClient_dev_name: string = '';
  errorConsultant_name: string = '';
  errorContractor_name: string = '';
  errorProject_name: string = '';
  errorProject_no: string = '';
  errorDistribution_menu: string = '';
  errorDistribution_unit: string = '';
  errorLocation: string = '';
  errorPin_no: string = '';
  errorDrawing_name: string = '';
  errorDrawing_no: string = '';
  errorOriginator: string = '';
  errorDescription_work: string = '';
  errorRemarks: string = '';
  errorStatus: string = ''; 

  constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    var param = route.snapshot.params['id'];
    var action = route.snapshot.params['action'];
    this.bw = {};
    this.getDistributionList();
    this.TypeEnquiryList =[
      {
        label: "New Building",
        value: "New Building"
      }, {
        label: "Existing Building",
        value: "Existing Building"
      }
    ];
    this.EnquiryFromList=[
      {
        label: "Contractor",
        value: "Contractor"
      }, {
        label: "Engineering Unit",
        value: "Engineering Unit"
      }
    ];
    this.StatusList = [
      {
        label: "Active",
        value: "1"
      }, {
        label: "Pending Approval",
        value: "2"
      },
      {
        label: "Done",
        value: "3"
      }
    ];

    if (action == 'edit' && param) {
      this.Id = param;
      this.title = 'Update Block Wiring';
      this.opr = 1;
      this.isReadOnly = false;
      this.getExternalData('edit');
    } else if (action == 'view' && param) {
      this.Id = param;
      this.title = 'View Block Wiring';
      this.opr = 2;
      this.isReadOnly = true;
      this.getExternalData('view');
      
    } else {
      this.opr = 0;
      this.title = 'Add Block Wiring';
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

  getExternalData(method: any) {
    let body = new URLSearchParams();
    body.append('action', 'getBlockWiring');
    body.append('id', this.Id);
    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (!!res) {
          this.bw = res.data;
          this.onChange(this.bw.Distribution_Menu,'en');
          if (method == 'view') {
            let body = new URLSearchParams();
            body.append('action', "getBlockWiringAttach");
            body.append('telephone_no', this.bw.telephone_no);

            this.http.post(environment.apikey + '/generateJsonUrl.php', body)
              .map(res => res.json())
              .subscribe((res: any) => {
                if (res.code == 100) {
                  this.rent_items = res.data;
                } else {
                  this.rent_items = [];
                }
              });
          }
        }
      }, error => {
        console.log(error.json());
      });

  }

  isModelValid(bw: any) {
    let isValid = true;
    this.errorType_enquiry = '';
    this.errorEnquiry_from = '';
    this.errorClient_dev_name = '';
    this.errorConsultant_name = '';
    this.errorContractor_name = '';
    this.errorProject_name = '';
    this.errorProject_no= '';
    this.errorDistribution_menu= '';
    this.errorDistribution_unit = '';
    this.errorLocation = '';
    this.errorPin_no = '';
    this.errorDrawing_name = '';
    this.errorDrawing_no = '';
    this.errorOriginator = '';
    this.errorDescription_work = '';
    this.errorRemarks = '';
    this.errorStatus = '';


    if (Object.keys(bw).length == 0) {
      alert('Please Fill all the required fields');
      return false;
    }

    // if (Object.keys(bw).length && typeof bw.type_enquiry == 'undefined') {
    //   this.errorType_enquiry = 'Type enquiry is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.enquiry_from == 'undefined') {
    //   this.errorEnquiry_from = 'enquiry form is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.client_dev_name == 'undefined') {
    //   this.errorClient_dev_name = 'Client /Development name is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.consultant_name == 'undefined') {
    //   this.errorConsultant_name = 'Consultant name  is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.contractor_name == 'undefined') {
    //   this.errorContractor_name = 'Contractor name is Required';
    //   isValid = false;
    // }

    if (Object.keys(bw).length && typeof bw.project_name == 'undefined') {
      this.errorProject_name = 'Project name is Required';
      isValid = false;
    }
    if (Object.keys(bw).length && typeof bw.project_no == 'undefined') {
      this.errorProject_no = 'Project no is Required';
      isValid = false;
    }
    // if (Object.keys(bw).length && typeof bw.distribution_menu == 'undefined') {
    //   this.errorDistribution_menu = 'Distribution Menu is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.distribution_unit == 'undefined') {
    //   this.errorDistribution_unit = 'Distribution unit is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.location == 'undefined') {
    //   this.errorLocation = ' Location is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.pin_no == 'undefined') {
    //   this.errorPin_no = 'Pin no is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.drawing_name == 'undefined') {
    //   this.errorDrawing_name = 'Drawing name is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.drawing_no == 'undefined') {
    //   this.errorDrawing_no = 'Drawing no is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.originator == 'undefined') {
    //   this.errorOriginator = 'Originator is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.description_work == 'undefined') {
    //   this.errorDescription_work = 'Description work  is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.remarks == 'undefined') {
    //   this.errorRemarks = 'Remarks  is Required';
    //   isValid = false;
    // }

    // if (Object.keys(bw).length && typeof bw.status == 'undefined') {
    //   this.errorStatus = 'Status  is Required';
    //   isValid = false;
    // }
    return isValid;
  }

  getDistributionList(){
    this.http.get(environment.apikey+"/masterData.php?oper=getDistributionList&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.distributionList.push(data[item].name);
          this.distributionListArabic.push(data[item].nameArabic);
     }
            }
    });
  }

  

  getDistributionUnit(Id:any,lang:any){
    this.distributionUnit = [];
    this.distributionUnitArabic = [];
    this.http.get(environment.apikey+"/masterData.php?oper=getDistributionUnitList&language="+lang+"&id="+encodeURI(Id))
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        data.sort((a: any,b: any) => a.unit_order - b.unit_order );
        for(var item in data){
          this.distributionUnit.push(data[item].name);
          this.distributionUnitArabic.push(data[item].nameArabic);
     }
            }
    });
  }

  onChange(id:any,lang:any){
    this.getDistributionUnit(id,lang);
  }

  AddEL(bw: any) {
    var isModelValid =this.isModelValid(bw);
    if (!isModelValid) {
      return;
    }
    
    let body = new URLSearchParams();
    body.append('action', 'addBlockWiring');
    body.append('data', JSON.stringify(bw));

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {
        if (data.code == 100) {
          //alert('Ex Order Created')
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  UpdateEL(bw: any) {

    var isModelValid = this.isModelValid(bw);
    if (!isModelValid) {
      return;
    }

    let body = new URLSearchParams();
    body.append('data', JSON.stringify(bw));
    body.append('action', 'updateBlockWiring');

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe(data => {

        if (data.code == 100) {
          //alert('Purchase Order Updated')
          this.closeAndRedirect();
        } else {
          alert(data.message);
        }
      }, error => {
        console.log(error.json());
      });
  }

  closeAndRedirect() {
    this.router.navigate(['/blockWiringList']);
  }
}

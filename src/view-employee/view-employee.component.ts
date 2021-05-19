import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: [('./view-employee.component.css').toString()]
})
export class ViewEmployeeComponent implements OnInit {
  
  environment: any = environment;
  EmployeeDetails:any;
  employee: any;
  employeeId :string;
  
  txtId :any= "";
  txtUserName : any= "";
  txtName :any= "";
  txtSubRank:any="";
  txtSubRankArabic:any="";
  // txtMiddleName:any= "";
  // txtLastName :any= "";
  // txtFamilyName:any= "";
  ddlRank:any= "";
  txtPosition:any= "";
  
  txtForce:any= "";
  txtCorps:any= "";
  txtUnits:any= "";
  txtRegiment:any= "";
  txtDirectorate:any= "";

  ddlCompany:any= "";
  txtOrganization:any= "";
  txtReportingManager:any= "";
  txtOfficetelePhone1:any= "";
  txtResidentTelePhone:any= "";
  
  txtOfficetelePhone2: any= "";
  txtOfficetelePhone3:any= "";
  txtDirectLine: any= "";
  txtFaxLine: any= "";
  txtHotLine: any= "";
  txtOtherSpecialLine: any= "";
  txtPrivateTelephone: any= "";
  txtInstruction: any= "";
  txtMobile: any= "";
  

 //arabic Model
  txtIdArabic :any= "";
  txtUserNameArabic :any= "";
  txtNameArabic :any= "";
  // txtMiddleNameArabic:any= "";
  // txtLastNameArabic :any= "";
  // txtFamilyNameArabic:any= "";
  ddlRankArabic:any= "";
  txtPositionArabic:any= "";

  txtForceArabic:any= "";
  txtCorpsArabic:any= "";
  txtUnitsArabic:any= "";
  txtRegimentArabic:any= "";
  txtDirectorateArabic:any= "";

  ddlCompanyArabic:any= "";
  txtOrganizationArabic:any= "";
  txtReportingManagerArabic:any= "";
  txtOfficetelePhone1Arabic:any= "";
  txtResidentTelePhoneArabic:any= "";
  
  txtOfficetelePhone2Arabic: any= "";
  txtOfficetelePhone3Arabic: any= "";
  txtDirectLineArabic: any= "";
  txtFaxLineArabic:any= "";
  txtHotLineArabic: any= "";
  txtOtherSpecialLineArabic: any= "";
  txtPrivateTelephoneArabic: any= "";
  txtInstructionArabic: any= "";
  txtMobileArabic: any= "";
  ddlDstListArabic: any= "";
  ddlDstUnitArabic: any= "";
  ddlDstList: any= "";
  ddlDstUnit: any= "";
 
  public UserFieldPermission:any;
  public UserModuleOperation:any;
  public UserModulePermission:any;
  public userPermission:any;
  isLangArabic: boolean =false;
  constructor(private cookieService: CookieService,private http:Http, private _localStorageService:LocalStorageService, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    this.employeeId= route.snapshot.params['id'];
    this.userPermission=[];
    this.UserModulePermission=[];
    this.UserModuleOperation=[];
    this.UserFieldPermission=[];
   }

  ngOnInit() {
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined"){
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if(userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1){
        if(this._translate.currentLang == 'ar'){
          this.isLangArabic = true;
        }
        this.getEmployeeData();
        this.Permissions();
      }
    }else {
      this.router.navigate(['/login']);
    }
    
  }

  Permissions(){
    this.userPermission = JSON.parse(this._localStorageService.get('userPermission'));
    let UserModulePermissionArr:any = [];
    let UserModuleOperationArr:any = [];
    let UserFieldPermissionArr:any = [];

    for (let key in this.userPermission) {
        if(key == 'OtherInfo'){
          let value = this.userPermission[key];
          for (let key2 in value) {
            let value2 = value[key2];
            value2.forEach((value3:any,key3:any) => {
              if(key3 && value3.selected){
                UserModulePermissionArr.push(value3.id);
              }
              for (let key4 in value3) {
                let value4 = value3[key4];
                if(key4 == 'operation_pages'){
                  for (let key5 in value4) {
                    let value5 = value4[key5];
                    if(value5.selected){
                      if(value5.selected){
                        UserModuleOperationArr.push(value5.id);
                      }
                    }
                  }
                }
                if(key4 == 'page_fields'){
                  for (let key6 in value4) {
                    let value6 = value4[key6];
                    if(value6.selected){
                      if(value6.selected){
                        UserFieldPermissionArr.push(value6.id);
                      }
                    }
                  }
                }
              }
              this.UserModuleOperation.push({'page_id':value3.id,'operations':UserModuleOperationArr});
              UserModuleOperationArr = [];
              this.UserFieldPermission.push({'page_id':value3.id,'fields':UserFieldPermissionArr});
              UserFieldPermissionArr = [];
            });
          }
        }
    }
    
    this.UserModulePermission = UserModulePermissionArr;
  }

  checkUserFieldPermission(page_id:any,field_id:any){
    let fields = [];
    for (let key in this.UserFieldPermission) {
      let value = this.UserFieldPermission[key];
      if(value.page_id == page_id){
        fields = value.fields;
      }
    }    
    return fields.indexOf(field_id) > -1;
  }

  getEmployeeData(){
    this.http.get(environment.apikey+"/generateJsonUrl.php?id="+ this.employeeId+"&oper=getDetails&language="+this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
       if(!!data){
         //data["rankarray"] = this.onSelect1(data.Rank);
        this.loadData(data);
         }
    });
  }

  valueChange(value:any){
  }

  loadData(empDetails:any){
    this.txtId= this.checkUserFieldPermission('1','1') ? empDetails.MilitaryId : '*******';
    this.txtIdArabic= this.checkUserFieldPermission('1','1') ? empDetails.MilitaryIdArabic : '*******';

    this.txtName= this.checkUserFieldPermission('1','10') ? empDetails.name : '*******';
    this.txtNameArabic= this.checkUserFieldPermission('1','10') ? empDetails.nameArabic : '*******';

    this.ddlRank= this.checkUserFieldPermission('1','14') ? empDetails.Rank : '*******';
    this.ddlRankArabic= this.checkUserFieldPermission('1','14') ? empDetails.RankArabic : '*******';

    this.txtForceArabic= this.checkUserFieldPermission('1','16') ? empDetails.ForcesArabic : '*******';
    this.txtForce= this.checkUserFieldPermission('1','16') ? empDetails.Forces : '*******';

    this.txtCorps= this.checkUserFieldPermission('1','17') ? empDetails.Corps : '*******';
    this.txtCorpsArabic= this.checkUserFieldPermission('1','17') ? empDetails.CorpsArabic : '*******';

    this.txtUnits= this.checkUserFieldPermission('1','18') ? empDetails.Unit : '*******';
    this.txtUnitsArabic= this.checkUserFieldPermission('1','18') ? empDetails.UnitArabic : '*******';

    this.txtRegiment= this.checkUserFieldPermission('1','19') ? empDetails.Regiment : '*******';
    this.txtRegimentArabic= this.checkUserFieldPermission('1','19') ? empDetails.RegimentArabic : '*******';

    this.txtDirectorate= this.checkUserFieldPermission('1','20') ? empDetails.Directorate : '*******';
    this.txtDirectorateArabic= this.checkUserFieldPermission('1','20') ? empDetails.DirectorateArabic : '*******';

    this.txtPosition= this.checkUserFieldPermission('1','15') ? empDetails.Position : '*******';
    this.txtPositionArabic= this.checkUserFieldPermission('1','15') ? empDetails.PositionArabic : '*******';

    this.txtOfficetelePhone1= this.checkUserFieldPermission('1','25') ? empDetails.OfficeTelephone1 : '*******';
    this.txtOfficetelePhone1Arabic= this.checkUserFieldPermission('1','25') ? empDetails.OfficeTelephone1Arabic : '*******';


    this.txtMobile= this.checkUserFieldPermission('1','21') ? empDetails.Mobile : '*******'; //Change
    this.txtMobileArabic= this.checkUserFieldPermission('1','21') ? empDetails.MobileArabic : '*******'; //Change

    this.txtResidentTelePhone= this.checkUserFieldPermission('1','28') ? empDetails.ResidenceTelephone : '*******'; //Change
    this.txtResidentTelePhoneArabic= this.checkUserFieldPermission('1','28') ? empDetails.ResidenceTelephoneArabic : '*******'; //Change
   
    this.ddlDstList= this.checkUserFieldPermission('1','35') ? empDetails.distributionList : '*******'; //Change
    this.ddlDstListArabic= this.checkUserFieldPermission('1','35') ? empDetails.distributionListArabic : '*******'; //Change
    
    this.ddlDstUnit= this.checkUserFieldPermission('1','36') ? empDetails.distributionUnit : '*******'; //Change
    this.ddlDstUnitArabic= this.checkUserFieldPermission('1','36') ? empDetails.distributionUnitArabic : '*******'; //Change
    
    
    

    // this.txtLastName= this.checkUserFieldPermission('1','12') ? empDetails.LastName : '*******';;
    // this.txtLastNameArabic= this.checkUserFieldPermission('1','12') ? empDetails.LastNameArabic : '*******';;

    // this.txtMiddleName= this.checkUserFieldPermission('1','11') ? empDetails.MiddleName : '*******';;
    // this.txtMiddleNameArabic= this.checkUserFieldPermission('1','11') ? empDetails.MiddleNameArabic : '*******';;

    this.txtUserName= this.checkUserFieldPermission('1','9') ? empDetails.UserName : '*******';;
    this.txtUserNameArabic= this.checkUserFieldPermission('1','9') ? empDetails.UserNameArabic : '*******';;

    // this.txtFamilyName= this.checkUserFieldPermission('1','13') ? empDetails.FamilyName : '*******';;
    // this.txtFamilyNameArabic= this.checkUserFieldPermission('1','13') ? empDetails.FamilyNameArabic : '*******';;

    this.ddlCompany= this.checkUserFieldPermission('1','22') ? empDetails.Company : '*******';;
    this.ddlCompanyArabic= this.checkUserFieldPermission('1','22') ? empDetails.CompanyArabic : '*******';;

    this.txtOrganization= this.checkUserFieldPermission('1','23') ? empDetails.Organization : '*******';
    this.txtOrganizationArabic= this.checkUserFieldPermission('1','23') ? empDetails.OrganizationArabic : '*******';

    this.txtReportingManager= this.checkUserFieldPermission('1','24') ? empDetails.ReportingManager : '*******';
    this.txtReportingManagerArabic= this.checkUserFieldPermission('1','24') ? empDetails.ReportingManagerArabic : '*******';

   this.txtOfficetelePhone2 = this.checkUserFieldPermission('1','26') ? empDetails.OfficeTelephone2 : '*******';
   this.txtOfficetelePhone2Arabic = this.checkUserFieldPermission('1','26') ? empDetails.OfficeTelephone2Arabic : '*******';

   this.txtOfficetelePhone3 = this.checkUserFieldPermission('1','27') ? empDetails.OfficeTelephone3 : '*******';
   this.txtOfficetelePhone3Arabic = this.checkUserFieldPermission('1','27') ? empDetails.OfficeTelephone3Arabic : '*******';

   this.txtDirectLine = this.checkUserFieldPermission('1','29') ? empDetails.DirectLine : '*******';
   this.txtDirectLineArabic = this.checkUserFieldPermission('1','29') ? empDetails.DirectLineArabic : '*******';

   this.txtFaxLine= this.checkUserFieldPermission('1','30') ? empDetails.FaxLine : '*******';
   this.txtFaxLineArabic= this.checkUserFieldPermission('1','30') ? empDetails.FaxLineArabic : '*******';
   
   this.txtHotLine= this.checkUserFieldPermission('1','31') ? empDetails.HotLine : '*******';
   this.txtHotLineArabic= this.checkUserFieldPermission('1','31') ? empDetails.HotLineArabic : '*******';

   this.txtOtherSpecialLine= this.checkUserFieldPermission('1','32') ? empDetails.OtherSpecialLine : '*******';
   this.txtOtherSpecialLineArabic= this.checkUserFieldPermission('1','32') ? empDetails.OtherSpecialLineArabic : '*******';

   this.txtPrivateTelephone= this.checkUserFieldPermission('1','33') ? empDetails.PrivateTelephone : '*******';
   this.txtPrivateTelephoneArabic= this.checkUserFieldPermission('1','33') ? empDetails.PrivateTelephoneArabic : '*******';

   this.txtInstruction= this.checkUserFieldPermission('1','34') ? empDetails.Instruction : '*******';
   this.txtInstructionArabic= this.checkUserFieldPermission('1','34') ? empDetails.InstructionArabic : '*******';
  
   this.txtSubRank = this.checkUserFieldPermission('1','60') ? empDetails.subRank : '*******';
   this.txtSubRankArabic = this.checkUserFieldPermission('1','60') ? empDetails.subRankArabic : '*******';
  }

  closeAndRedirect(){
    this.router.navigate(['/employee'],{
      queryParamsHandling:'preserve'
    });
   }
}

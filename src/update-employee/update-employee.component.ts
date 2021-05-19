import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Http,URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: [('./update-employee.component.css').toString()]
})
export class UpdateEmployeeComponent implements OnInit {
  
  environment: any = environment;
  EmployeeDetails:any;
  employee: any;
  employeeId :string;
  
  txtId :any= "";
  txtUserName : any= "";
   txtName :any= "";

   txtSubRank:any="";
   txtSubRankArabic:any="";
  ddlRank:any= "";
  txtPosition:any= "";
  
  txtForce:any= "";
  txtCorps:any= "";
  txtUnits:any= "";
  txtRegiment:any= "";
  txtDirectorate:any= "";

  ddlDstList:any= "";
  ddlDstUnit:any= "";
  ddlDstListArabic:any= "";
  ddlDstUnitArabic:any= "";

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
  
  rankList:any[] = [] ;//string[]  = ["Major","Major General","Brigadier", "Colonel","Lt Colonel","Captain","lieutenant"];
  rankListArabic:any[]= [];
  forceList:any[]=[];
  forceListArabic:any[]=[];
  regimentList:any[] = [] ;//string[]  = ["Major","Major General","Brigadier", "Colonel","Lt Colonel","Captain","lieutenant"];
  regimentListArabic:any[]= [];
  unitList:any[]=[];
  unitListArabic:any[]=[];
  corpsList:any[]=[];
  corpsListArabic:any[]=[];
  directorateList:any[]=[];
  directorateListArabic:any[]=[];
  positionList : any= [];
  positionListArabic : any= [];

  distributionList : any[]= [];
  distributionListArabic : any[]= [];
  distributionUnit : any[]= [];
  distributionUnitArabic : any[]= [];
   //string[]  = ["رائد","لواء","قائد لواء", "كولونيل","الملازم كولونيل","قائد المنتخب","ملازم"];
  companyList: string[]=  ["QAF","Qatar Armed Force"];
  companyListArabic: string[]=  ["العنق","القوات المسلحة القطرية"];
  currentLanguage:string;
  isLangArabic: Boolean= false;
  constructor(private cookieService: CookieService,private http:Http, route: ActivatedRoute, private router: Router, private _translate: TranslateService) {
    this.employeeId= route.snapshot.params['id'];
   }

  ngOnInit() {
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined"){
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if(userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1){
        if(this._translate.currentLang == 'ar'){
          this.isLangArabic = true;
        }
        this.getRank();
        this.getDistributionList();
        this.getEmployeeData();
        
      }
    }else {
      this.router.navigate(['/login']);
    }
    
  }

  getEmployeeData(){
    this.http.get(environment.apikey+"/generateJsonUrl.php?id="+ this.employeeId+"&oper=getDetails&language="+this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
       if(!!data){
        this.loadData(data);
        
         }
    });
  }

  valueChange(value:any){
  }

  loadData(empDetails:any){
        this.txtId= empDetails.MilitaryId;
        this.txtIdArabic= empDetails.MilitaryIdArabic;

        this.txtName=empDetails.name;
        this.txtNameArabic=empDetails.nameArabic;

        this.ddlRank=empDetails.Rank;//empDetails.rankarray;//
        this.ddlRankArabic=empDetails.RankArabic;

        this.txtSubRank = empDetails.subRank;
        this.txtSubRankArabic = empDetails.subRankArabic;

        this.txtForceArabic=empDetails.ForcesArabic;
        this.txtForce=empDetails.Forces;

        this.txtCorps=empDetails.Corps;
        this.txtCorpsArabic=empDetails.CorpsArabic;

        this.txtUnits=empDetails.Unit;
        this.txtUnitsArabic=empDetails.UnitArabic;

        this.txtRegiment=empDetails.Regiment;
        this.txtRegimentArabic=empDetails.RegimentArabic;

        this.txtDirectorate=empDetails.Directorate;
        this.txtDirectorateArabic=empDetails.DirectorateArabic;

        this.txtPosition=empDetails.Position;
        this.txtPositionArabic=empDetails.PositionArabic;

        this.txtOfficetelePhone1=empDetails.OfficeTelephone1;
        this.txtOfficetelePhone1Arabic=empDetails.OfficeTelephone1Arabic;


        this.txtMobile=empDetails.Mobile; //Change
        this.txtMobileArabic=empDetails.MobileArabic; //Change

        this.txtResidentTelePhone=empDetails.ResidenceTelephone; //Change
        this.txtResidentTelePhoneArabic=empDetails.ResidenceTelephoneArabic; //Change
        // this.onChange(empDetails.distributionList,'en');
        this.onChange(empDetails.distributionListArabic,'ar');
    
        this.ddlDstList = empDetails.distributionList;
        this.ddlDstUnit = empDetails.distributionUnit;

        this.ddlDstListArabic = empDetails.distributionListArabic;
        this.ddlDstUnitArabic = empDetails.distributionUnitArabic;

        this.txtUserName=empDetails.UserName;
        this.txtUserNameArabic=empDetails.UserNameArabic;


        this.ddlCompany=empDetails.Company;
        this.ddlCompanyArabic=empDetails.CompanyArabic;

        this.txtOrganization=empDetails.Organization;
        this.txtOrganizationArabic=empDetails.OrganizationArabic;

        this.txtReportingManager=empDetails.ReportingManager;
        this.txtReportingManagerArabic=empDetails.ReportingManagerArabic;

        this.txtOfficetelePhone2 =empDetails.OfficeTelephone2 ;
        this.txtOfficetelePhone2Arabic =empDetails.OfficeTelephone2Arabic;

        this.txtOfficetelePhone3 =empDetails.OfficeTelephone3;
        this.txtOfficetelePhone3Arabic =empDetails.OfficeTelephone3Arabic;

        this.txtDirectLine =empDetails.DirectLine;
        this.txtDirectLineArabic =empDetails.DirectLineArabic;

        this.txtFaxLine=empDetails.FaxLine;
        this.txtFaxLineArabic=empDetails.FaxLineArabic;
       
        this.txtHotLine=empDetails.HotLine;
        this.txtHotLineArabic=empDetails.HotLineArabic;

        this.txtOtherSpecialLine=empDetails.OtherSpecialLine;
        this.txtOtherSpecialLineArabic=empDetails.OtherSpecialLineArabic;

        this.txtPrivateTelephone=empDetails.PrivateTelephone;
        this.txtPrivateTelephoneArabic=empDetails.PrivateTelephoneArabic;

        this.txtInstruction=empDetails.Instruction;
        this.txtInstructionArabic=empDetails.InstructionArabic;
       
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

  onChange(id:any,lang:any){    
    this.getDistributionUnit(id,lang);
  }

  getDistributionUnit(Id:any,lang:any){
    this.distributionUnit = [];
    this.distributionUnitArabic = [];
    this.http.get(environment.apikey+"/masterData.php?oper=getDistributionUnitList&language="+ lang+"&id="+encodeURI(Id))
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        console.log("value of unit is",data);
        data.sort((a: any,b: any) => a.unit_order - b.unit_order );
        for(var item in data){
          this.distributionUnit.push(data[item].name);
          this.distributionUnitArabic.push(data[item].nameArabic);
     }
            }
    });
  }

  getRank(){
    this.http.get(environment.apikey+"/generateJsonUrl.php?oper=getRanks&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.rankList.push(data[item].Rank);
          this.rankListArabic.push(data[item].RankArabic);
     }
        }
    });
  }

  getForce(){
    this.http.get(environment.apikey+"/masterData.php?oper=getForces&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.forceList.push(data[item].Forces);
          this.forceListArabic.push(data[item].ForcesArabic);
     }
            }
    });
  }

  getRegiment(){
    this.http.get(environment.apikey+"/masterData.php?oper=getRegiments&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.regimentList.push(data[item].Regiment);
          this.regimentListArabic.push(data[item].RegimentArabic);
     }
            }
    });
  }

  getUnit(){
    this.http.get(environment.apikey+"/masterData.php?oper=getUnits&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.unitList.push(data[item].Unit);
          this.unitListArabic.push(data[item].UnitArabic);
     }
            }
    });
  }

  getCorps(){
    this.http.get(environment.apikey+"/masterData.php?oper=getCorps&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.corpsList.push(data[item].Corps);
          this.corpsListArabic.push(data[item].CorpsArabic);
     }
            }
    });
  }

  getDirectorate(){
    this.http.get(environment.apikey+"/masterData.php?oper=getDirectorates&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        for(var item in data){
          this.directorateList.push(data[item].Directorate);
          this.directorateListArabic.push(data[item].DirectorateArabic);
     }
            }
    });
  }

  updateEmployeedetails(){
    this.resetErrorBoolean();
  var isModelValid = this.isModelValid();
  if(!isModelValid){
    return ;
  }

  if(isModelValid){
    var empData = {
      'MilitaryId': this.txtId,
      'MilitaryIdArabic': this.txtIdArabic,
  
   'name': this.txtName,
   'nameArabic': this.txtNameArabic,
  
   'Rank' : this.ddlRank,
   'RankArabic': this.ddlRankArabic,
  
   'subRank':this.txtSubRank,
   'subRankArabic':this.txtSubRankArabic,
  
   'Position' :this.txtPosition,
   'PositionArabic': this.txtPositionArabic,
  
  'OfficeTelephone1': this.txtOfficetelePhone1,
   'OfficeTelephone1Arabic': this.txtOfficetelePhone1,
  
  'Mobile': this.txtMobile,
  'MobileArabic': this.txtMobile,
  
   'ResidenceTelephone': this.txtResidentTelePhone,
   'ResidenceTelephoneArabic': this.txtResidentTelePhone,
  
    'distributionList': this.ddlDstList,
    'distributionUnit': this.ddlDstUnit,
  
    'distributionListArabic': this.ddlDstListArabic,
    'distributionUnitArabic': this.ddlDstUnitArabic,
  
  'ReportingManager': this.txtReportingManager,
  'ReportingManagerArabic': this.txtReportingManagerArabic,
  
  'OfficeTelephone2':this.txtOfficetelePhone2,
  'OfficeTelephone2Arabic': this.txtOfficetelePhone2,
  
  'OfficeTelephone3': this.txtOfficetelePhone3,
  'OfficeTelephone3Arabic': this.txtOfficetelePhone3,
  
  'DirectLine': this.txtDirectLine,
  'DirectLineArabic': this.txtDirectLine,
  
  'FaxLine':this.txtFaxLine,
  'FaxLineArabic': this.txtFaxLine,
  
    };
    var primarykeyId ='id';
    
    let body = new URLSearchParams();
    body.append('table', 'employeeinfo');
    body.append('data',JSON.stringify(empData));
    body.append('primary_key', primarykeyId);
    body.append('primary_key_value', this.employeeId);
    body.append('action','update');
    

  this.http.post(environment.apikey+'/generateJsonUrl.php', body)
      .subscribe(data => {
        data = data;
        this.getEmployeeData();
        this.closeAndRedirect();
        
      }, error => {
          console.log(error.json());
      });
    }
     
  }

   closeAndRedirect(){
    this.router.navigate(['/employee']);
   }

   
   errorId: boolean = false;
   errorIdArabic: boolean = false;
   errorFName : boolean = false;
   errorFNameArabic : boolean = false;
   errorRank: boolean = false;
   errorRankArabic: boolean = false;
   errorPosition : boolean = false;
   errorPositionArabic: boolean = false;
   errorOfficetelePhone1: boolean = false;
   errorOfficetelePhone1Arabic: boolean = false;
   errorMobile:boolean = false;
   errorMobileArabic:boolean = false;
   errorUName: boolean= false;
   errorUNameArabic: boolean = false;
   errorDLine: boolean= false;
   errorDLineArabic: boolean = false;
   errorFLine: boolean= false;
   errorFLineArabic: boolean = false;
   errorResidentTele:boolean = false;
   errorResidentTeleArabic: boolean = false;
   errorRManager:boolean = false;
   errorRManagerArabic: boolean = false;
   errorOfficetelePhone2:boolean = false;
   errorOfficetelePhone2Arabic:boolean = false;
   errorOfficetelePhone3:boolean = false;
   errorOfficetelePhone3Arabic:boolean = false;
  errorDistributionList: boolean = false;
  errorDistributionUnit: boolean = false;
  errorDistributionListArabic: boolean = false;
  errorDistributionUnitArabic: boolean = false;
  
  isModelValid(){
    var isValid = true;
    if(this.txtId.trim().length == 0){
       this.errorId= true;
       this.errorIdArabic= true;
       isValid =  false;
    }

    if(this.txtName.trim().length == 0 || this.txtNameArabic.trim().length == 0){
     if(this.txtName.trim().length == 0 && this.txtNameArabic.trim().length == 0){
       this.errorFName = true;
       this.errorFNameArabic = true;
     }
     else if(this.txtName.trim().length == 0){
         this.errorFName = true;
     }else if(this.txtNameArabic.trim().length == 0){
       this.errorFNameArabic = true;
     }
     isValid =  false;
  }

  
  if(this.txtOfficetelePhone1.trim().length > 0){
    if(this.regexp.test(this.txtOfficetelePhone1.trim())){
      this.invalidOfficetelePhone1 = true;
      this.invalidOfficetelePhone1Arabic = true;
      isValid  = false;
      }
  }
  
  
  if(this.txtMobile.trim().length == 0){
     this.errorMobile = true;
     this.errorMobileArabic = true;
   isValid =  false;
  }
  if(this.txtMobile.trim().length > 0){
    if(this.regexp.test(this.txtMobile.trim())){
      this.invalidMobile = true;
      this.invalidMobileArabic = true;
      isValid  = false;
      }
    }
  
  
  if(this.txtResidentTelePhone.trim().length >  0){
    if(this.regexp.test(this.txtResidentTelePhone.trim())){
    this.invalidResidentTele = true;
    this.invalidResidentTeleArabic = true;
    isValid  = false;
    }
  }
  
  if(this.txtOfficetelePhone2.trim().length > 0){
    if(this.regexp.test(this.txtOfficetelePhone2.trim())){
    this.invalidOfficetelePhone2 = true;
    this.invalidOfficetelePhone2Arabic = true;
    isValid  = false;
    }
   
  }
  
  if(this.txtOfficetelePhone3.trim().length > 0){
  
    if(this.regexp.test(this.txtOfficetelePhone3.trim())){
      this.invalidOfficetelePhone3 = true;
      this.invalidOfficetelePhone3Arabic = true;
      isValid  = false;
      }
  }
  
  if(this.txtDirectLine.trim().length > 0){
    if(this.regexp.test(this.txtDirectLine.trim())){
      this.invalidDLine = true;
      this.invalidDLineArabic = true;
      isValid  = false;
      }
  }
  
  
  if(this.txtFaxLine.trim().length > 0){
    if(this.regexp.test(this.txtFaxLine.trim())){
      this.invalidFLine = true;
      this.invalidFLineArabic = true;
      isValid  = false;
      }
  }
  
   return isValid;
  }

invalidMilitaryId = false;
invalidMilitaryIdArabic = false;
invalidMobile = false;
invalidMobileArabic = false;
invalidPrivateTele = false;
invalidPrivateTeleArabic = false;
invalidDLine= false;
invalidDLineArabic = false;
invalidHLine= false;
invalidHLineArabic = false;
invalidFLine= false;
invalidFLineArabic = false;
invalidOLine= false;
invalidOLineArabic = false;
invalidResidentTele= false;
invalidResidentTeleArabic =  false;
invalidOfficetelePhone1 = false;
invalidOfficetelePhone1Arabic = false;
invalidOfficetelePhone2 = false;
invalidOfficetelePhone2Arabic = false;
invalidOfficetelePhone3 = false;
invalidOfficetelePhone3Arabic = false;
regexp:RegExp=new RegExp("[^0-9]");

checkValidNumbers(){ 
  var  isValid = true;
  if(this.regexp.test(this.txtId.trim())){
    this.invalidMilitaryId = true;
    isValid  = false;
    }
  
    if(this.regexp.test(this.txtIdArabic.trim())){
      this.invalidMilitaryIdArabic = true;
      isValid  = false;
    }
  if(this.regexp.test(this.txtMobile.trim())){
  this.invalidMobile = true;
  isValid  = false;
  }

  if(this.regexp.test(this.txtMobileArabic.trim())){
    this.invalidMobileArabic = true;
    isValid  = false;
  }

  
    if(this.regexp.test(this.txtDirectLine.trim())){
      this.invalidDLine = true;
      isValid =  false;
    }
    
    if(this.regexp.test(this.txtDirectLineArabic.trim())){
      this.invalidDLineArabic = true;
      isValid =  false;
    }
   
    if(this.regexp.test(this.txtFaxLine.trim())){
      this.invalidFLine = true;
      isValid =  false;
    }

    if(this.regexp.test(this.txtFaxLineArabic.trim())){
      this.invalidFLineArabic = true;
      isValid =  false;
    }
   
      if(this.regexp.test(this.txtResidentTelePhone.trim())){
        this.invalidResidentTele = true;
        isValid =  false;
      }else if(this.regexp.test(this.txtResidentTelePhoneArabic)){
        this.invalidResidentTeleArabic = true;
        isValid =  false;
      }

    if(this.regexp.test(this.txtOfficetelePhone1.trim())){
      this.invalidOfficetelePhone1 = true;
      isValid  = false;
      }
  
      if(this.regexp.test(this.txtOfficetelePhone1Arabic.trim())){
        this.invalidOfficetelePhone1Arabic = true;
        isValid  = false;
      }

      if(this.regexp.test(this.txtOfficetelePhone2.trim())){
      this.invalidOfficetelePhone2 = true;
      isValid  = false;
      }
  
      if(this.regexp.test(this.txtOfficetelePhone2Arabic.trim())){
        this.invalidOfficetelePhone2Arabic = true;
        isValid  = false;
      }

      if(this.regexp.test(this.txtOfficetelePhone3.trim())){
        this.invalidOfficetelePhone3 = true;
        isValid  = false;
        }
    
        if(this.regexp.test(this.txtOfficetelePhone3Arabic.trim())){
          this.invalidOfficetelePhone3Arabic = true;
          isValid  = false;
        }

  return isValid;
}


 resetErrorBoolean() {

  this.errorId = false;
  this.errorIdArabic = false;
  this.errorFName = false;
  this.errorFNameArabic  = false;
  this.errorRank = false;
  this.errorRankArabic = false;
  this.errorPosition  = false;
  this.errorPositionArabic = false;
  this.errorOfficetelePhone1 = false;
  this.errorOfficetelePhone1Arabic = false;
  this.errorMobile = false;
  this.errorMobileArabic = false;
  this.errorUName= false;
  this.errorUNameArabic = false;
  this.errorDLine= false;
  this.errorDLineArabic = false;
  this.errorFLine= false;
  this.errorFLineArabic = false;
  this.errorResidentTele = false;
  this.errorResidentTeleArabic = false;
  this.errorRManager = false;
  this.errorRManagerArabic = false;
  this.errorOfficetelePhone2 = false;
  this.errorOfficetelePhone2Arabic = false;
  this.errorOfficetelePhone3 = false;
  this.errorOfficetelePhone3Arabic = false;
  this.invalidMobile = false;
  this.invalidMobileArabic = false;

  this.invalidDLine= false;
  this.invalidDLineArabic = false;

  this.invalidFLine= false;
  this.invalidFLineArabic = false;


  this.invalidResidentTele = false;
  this.invalidResidentTeleArabic = false;


  this.invalidOfficetelePhone1 = false;
  this.invalidOfficetelePhone1Arabic = false;
  this.invalidOfficetelePhone2 = false;
  this.invalidOfficetelePhone2Arabic = false;
  this.invalidOfficetelePhone3 = false;
  this.invalidOfficetelePhone3Arabic = false;
 }
}

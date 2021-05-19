import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '../app/shared/translate/translate.service'
import { Http,URLSearchParams} from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: [('./add-new-employee.component.css').toString()]
})
export class AddNewEmployeeComponent implements OnInit {
  
  environment: any = environment;
  txtId :any= "";
  txtUserName : any= "";
  txtName :any= "";
  ddlRank:any="";
  txtPosition:any= "";
  txtSubRank:any="";
  txtSubRankArabic:any="";
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
  ddlRankArabic:any= "";
  txtPositionArabic:any= "";

  txtForceArabic:any= "";
  txtCorpsArabic:any= "";
  txtUnitsArabic:any= "";
  txtRegimentArabic:any= "";
  txtDirectorateArabic:any= "";

  ddlDstList:any= "";
  ddlDstUnit:any= "";
  ddlDstListArabic:any= "";
  ddlDstUnitArabic:any= "";

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
  currentLanguage:any;
  rankList: any[]=[];
  rankListArabic:any[] = [];
  distributionList : any[]= [];
  distributionListArabic : any[]= [];
  distributionUnit : any[]= [];
  distributionUnitArabic : any[]= [];
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
 // rankList: string[]  = ["Major","Major General","Brigadier", "Colonel","Lt Colonel","Captain"];
  //rankListArabic: string[]  = ["رائد","لواء","قائد لواء", "كولونيل","الملازم كولونيل","قائد المنتخب"];
  companyList: string[]=  ["QAF"];
  companyListArabic: string[]=  ["العنق"];

  EmployeeDetails :any[];
 isLangArabic: boolean= false;
  csvUrl: string = './assets/InventoryEnterpriseData.csv';  // URL to Excel
  csvData: any[] = [];
  constructor(private cookieService: CookieService,private http:Http,private router: Router, private _translate: TranslateService) { }

  ngOnInit() {
    if(this.cookieService.get('user') == null || this.cookieService.get('user') == "undefined"){
      this.router.navigate(['/login']);
    }else {
    this.currentLanguage = this._translate.currentLang;
    if(this.currentLanguage == 'ar'){
       this.isLangArabic = true;
    }
    this.getRank();
    this.getDistributionList();
    //this.getForce();
        //this.getRegiment();
        //this.getUnit();
        //this.getCorps();
        //this.getDirectorate();
        
    }
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

  getDistributionList(){
    this.http.get(environment.apikey+"/masterData.php?oper=getDistributionList&language="+ this._translate.currentLang)
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        console.log("value of distribution list is",data);
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
    this.http.get(environment.apikey+"/masterData.php?oper=getDistributionUnitList&language="+ lang+"&id="+encodeURI(Id))
    .map(res => res.json())
    .subscribe(data => {
      if(!!data){
        console.log("value of distribution unit is",data);
        data.sort((a: any,b: any) => a.unit_order - b.unit_order );
        console.log("value of distribution unit after sorting is",data);
        for(var item in data){
          this.distributionUnit.push(data[item].name);
          this.distributionUnitArabic.push(data[item].nameArabic);
     }
            }
    });
  }

  onChange(id:any,lang:any){
    console.log("value of id and lang on add new employee is",id,lang);
    this.getDistributionUnit(id,lang);
  }

SaveNewEmployee(){
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
 'subRankArabic':this.txtSubRank,


 'Position' :this.txtPosition,
 'PositionArabic': this.txtPositionArabic,

'OfficeTelephone1': this.txtOfficetelePhone1,
 'OfficeTelephone1Arabic': this.txtOfficetelePhone1Arabic,

'Mobile': this.txtMobile,
'MobileArabic': this.txtMobileArabic,

 'ResidenceTelephone': this.txtResidentTelePhone,
 'ResidenceTelephoneArabic': this.txtResidentTelePhoneArabic,

  'distributionList': this.ddlDstList,
  'distributionUnit': this.ddlDstUnit,

  'distributionListArabic': this.ddlDstListArabic,
  'distributionUnitArabic': this.ddlDstUnitArabic,


'ReportingManager': this.txtReportingManager,
'ReportingManagerArabic': this.txtReportingManagerArabic,

'OfficeTelephone2':this.txtOfficetelePhone2,
'OfficeTelephone2Arabic': this.txtOfficetelePhone2Arabic,

'OfficeTelephone3': this.txtOfficetelePhone3,
'OfficeTelephone3Arabic': this.txtOfficetelePhone3Arabic,

'DirectLine': this.txtDirectLine,
'DirectLineArabic': this.txtDirectLineArabic,

'FaxLine':this.txtFaxLine,
'FaxLineArabic': this.txtFaxLineArabic,

  };
  let body = new URLSearchParams();
  body.append('table', 'employeeinfo');
  body.append('data',JSON.stringify(empData));  
  body.append('action','add');

this.http.post(environment.apikey+'/generateJsonUrl.php', body)
    .subscribe((data:any) => {
      var obj = JSON.stringify(data["_body"]).trim();
      if(obj == "Employee allready exists"){
        alert(this._translate.currentLang == 'en'?"Employee allready exists.":"الموظف موجود مسبقا.");
       
      }else {
        this.closeAndRedirect();
      }
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

import { Pipe } from '@angular/core';
import { Component,ViewChild } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http,Headers,RequestOptions,URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { FileUtil } from '../app/file.util';
import { Constants } from '../app/csv.constants';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ExcelService} from '../app/shared/excel.service';

Pipe({
  name: 'SearchFilter'
 });
 

 
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-pabx-freeAddress',
  templateUrl: './pabx-freeAddress.component.html',
  styleUrls: [('./pabx-freeAddress.component.css').toString()]
})
export class PabxFreeAddressComponent {
  
  environment: any = environment;
  showHideAllRows: boolean;
  showAdvanceSearch: boolean;
  selectedDeactivateEmployee : any;
  searchableList:any;
  isDesc: boolean = false;
  column: string = 'Name';
  subscription: Subscription;
  nodeSearch: any = '';
  systemSearch : any = '';
  phyAddressSearch : any = '';
  terminalSearch : any = '';
  rackAddressSearch : any = '';
  boardAddressSearch : any = '';
  setAddressSearch:any= '';
  //SMS Observables
  SmsNode: string;
      SmsPhyAddress: string;
      SmsTerminal: string;
      txtToNumber: string;
      //checkbox ngmodel
      checkNode: boolean = false;
      checkPhyAddress: boolean = false;
      checkTerminal: boolean = false;

  public userPermission : any;
  public UserModulePermission: any;
  public UserModuleOperation :any;
  lastUpdatedDate: any;
    //SMS ObservablesEND
  public configObservable = new Subject<string>();
    EmployeeDetails :any[];
    SearchFrc_crp_unit_reg_dir : any= '';
    pager: any = {};// pager object

    // paged items
    pagedItems: any[];
    rankList: any[]=[];//= ["","Major","Major General","Brigadier", "Colonel","Lt Colonel","Captain","lieutenant"];
    forceList: any[]=[];
    unitList: any[]=[];
    corpsList: any[]=[];
    regimentList: any[]=[];
    directorateList: any[]=[];
    distributionListSearch: any = '';
    distributionUnitSearch: any = '';

    distributionList: any[]=[];
    distributionUnit: any[]=[];
    
    // Declare local variable
 direction: number;
 isLangArabic : boolean;
 currentLanguage: string;
 showMenu:boolean;
 sub = new Subject();
 userRoleId : any;
// Change sort function to this: 
@ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private excelService:ExcelService,private formBuilder: FormBuilder,private sharedService: SharedService, private _fileUtil: FileUtil,private router: Router,private cookieService: CookieService,private http:Http,private _localStorageService:LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.userPermission=[];
    this.UserModulePermission=[];
    this.UserModuleOperation=[];

self.showHideAllRows = false;
self.showAdvanceSearch = true;
self.EmployeeDetails = [];
   };
   public searchForm: FormGroup;
   ngOnInit() { 
    if(this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined"){
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if(userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1){
        this.loadData();
       this.userRoleId =  this._localStorageService.get('userRoleId');
        this.searchableList = 
        ['Node','System','Physical_Address','Terminal_Type','Rack_Address','Board_Address','Set_Address']
        this.Permissions();
    this.sharedService.getVisibility().subscribe((value:any) => this.showMenu = value);
    this.searchForm = this.formBuilder.group({
      items: this.formBuilder.array([ this.createItem()])
    });
      }
      
    }else {
      this.router.navigate(['/login']);
    }

    
   }
   createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: '',
      fieldValue: '',
    });
  }
  
   get items(): FormArray {
    return this.searchForm.get('items') as FormArray;
  };
  
  addItem(): void {
  this.items.push(this.createItem());
  }
  
  public OnSubmit(formValue: any) {
  let body = new URLSearchParams();
  body.append('items',JSON.stringify(formValue));
  body.append('action',"free_adresses");
  
this.http.post(environment.apikey+'/generateJsonUrl.php', body)
.map(res => res.json())
    .subscribe((res:any) => {
      if(res.code == 100){
        this.EmployeeDetails= res.data;
      }else{
        this.EmployeeDetails=[];
      }
    }, error => {
        console.log(error.json());
    });
    }

    cancelSearch(){
      this.loadData();
      this.searchForm = this.formBuilder.group({
        items: this.formBuilder.array([ this.createItem()])
      });
    }

    resetSearchDropDownValues(){
    $('.searchRank').prop('selectedIndex','0');
    $(".search-distributionList").prop('selectedIndex','0');
    $(".search-distributionUnit").prop('selectedIndex','0');
}

  Permissions(){
    this.userPermission = JSON.parse(this._localStorageService.get('userPermission'));
    let UserModulePermissionArr:any = [];
    let UserModuleOperationArr:any = [];

    for (let key in this.userPermission) {
        if(key == 'OtherInfo'){
          let value = this.userPermission[key];
          for (let key2 in value) {
            let value2 = value[key2];
            value2.forEach((value3:any,key3:any) => {
              key3 = key3;
              if(value3.selected){
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
              }
              this.UserModuleOperation.push({'page_id':value3.id,'operations':UserModuleOperationArr});
              UserModuleOperationArr = [];
            });
          }
        }
    }
    this.UserModulePermission = UserModulePermissionArr;
  }
  
  
  checkOperation(page_id:any,operation_id:any){
    let operations = [];
    for (let key in this.UserModuleOperation) {
      let value = this.UserModuleOperation[key];
      if(value.page_id == page_id){
        operations = value.operations;
      }
    }    
    return operations.indexOf(operation_id) > -1;
  }

  nodeArray:any=[];
  terminalTypeArray:any = [];
  getNodeArray(){
    this.nodeArray=[];
    for (var _i = 0; _i < 50; _i++) {
      if(_i != 12 && _i != 13){
     this.nodeArray.push('Node '+_i)
      }
     }
  }



public searchKeyArray: any=[];
  loadData(){
    this.searchKeyArray=[{"item":"Node","label":"Node"},{"item":"System","label":"System"},{"item":"Physical_Address","label":"Physical Address"},{"item":"Terminal_Type","label":"Terminal Type"},{"item":"Rack_Address","label":"Rack Address"},{"item":"Board_Address","label":"Board Address"},{"item":"Set_Address","label":"Set Address"},{"item":"status","label":"status"}];
    this.terminalTypeArray = [];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action',"free_adresses");
    
  this.http.post(environment.apikey+'/generateJsonUrl.php', body)
   .map(res => res.json()).subscribe((res:any) => {
        if(res.code == 100){
          let keysT = Object.keys(res.data[0]);
          for(var item in res.terminalType){
            this.terminalTypeArray.push(res.terminalType[item]);
          }
          this.EmployeeDetails= res.data;
          this.getNodeArray();
          this.lastUpdatedDate = res.lastDate;
        }else{
          this.EmployeeDetails=[];
        }
      });

    if(this.currentLanguage == 'en'){
      this.isLangArabic = false;
    }else {
      this.isLangArabic = true;
    }
  }

 
 

  onChange(event:any, formvalue: any)
  {
    // console.log("value of event is",event);
    // console.log("value of form is",formvalue);
    // for(let i = 0;i<formvalue.items.length; i++){
    //   formvalue.items[i].fieldValue
    // }
    let value = event.target.value;
   if(value == 'Node'){
    $(event.target).parent().find('input').addClass('hide').removeClass('inline-display');
    $(event.target).parent().find('.form-select').addClass('hide').removeClass('inline-display');
    $(event.target).parent().find('.form-select.node-select').removeClass('hide').addClass('inline-display');
   }
   else if(value == 'Terminal_Type'){
    $(event.target).parent().find('input').addClass('hide').removeClass('inline-display');
    $(event.target).parent().find('.form-select').addClass('hide').removeClass('inline-display');
    $(event.target).parent().find('.form-select.terminal-select').removeClass('hide').addClass('inline-display'); 
   }
   else {
     $(event.target).parent().find('input').removeClass('hide').addClass('inline-display');
    $(event.target).parent().find('.form-select').addClass('hide').removeClass('inline-display');
   }
 }

  

  
  

  

  deleteAction(i: number) {
	  this.items.removeAt(i);
  }



  

  sort(property:any){
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  exportToExcel(event:any) {
    let dataArray = this.EmployeeDetails;
      for(var item in dataArray){ // removing unnecessary column before export.
       delete dataArray[item].id;
       delete dataArray[item].status;
      }
   this.excelService.download(dataArray,'export_pabx_freeAddress');
  }

  setClickedRow = function(emp:any){
    emp.highLightRow = !emp.highLightRow;
}

  showUploaPopUp(){
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }
fileList:any;
  fileChangeListener(event:any): void {
//file upload event  
var target = event.target || event.srcElement;
var files = target.files;
if(Constants.validateHeaderAndRecordLengthFlag){
        if(!this._fileUtil.isCSVFile(files[0])){
          alert(this._translate.currentLang == 'en'?"Please import valid .csv file.":"الرجاء استيراد ملف .csv صالح.");
          this.fileReset();
        }
      }
    this.fileList = event.target.files;  
}
  fileReset(){
    this.fileImportInput.nativeElement.value = "";
  }
  import(){
    if (this.fileList.length > 0) { 
      $('.app-loader').show(); 
      let file: File = this.fileList[0];  
      let formData: FormData = new FormData();  
      formData.append('module',"free_adresses");
      formData.append('csv_data', file, file.name);  
      let headers = new Headers()  
      //headers.append('Content-Type', 'json');  
      //headers.append('Accept', 'application/json');  
      let options = new RequestOptions({ headers: headers });  
      let apiUrl1 = environment.apikey+"/pabx_csv_import.php";  
      this.http.post(apiUrl1, formData, options).subscribe(data =>{
        data = data;
        this.loadData();
        $('.app-loader').hide();
        this.hidePopUp('modalImport');
        alert("Import done successfully.");
        
        },  
      error =>{ console.log(error)  }
      ); 
      }
  }
  showDeactivateEmployeePopup(emp:any){
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateEmployee = emp;
  }

  

  hidePopUp(popUpId:any)
  { 
    $('#'+popUpId).modal('hide');
  }

  showSMSPopup(employee: any) {
    this.resetSmsValue();
    this.SmsNode = employee.Node;
    this.SmsPhyAddress = employee.Physical_Address;
    this.SmsTerminal = employee.Terminal_Type;
    
    $('#modalSendSMS').modal('show');
  }

  checkAllCheckbox() {
    if ($("#checkAllIds").prop("checked") && this.SmsNode != '') {
      this.checkNode = true;
    } else {
      this.checkNode = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsPhyAddress != '') {
      this.checkPhyAddress = true;
    } else {
      this.checkPhyAddress = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsTerminal != '') {
      this.checkTerminal = true;
    } else {
      this.checkTerminal = false;
    }
  }

  sendSMS() {

    if (this.txtToNumber.trim().length > 0) {
      var receipents = this.txtToNumber.trim();
    } else {
      alert(this._translate.currentLang == 'en' ? "enter recipent no." : "أدخل المستلم لا.");
      return false;
    }
    var message = '';
    if (this.checkNode == true) {

      message +="Node:" + this.SmsNode.trim() + "\n";
    }
    if (this.checkPhyAddress == true) {
      message += "Physcial Address:"+ this.SmsPhyAddress.trim() + "\n";

    }
    if (this.checkTerminal == true) {
      message +="Terminal Type:"+ this.SmsTerminal.trim() + "\n";
    }

    let body = new URLSearchParams();
    body.append('recipient', receipents);
    body.append('message', message);
    body.append('action', 'sendSms');
    body.append('recipientContact', '0');
    console.log("value of body",body);
    this.http.post(environment.apikey + '/generateJsonUrl.php?language=' + this._translate.currentLang, body)
      .subscribe((data: any) => {
        var obj = JSON.stringify(data["_body"]).trim();
        this.hidePopUp('modalSendSMS');
      }, error => {
        console.log(error.json());
      });
  }
  resetSmsValue() {
    this.txtToNumber = "";
    this.checkNode = false;
    this.checkPhyAddress = false;
    this.checkPhyAddress = false;
  }

toggleMenu(){
  this.showMenu = !this.showMenu;
  this.sharedService.setMenuVisibility(this.showMenu);
}


};
  
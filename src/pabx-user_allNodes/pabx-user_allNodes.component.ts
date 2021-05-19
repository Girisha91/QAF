import { Pipe } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { FileUtil } from '../app/file.util';
import { Constants } from '../app/csv.constants';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from '../app/shared/excel.service';

Pipe({
  name: 'SearchFilter'
});

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'app-pabx-allUser',
  templateUrl: './pabx-user_allNodes.component.html',
  styleUrls:[('./pabx-user_allNodes.component.css').toString()]
})
export class PabxUserAllNodesComponent {

  environment: any = environment;
  showHideAllRows: boolean;
  showAdvanceSearch: boolean;
  selectedDeactivateEmployee: any;
  searchableList: any;
  isDesc: boolean = false;
  column: string = 'Name';
  subscription: Subscription;
  nodeSearch: any = '';
  systemSearch: any = '';
  phyAddressSearch: any = '';
  terminalSearch: any = '';
  rackAddressSearch: any = '';
  boardAddressSearch: any = '';
  setAddressSearch: any = '';
  //SMS Observables
  SmsDir_No: string;
  SmsLoc: string;
  SmsBAddress: string;
  SmsSetType: any;
  SmsConnectedWall: any;
  SmsDpInfo: any;
  SmsDistInfo: string;
  SmsDirName: string;
  SmsShelfAdd: string;
  SmsEquipmentAdd: string;
  SmsMdfInfo: any;
  SmsAccessInfo: any;
  SmsCoreInfo: any;
  SmsSdhInfo: any;
  lastUpdatedDate: any;
  txtToNumber: string;
  //checkbox ngmodel

  checkDir_No: boolean = false;
  checkLoc: boolean = false;
  checkBAddress: boolean = false;
  checkSetType: boolean = false;
  checkDisList: boolean = false;
  checkConnectedWall: boolean = false;
  checkDpInfo: boolean = false;
  checkDistInfo: boolean = false;
  checkDirName: boolean = false;
  checkShelfAdd: boolean = false;
  checkEquipAddress: boolean = false;
  checkMdfInfo: boolean = false;
  checkAccessInfo: boolean = false;
  checkCoreInfo: boolean = false;
  checkSdhInfo: boolean = false;



  public userPermission: any;
  public UserModulePermission: any;
  public UserModuleOperation: any;

  //SMS ObservablesEND
  public configObservable = new Subject<string>();
  EmployeeDetails: any[];
  SearchFrc_crp_unit_reg_dir: any = '';
  pager: any = {};// pager object

  // paged items
  pagedItems: any[];


  // Declare local variable
  direction: number;
  isLangArabic: boolean;
  currentLanguage: string;
  showMenu: boolean;
  sub = new Subject();
  userRoleId: any;
  // Change sort function to this: 
  @ViewChild('fileImportInput')
  fileImportInput: any;

  constructor(private excelService: ExcelService, private formBuilder: FormBuilder, private sharedService: SharedService, private _fileUtil: FileUtil, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {

    let self = this;
    this.userPermission = [];
    this.UserModulePermission = [];
    this.UserModuleOperation = [];

    self.showHideAllRows = false;
    self.showAdvanceSearch = true;
    self.EmployeeDetails = [];
  };
  public searchForm: FormGroup;
  ngOnInit() {
    if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
      var userCookie = JSON.parse(this.cookieService.get('user'));
      if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
        this.loadData();
        this.userRoleId = this._localStorageService.get('userRoleId');
        this.searchableList =
          ['Node', 'System', 'Physical_Address', 'Terminal_Type', 'Rack_Address', 'Board_Address', 'Set_Address']
        this.Permissions();
        this.sharedService.getVisibility().subscribe((value: any) => this.showMenu = value);
        this.searchForm = this.formBuilder.group({
          items: this.formBuilder.array([this.createItem()])
        });
      }

    } else {
      this.router.navigate(['/login']);
    }


  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      fieldName: '',
      fieldValue: '',
    });
  }

  deleteAction(i: number) {
    this.items.removeAt(i);
  }

  get items(): FormArray {
    return this.searchForm.get('items') as FormArray;
  };

  addItem(): void {
    this.items.push(this.createItem());
  }

  public OnSubmit(formValue: any) {
    for (var i = 0; i < formValue.items.length; i++) {
      if (formValue.items[i].fieldName == 'Node') {
        var Node = formValue.items[i].fieldValue.split(' ');
        var NodeNumber = Node[1];
        if (NodeNumber < '10') {
          var formattedNodeNumber = Number(NodeNumber[1]);
          formValue.items[i].fieldValue = 'Node ' + formattedNodeNumber;
        }
      }
    }
    let body = new URLSearchParams();
    body.append('items', JSON.stringify(formValue));
    body.append('action', "users_all_node");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json())
      .subscribe((res: any) => {
        if (res.code == 100) {
          this.EmployeeDetails = res.data;
        } else {
          this.EmployeeDetails = [];
        }
      }, error => {
        console.log(error.json());
      });
  }

  cancelSearch() {
    this.loadData();
    this.searchForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()])
    });
  }

  resetSearchDropDownValues() {
    $('.searchRank').prop('selectedIndex', '0');
    $(".search-distributionList").prop('selectedIndex', '0');
    $(".search-distributionUnit").prop('selectedIndex', '0');
  }

  Permissions() {
    this.userPermission = JSON.parse(this._localStorageService.get('userPermission'));
    let UserModulePermissionArr: any = [];
    let UserModuleOperationArr: any = [];

    for (let key in this.userPermission) {
      if (key == 'OtherInfo') {
        let value = this.userPermission[key];
        for (let key2 in value) {
          let value2 = value[key2];
          value2.forEach((value3: any, key3: any) => {
            key3 = key3;
            if (value3.selected) {
              UserModulePermissionArr.push(value3.id);
            }
            for (let key4 in value3) {
              let value4 = value3[key4];
              if (key4 == 'operation_pages') {
                for (let key5 in value4) {
                  let value5 = value4[key5];
                  if (value5.selected) {
                    if (value5.selected) {
                      UserModuleOperationArr.push(value5.id);
                    }
                  }
                }
              }
            }
            this.UserModuleOperation.push({ 'page_id': value3.id, 'operations': UserModuleOperationArr });
            UserModuleOperationArr = [];
          });
        }
      }
    }
    this.UserModulePermission = UserModulePermissionArr;
  }


  checkOperation(page_id: any, operation_id: any) {
    let operations = [];
    for (let key in this.UserModuleOperation) {
      let value = this.UserModuleOperation[key];
      if (value.page_id == page_id) {
        operations = value.operations;
      }
    }
    return operations.indexOf(operation_id) > -1;
  }

  nodeArray: any = [];
  getNodeArray() {
    this.nodeArray = [];
    for (var _i = 0; _i < 50; _i++) {
      if (_i >= 0 && _i <10 ){
        this.nodeArray.push('Node ' + '0' + _i)
      }
      else if (_i != 12 && _i != 13) {
        this.nodeArray.push('Node ' + _i)
      }
    }
  }

  public searchKeyArray: any = [];
  loadData() {
    $('.app-loader').show();
    this.searchKeyArray = [
      {
        "item":"Node",
        "label":"Node"
      },
      {
        "item":"Directory_Number",
        "label":"Directory Number"
      },
      {
        "item":"Directory_name",
        "label":"Directory name"
      },
      {
        "item":"Directory_First_Name",
        "label":"Directory First Name"
      },
      {
        "item":"UTF_8_Directory_Name",
        "label":"UTF 8 Directory Name"
      },
      {
        "item":"UTF_8_Directory_First_Name",
        "label":"UTF 8 Directory First Name"
      },
      {
        "item":"Location_Node",
        "label":"Location Node"
      },
      {
        "item":"Shelf_Address",
        "label":"Shelf Address"
      },
      {
        "item":"Board_Address",
        "label":"Board Address"
      },
      {
        "item":"Equipment_Address",
        "label":"Equipment Address"
      },
      {
        "item":"Set_Type",
        "label":"Set Type"
      },
      {
        "item":"Entity_Number",
        "label":"Entity Number"
      },
      {
        "item":"Set_Function",
        "label":"Set Function"
      },
      {
        "item":"Profile_Name",
        "label":"Profile Name"
      },
      {
        "item":"Key_Profiles",
        "label":"Key Profiles"
      },
      {
        "item":"Domain_Identifier",
        "label":"Domain Identifier"
      },
      {
        "item":"URL_UserName",
        "label":"URL UserName"
      },
      {
        "item":"URL_Domain",
        "label":"URL Domain"
      },
      {
        "item":"SIP_Authentication",
        "label":"SIP Authentication"
      },
      {
        "item":"SIP_Passwd",
        "label":"SIP Passwd"
      },
      {
        "item":"External_Gateway_Number",
        "label":"External Gateway Number"
      },
      {
        "item":"Gateway_type",
        "label":"Gateway type"
      },
      {
        "item":"Add_On_Module_1",
        "label":"Add On Module 1"
      },
      {
        "item":"Add_On_Module_2",
        "label":"Add On Module 2"
      },
      {
        "item":"Add_On_Module_3",
        "label":"Add On Module 3"
      },
      {
        "item":"External_Alphanumeric_Keyboard",
        "label":"External Alphanumeric Keyboard"
      },
      {
        "item":"Internal_AlphanumKeyboard",
        "label":"Internal AlphanumKeyboard"
      },
      {
        "item":"V24_Extension",
        "label":"V24 Extension"
      },
      {
        "item":"S0_Extension",
        "label":"S0 Extension"
      },
      {
        "item":"MACPC",
        "label":"MACPC"
      },
      {
        "item":"Z_Adapter",
        "label":"Z Adapter"
      },
      {
        "item":"Language_ID",
        "label":"Language ID"
      },
      {
        "item":"Secret_Code",
        "label":"Secret Code"
      },
      {
        "item":"Associated_Set_No",
        "label":"Associated Set No"
      },
      {
        "item":"Cost_Center_ID",
        "label":"Cost Center ID"
      },
      {
        "item":"Cost_Center_Name",
        "label":"Cost Center Name"
      },
      {
        "item":"Charging_COS",
        "label":"Charging COS"
      },
      {
        "item":"Public_Network_COS",
        "label":"Public Network COS"
      },
      {
        "item":"External_Forwarding_COS",
        "label":"External Forwarding COS"
      },
      {
        "item":"Phone_Features_COS",
        "label":"Phone Features COS"
      },
      {
        "item":"Connection_COS",
        "label":"Connection COS"
      },
      {
        "item":"Hunt_Group_Dir_No",
        "label":"Hunt Group Dir No"
      },
      {
        "item":"ACD_Group_Directory_No",
        "label":"ACD Group Directory No"
      },
      {
        "item":"Pickup_Group_Name",
        "label":"Pickup Group Name"
      },
      {
        "item":"Reserved_Time_Slot",
        "label":"Reserved Time Slot"
      },
      {
        "item":"Voice_Mail_DirNo",
        "label":"Voice Mail DirNo"
      },
      {
        "item":"Voice_Mail_Type",
        "label":"Voice Mail Type"
      },
      {
        "item":"col4630_access_without_Code",
        "label":"col4630 access without Code"
      },
      {
        "item":"Paging_Trunk_Group",
        "label":"Paging Trunk Group"
      },
      {
        "item":"Paging_Beeper",
        "label":"Paging Beeper"
      },
      {
        "item":"Called_Associated_DECT_set",
        "label":"Called Associated DECT set"
      },
      {
        "item":"Tele_Marketing_Agent",
        "label":"Tele Marketing Agent"
      },
      {
        "item":"ISDN_UserExternal",
        "label":"ISDN UserExternal"
      },
      {
        "item":"ISDN_UserInternal",
        "label":"ISDN UserInternal"
      },
      {
        "item":"ISDN_UserDisplay_ext_calling_number",
        "label":"ISDN UserDisplay ext calling number"
      },
      {
        "item":"ISDN_Teleservice",
        "label":"ISDN Teleservice"
      },
      {
        "item":"Hotel_Set_Operation",
        "label":"Hotel Set Operation"
      },
      {
        "item":"Type_of_room",
        "label":"Type of room"
      },
      {
        "item":"Use_Type_Of_Dir_No",
        "label":"Use Type Of Dir No"
      },
      {
        "item":"Number_Of_Set_Users",
        "label":"Number Of Set Users"
      },
      {
        "item":"Dial_by_name_and_text_msg",
        "label":"Dial by name and text msg"
      },
      {
        "item":"Text_msg_number",
        "label":"Text msg number"
      },
      {
        "item":"Multi_line_station",
        "label":"Multi line station"
      },
      {
        "item":"Multi_Line_PropertiesAutomatic_Incoming_Seizure",
        "label":"Multi Line PropertiesAutomatic Incoming Seizure"
      },
      {
        "item":"Multi_Line_PropertiesAutomatic_Outgoing_Seizure",
        "label":"Multi Line PropertiesAutomatic Outgoing Seizure"
      },
      {
        "item":"Multi_Line_PropertiesSelective_Filtering",
        "label":"Multi Line PropertiesSelective Filtering"
      },
      {
        "item":"Multi_Line_PropertiesOverflow_on_no_answer",
        "label":"Multi Line PropertiesOverflow on no answer"
      },
      {
        "item":"Multi_Line_PropertiesOverflow_on_busy",
        "label":"Multi Line PropertiesOverflow on busy"
      },
      {
        "item":"Multi_Line_PropertiesSupervision_at_off_hook",
        "label":"Multi Line PropertiesSupervision at off hook"
      },
      {
        "item":"Multi_Line_PropertiesAutomatic_Outgoing_Seizure_for_MLA",
        "label":"Multi Line PropertiesAutomatic Outgoing Seizure for MLA"
      },
      {
        "item":"S0_FeatureUser_By_Default",
        "label":"S0 FeatureUser By Default"
      },
      {
        "item":"S0_FeatureSub_address_Use",
        "label":"S0 FeatureSub address Use"
      },
      {
        "item":"Dialed_number_masked",
        "label":"Dialed number masked"
      },
      {
        "item":"Access_Code_to_UUS_messages",
        "label":"Access Code to UUS messages"
      },
      {
        "item":"Routing_Table",
        "label":"Routing Table"
      },
      {
        "item":"Associated_Videophone",
        "label":"Associated Videophone"
      },
      {
        "item":"VIP_Very_Important_Pers",
        "label":"VIP Very Important Pers"
      },
      {
        "item":"Assistant_Directory_Number",
        "label":"Assistant Directory Number"
      },
      {
        "item":"Calls_Priority",
        "label":"Calls Priority"
      },
      {
        "item":"DATA_Connection_COS",
        "label":"DATA Connection COS"
      },
      {
        "item":"Message_LED",
        "label":"Message LED"
      },
      {
        "item":"PCBT_Associated",
        "label":"PCBT Associated"
      },
      {
        "item":"Urgent_Call",
        "label":"Urgent Call"
      },
      {
        "item":"ExtAlarm_Equipment",
        "label":"ExtAlarm Equipment"
      },
      {
        "item":"col4630_Mail_Box4630_Voice_Mail_Type",
        "label":"col4630 Mail Box4630 Voice Mail Type"
      },
      {
        "item":"col4630_Mail_Box4630_COSNetwork_Prefixes_authorized",
        "label":"col4630 Mail Box4630 COSNetwork Prefixes authorized"
      },
      {
        "item":"col4630_Mail_Box4630_COSPersonal_lists_authorized",
        "label":"col4630 Mail Box4630 COSPersonal lists authorized"
      },
      {
        "item":"col4630_Mail_Box4630_COSGeneral_Lists_authorized",
        "label":"col4630 Mail Box4630 COSGeneral Lists authorized"
      },
      {
        "item":"col4630_Mail_Box4630_COSVoice_Mail_Manager",
        "label":"col4630 Mail Box4630 COSVoice Mail Manager"
      },
      {
        "item":"col4630_Mail_Box4630_COSDuration_of_RefGreeting",
        "label":"col4630 Mail Box4630 COSDuration of RefGreeting"
      },
      {
        "item":"col4630_Mail_Box4630_COSConversation_authorized",
        "label":"col4630 Mail Box4630 COSConversation authorized"
      },
      {
        "item":"col4630_Mail_Box4630_COSCOS_of_Greeting",
        "label":"col4630 Mail Box4630 COSCOS of Greeting"
      },
      {
        "item":"col4635_Mail_Box4635_Voice_Mail_Type",
        "label":"col4635 Mail Box4635 Voice Mail Type"
      },
      {
        "item":"col4635_Mail_Box4635_COS",
        "label":"col4635 Mail Box4635 COS"
      },
      {
        "item":"X25_DTE",
        "label":"X25 DTE"
      },
      {
        "item":"PIN_Personal_IdentNoPIN_No",
        "label":"PIN Personal IdentNoPIN No"
      },
      {
        "item":"PIN_Personal_IdentNoPIN_With_Secret_Code",
        "label":"PIN Personal IdentNoPIN With Secret Code"
      },
      {
        "item":"PIN_Personal_IdentNoType_of_control",
        "label":"PIN Personal IdentNoType of control"
      },
      {
        "item":"PIN_Personal_IdentNoPIN_group_number",
        "label":"PIN Personal IdentNoPIN group number"
      },
      {
        "item":"Can_be_CalledDialed_By_Name",
        "label":"Can be CalledDialed By Name"
      },
      {
        "item":"Phone_book_Name_Dial_by_name",
        "label":"Phone book Name Dial by name"
      },
      {
        "item":"Phone_book_First_Name",
        "label":"Phone book First Name"
      },
      {
        "item":"Displayed_Name",
        "label":"Displayed Name"
      },
      {
        "item":"Modem_Trunk_Group_InfoTrunk_Group_ID",
        "label":"Modem Trunk Group InfoTrunk Group ID"
      },
      {
        "item":"Modem_Trunk_Group_InfoTrunk_Number",
        "label":"Modem Trunk Group InfoTrunk Number"
      },
      {
        "item":"Remote_UA",
        "label":"Remote UA"
      },
      {
        "item":"Errors_on_Secret_Code_Counter",
        "label":"Errors on Secret Code Counter"
      },
      {
        "item":"ACD_station",
        "label":"ACD station"
      },
      {
        "item":"NS_Right_Notification_server",
        "label":"NS Right Notification server"
      },
      {
        "item":"Incidents_Teleservice",
        "label":"Incidents Teleservice"
      },
      {
        "item":"Ghost_Z",
        "label":"Ghost Z"
      },
      {
        "item":"Ghost_Z_Feature",
        "label":"Ghost Z Feature"
      },
      {
        "item":"VAD_use_for_Ghost_Z",
        "label":"VAD use for Ghost Z"
      },
      {
        "item":"CSTA_routing",
        "label":"CSTA routing"
      },
      {
        "item":"CMF_4600_DTMF_frequencies",
        "label":"CMF 4600 DTMF frequencies"
      },
      {
        "item":"Voice_Guide_listening_Class",
        "label":"Voice Guide listening Class"
      },
      {
        "item":"Caller_COS",
        "label":"Caller COS"
      },
      {
        "item":"VSI_Transparency",
        "label":"VSI Transparency"
      },
      {
        "item":"Type_of_Keyboard",
        "label":"Type of Keyboard"
      },
      {
        "item":"Errors_on_Business_Code_Counter",
        "label":"Errors on Business Code Counter"
      },
      {
        "item":"STAP",
        "label":"STAP"
      },
      {
        "item":"TandemTandem_Directory_Number",
        "label":"TandemTandem Directory Number"
      },
      {
        "item":"TandemMain_set_in_the_tandem",
        "label":"TandemMain set in the tandem"
      },
      {
        "item":"TandemPartial_busy",
        "label":"TandemPartial busy"
      },
      {
        "item":"TandemRinging_in_partial_busy",
        "label":"TandemRinging in partial busy"
      },
      {
        "item":"TandemSpecific_supervision",
        "label":"TandemSpecific supervision"
      },
      {
        "item":"Use_Personal_Calling_Number",
        "label":"Use Personal Calling Number"
      },
      {
        "item":"Private_Calling_Number",
        "label":"Private Calling Number"
      },
      {
        "item":"UA_3G_featuresEmulation",
        "label":"UA 3G featuresEmulation"
      },
      {
        "item":"col4035_FeaturesNavigator",
        "label":"col4035 FeaturesNavigator"
      },
      {
        "item":"Group_PIN_control",
        "label":"Group PIN control"
      },
      {
        "item":"User_group_by_PIN",
        "label":"User group by PIN"
      },
      {
        "item":"CCA_Operations",
        "label":"CCA Operations"
      },
      {
        "item":"A4980",
        "label":"A4980"
      },
      {
        "item":"Z_IVR",
        "label":"Z IVR"
      },
      {
        "item":"NOMADIC",
        "label":"NOMADIC"
      },
      {
        "item":"TAPI_premium_server",
        "label":"TAPI premium server"
      },
      {
        "item":"col4615_Mail_Box4615_Voice_Mail_Type",
        "label":"col4615 Mail Box4615 Voice Mail Type"
      },
      {
        "item":"col4615_Mail_BoxNotification_Type",
        "label":"col4615 Mail BoxNotification Type"
      },
      {
        "item":"col4645_Voice_Mail_Box4645_Voice_Mail_Type",
        "label":"col4645 Voice Mail Box4645 Voice Mail Type"
      },
      {
        "item":"col4645_Voice_Mail_Box4645_Class_of_Service",
        "label":"col4645 Voice Mail Box4645 Class of Service"
      },
      {
        "item":"Conference_group",
        "label":"Conference group"
      },
      {
        "item":"Announcement_group",
        "label":"Announcement group"
      },
      {
        "item":"Call_Restriction_COS",
        "label":"Call Restriction COS"
      },
      {
        "item":"Applicable_Restriction_COS",
        "label":"Applicable Restriction COS"
      },
      {
        "item":"Implicit_PriorityActivation_mode",
        "label":"Implicit PriorityActivation mode"
      },
      {
        "item":"Implicit_PriorityPriority_Level",
        "label":"Implicit PriorityPriority Level"
      },
      {
        "item":"Explicit_PriorityActivation_mode",
        "label":"Explicit PriorityActivation mode"
      },
      {
        "item":"Explicit_PriorityPriority_Level",
        "label":"Explicit PriorityPriority Level"
      },
      {
        "item":"Pre_emptable_Primary_Inc_Line",
        "label":"Pre emptable Primary Inc Line"
      },
      {
        "item":"Pre_emptable_Secondary_Inc_Line",
        "label":"Pre emptable Secondary Inc Line"
      },
      {
        "item":"Priority_Presentation",
        "label":"Priority Presentation"
      },
      {
        "item":"Ith_Service_type",
        "label":"Ith Service type"
      },
      {
        "item":"Ith_Activation_mode",
        "label":"Ith Activation mode"
      },
      {
        "item":"Ith_Profile_list",
        "label":"Ith Profile list"
      },
      {
        "item":"Recorder_Directory_Number",
        "label":"Recorder Directory Number"
      },
      {
        "item":"CUG_List_Number",
        "label":"CUG List Number"
      },
      {
        "item":"Preferential_CUG",
        "label":"Preferential CUG"
      },
      {
        "item":"CUG_Outgoing_Access",
        "label":"CUG Outgoing Access"
      },
      {
        "item":"CUG_Incoming_Access",
        "label":"CUG Incoming Access"
      },
      {
        "item":"Automatic_reconfiguration",
        "label":"Automatic reconfiguration"
      },
      {
        "item":"Associated_RSI",
        "label":"Associated RSI"
      },
      {
        "item":"CLIP",
        "label":"CLIP"
      },
      {
        "item":"CPC_Timer",
        "label":"CPC Timer"
      },
      {
        "item":"Compatible_CLIP_display",
        "label":"Compatible CLIP display"
      },
      {
        "item":"Analog_type",
        "label":"Analog type"
      },
      {
        "item":"status",
        "label":"status"
      },
      {
        "item":"mdf_info",
        "label":"mdf info"
      },
      {
        "item":"dp_info",
        "label":"dp info"
      },
      {
        "item":"connected_wall_socket_info",
        "label":"connected wall socket info"
      },
      {
        "item":"access_swport_info",
        "label":"access swport info"
      },
      {
        "item":"dist_switch_info",
        "label":"dist switch info"
      },
      {
        "item":"core_switch_info",
        "label":"core switch info"
      },
      {
        "item":"sdh_spo_info",
        "label":"sdh spo info"
      },
      {
        "item":"Remarks",
        "label":"Remarks"
      }
    ];
    this.currentLanguage = this._localStorageService.get("CurrentLanguage");
    this._translate.use(this.currentLanguage);
    let userSession = JSON.parse(this.cookieService.get('user'));

    let body = new URLSearchParams();
    body.append('action', "users_all_node");

    this.http.post(environment.apikey + '/generateJsonUrl.php', body)
      .map(res => res.json()).subscribe((res: any) => {
        if (res.code == 100) {
          this.EmployeeDetails = res.data;
          this.getNodeArray();
          this.lastUpdatedDate = res.lastDate;
        } else {
          this.EmployeeDetails = [];
        }
        $('.app-loader').hide();
      }
      );

    if (this.currentLanguage == 'en') {
      this.isLangArabic = false;
    } else {
      this.isLangArabic = true;
    }
  }

  onChange(event: any) {
    let value = event.target.value;
    if (value == 'Node') {
      $(event.target).parent().find('input').addClass('hide').removeClass('inline-display');
      $(event.target).parent().find('.node-select').removeClass('hide').addClass('inline-display');

    } else {
      $(event.target).parent().find('input').removeClass('hide').addClass('inline-display');
      $(event.target).parent().find('.node-select').addClass('hide').removeClass('inline-display');
    }
  }

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };

  exportToExcel(event: any) {
    let dataArray = this.EmployeeDetails;
    for (var item in dataArray) { // removing unnecessary column before export.
      delete dataArray[item].id;
      delete dataArray[item].status;
    }
    this.excelService.download(dataArray, 'export_pabx_user_allNodes');
  }

  showUploadPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalImport').modal('show');
  }

  showMdfUploadPopUp() {
    this.fileImportInput.nativeElement.value = "";
    $('#modalMdfImport').modal('show');
  }
fileList:any;
  fileChangeListener(event: any,moduleName:string,popUpId:string): void {
    //file upload event  
    var target = event.target || event.srcElement;
    var files = target.files;
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this._fileUtil.isCSVFile(files[0])) {
        alert(this._translate.currentLang == 'en' ? "Please import valid .csv file." : "الرجاء استيراد ملف .csv صالح.");
        this.fileReset();
      }
    }

    this.fileList= event.target.files;
  }
  import(){
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();

      formData.append('module','users_all_node');
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/pabx_csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        $('.app-loader').hide();
        this.hidePopUp('modalImport');
        alert("Import done successfully.");

      },
        error => { console.log(error) }
      );
    }
  }
  importMdf(){
    if (this.fileList.length > 0) {
      $('.app-loader').show();
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();

      formData.append('module','users_all_node');
      formData.append('csv_data', file, file.name);
      let headers = new Headers()
      let options = new RequestOptions({ headers: headers });
      let apiUrl1 = environment.apikey + "/pabx_csv_import.php";
      this.http.post(apiUrl1, formData, options).subscribe(data => {
        data = data;
        this.loadData();
        $('.app-loader').hide();
        this.hidePopUp('modalMdfImport');
        alert("Import done successfully.");

      },
        error => { console.log(error) }
      );
    }
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
  }

  showDeactivateEmployeePopup(emp: any) {
    $('#modalDeactivate').modal('show');
    this.selectedDeactivateEmployee = emp;
  }

  hidePopUp(popUpId: any) {
    $('#' + popUpId).modal('hide');
  }

  checkAllCheckbox() {
    if ($("#checkAllIds").prop("checked") && this.SmsDir_No != '') {
      this.checkDir_No = true;
    } else {
      this.checkDir_No = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsLoc != '') {
      this.checkLoc = true;
    } else {
      this.checkLoc = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsBAddress != '') {
      this.checkBAddress = true;
    } else {
      this.checkBAddress = false;
    }
  
    if ($("#checkAllIds").prop("checked") && this.SmsSetType != '') {
      this.checkSetType = true;
    } else {
      this.checkSetType = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsBAddress != '') {
      this.checkDisList = true;
    } else {
      this.checkDisList = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsConnectedWall != '') {
      this.checkConnectedWall = true;
    } else {
      this.checkConnectedWall = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsDpInfo != '') {
      this.checkDpInfo = true;
    } else {
      this.checkDpInfo = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsDistInfo != '') {
      this.checkDistInfo = true;
    } else {
      this.checkDistInfo = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsDirName != '') {
      this.checkDirName = true;
    } else {
      this.checkDirName = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsShelfAdd != '') {
      this.checkShelfAdd = true;
    } else {
      this.checkShelfAdd = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsEquipmentAdd != '') {
      this.checkEquipAddress = true;
    } else {
      this.checkEquipAddress = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsMdfInfo != '') {
      this.checkMdfInfo = true;
    } else {
      this.checkMdfInfo = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsAccessInfo != '') {
      this.checkAccessInfo = true;
    } else {
      this.checkAccessInfo = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsCoreInfo != '') {
      this.checkCoreInfo = true;
    } else {
      this.checkCoreInfo = false;
    }

    if ($("#checkAllIds").prop("checked") && this.SmsSdhInfo != '') {
      this.checkSdhInfo = true;
    } else {
      this.checkSdhInfo = false;
    }
  }
  showSMSPopup(employee: any) {
    this.resetSmsValue();
    this.SmsDir_No = employee.Directory_Number;
    this.SmsDirName = employee.Directory_name;
    this.SmsAccessInfo = employee.access_swport_info;
    this.SmsBAddress = employee.Board_Address;
    this.SmsSetType = employee.Set_Type;
    this.SmsConnectedWall = employee.connected_wall_socket_info;
    this.SmsCoreInfo = employee.core_switch_info;
    this.SmsMdfInfo = employee.mdf_info;
    this.SmsSdhInfo = employee.sdh_spo_info;
    this.SmsDistInfo = employee.dist_switch_info;
    this.SmsDpInfo = employee.dp_info;
    this.SmsEquipmentAdd = employee.Equipment_Address;
    this.SmsLoc = employee.Location_Node;
    this.SmsShelfAdd = employee.Shelf_Address;
    $('#modalSendSMS').modal('show');
  }

  showViewPopup(employee: any) {
    this.resetSmsValue();
    this.SmsDir_No = employee.Directory_Number;
    this.SmsDirName = employee.Directory_name;
    this.SmsAccessInfo = employee.access_swport_info;
    this.SmsBAddress = employee.Board_Address;
    this.SmsSetType = employee.Set_Type;
    this.SmsConnectedWall = employee.connected_wall_socket_info;
    this.SmsCoreInfo = employee.core_switch_info;
    this.SmsMdfInfo = employee.mdf_info;
    this.SmsSdhInfo = employee.sdh_spo_info;
    this.SmsDistInfo = employee.dist_switch_info;
    this.SmsDpInfo = employee.dp_info;
    this.SmsEquipmentAdd = employee.Equipment_Address;
    this.SmsLoc = employee.Location_Node;
    this.SmsShelfAdd = employee.Shelf_Address;
    $('#modalViewUser').modal('show');
  }
  

  Print(id: any){
    // var printContents = document.getElementById(id).innerHTML;
    //  var originalContents = document.body.innerHTML;

    //  document.body.innerHTML = printContents;
    // window.open(printContents);
     window.print();

     /*document.body.innerHTML = originalContents;*/
  }

  filterData(val: any) {
    if (val == 'dir_No') {
      this.checkDir_No = !this.checkDir_No;
    }
    if (val == 'loc') {
      this.checkLoc = !this.checkLoc;
    }
    if (val = 'boardAdd') {
      this.checkBAddress = !this.checkBAddress;
    }
    if (val == 'setType') {
      this.checkSetType = !this.checkSetType;
    }
    if (val == 'connectedWall') {
      this.checkConnectedWall = !this.checkConnectedWall;
    }
    if (val == 'dpInfo') {
      this.checkDpInfo = !this.checkDpInfo;
    }
    if (val == 'distInfo') {
      this.checkDistInfo = !this.checkDistInfo;
    }

    if (val == 'dirName') {
      this.checkDirName = !this.checkDirName;
    }
    if (val == 'shelfAdd') {
      this.checkShelfAdd = !this.checkShelfAdd;
    }
    if (val == 'EquipAdd') {
      this.checkEquipAddress = !this.checkEquipAddress;
    }
    if (val == 'Mdf') {
      this.checkMdfInfo = !this.checkMdfInfo;
    }
    if (val == 'accessInfo') {
      this.checkAccessInfo = !this.checkAccessInfo;
    }
    if (val == 'coreInfo') {
      this.checkCoreInfo = !this.checkCoreInfo;
    }
    if (val == 'sdhInfo') {
      this.checkSdhInfo = !this.checkSdhInfo;
    }
  }

  sendSMS() {
    if (this.txtToNumber.trim().length > 0) {
      var receipents = this.txtToNumber.trim();
    } else {
      alert("enter recipent no.");
      return false;
    }
    var message = '';
    if (this.checkDir_No == true) {
      message += "Directory Number:" + this.SmsDir_No.trim() + "\n";
    }
    if (this.checkLoc == true) {
      message += "Location Node:" + this.SmsLoc.trim() + "\n";

    }
    if (this.checkBAddress == true) {
      message += "Board Address:" + this.SmsBAddress.trim() + "\n";
    }
    if (this.checkSetType == true) {
      message += "Set Type:" + this.SmsSetType.trim() + "\n";
    }
    if (this.checkConnectedWall == true) {
      message += "Connected Wall Info:" + this.SmsConnectedWall.trim() + "\n";
    }
    if (this.checkDpInfo == true) {
      message += "Rank:" + this.SmsDpInfo.trim() + "\n";
    }
    if (this.checkDisList == true) {
      message + "Force_Regiment_Directorate:" + this.SmsDistInfo.trim() + "\n";
    }

    if (this.checkDirName == true) {
      message += "Directiory Name:" + this.SmsDirName.trim() + "\n";
    }

    if (this.checkShelfAdd == true) {
      message += "Shelf Address:" + this.SmsShelfAdd.trim() + "\n";
    }
    if (this.checkEquipAddress == true) {
      message += "Equipment Address:" + this.SmsEquipmentAdd.trim() + "\n";
      //this.SmstelOffice1.trim() +":الهاتف-مكتب 2\n";
    }
    if (this.checkMdfInfo == true) {
      message += "Mdf Info:" + this.SmsMdfInfo.trim() + "\n";
    }

    if (this.checkAccessInfo == true) {
      message += "Access Info:" + this.SmsAccessInfo.trim() + "\n";
    }

    if (this.checkCoreInfo == true) {
      message += "Core Info:" + this.SmsCoreInfo.trim() + "\n";
    }

    if (this.checkSdhInfo == true) {
      message += "Sdh Info:" + this.SmsSdhInfo.trim() + "\n";
    }

    let body = new URLSearchParams();
    body.append('recipient', receipents);
    body.append('message', message);
    body.append('action', 'sendSms');
    body.append('recipientContact', '0');
    this.http.post(environment.apikey + '/generateJsonUrl.php?language=' + this._translate.currentLang, body)
      .subscribe((data: any) => {
        var obj = JSON.stringify(data["_body"]).trim();
        this.hidePopUp('modalSendSMS');
      }, error => {
        console.log(error.json());
      });
  }

  setClickedRow = function(emp:any){
    emp.highLightRow = !emp.highLightRow;
  }

  resetSmsValue() {
    $("#checkAllIds").prop("checked", false);
    this.txtToNumber = "";
    this.checkDir_No = false;
    this.checkLoc = false;
    this.checkBAddress = false;
    this.checkSetType = false;
    this.checkConnectedWall = false;
    this.checkDpInfo = false;
    this.checkDistInfo = false;
    this.checkDirName = false;
    this.checkShelfAdd = false;
    this.checkEquipAddress = false;
    this.checkMdfInfo = false;
    this.checkAccessInfo = false;
    this.checkCoreInfo = false;
    this.checkSdhInfo = false;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.sharedService.setMenuVisibility(this.showMenu);
  }


};


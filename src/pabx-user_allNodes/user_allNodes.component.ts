
import { Pipe } from '@angular/core';
import { Component, ViewChild ,OnInit} from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BsModalModule } from 'ng2-bs3-modal';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import { TranslateService } from '../app/shared/translate/translate.service';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { FileUtil } from '../app/file.util';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../app/csv.constants';
import { environment } from '../environments/environment';
import { SharedService } from '../app/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from '../app/shared/excel.service';
declare var $:any;
@Component({
    selector: 'userAllNodes',
    templateUrl: './user_allNodes.component.html'
})
export class userAllNodesComponent implements OnInit {
    environment: any = environment;
    un: any;
    Id: any;
    title: string;
    isReadOnly: Boolean = false;
    opr: any;
    user_nodes: any;
    currentLanguage: string;
    EmployeeDetails: any[];
    constructor(private excelService: ExcelService, private formBuilder: FormBuilder,private sharedService: SharedService, private _fileUtil: FileUtil,route: ActivatedRoute, private router: Router, private cookieService: CookieService, private http: Http, private _localStorageService: LocalStorageService, private _translate: TranslateService) {
        let self = this;
        self.EmployeeDetails = [];
        var param = route.snapshot.params['id'];
        this.un = {};
        this.Id = param;
        this.loadData();
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

      loadData() {
        this.currentLanguage = this._localStorageService.get("CurrentLanguage");
        this._translate.use(this.currentLanguage);
        let userSession = JSON.parse(this.cookieService.get('user'));
    
        let body = new URLSearchParams();
        body.append('action', "users_all_node_view");
        body.append('id', this.Id);
    
        this.http.post(environment.apikey + '/generateJsonUrl.php', body)
          .map(res => res.json()).subscribe((res: any) => {
            if (res.code == 100) {
              
              this.un = res.data;
            } else {
              this.un = [];
            }
          });
      }

    printUN() {
        window.print();
      }
    closeAndRedirect() {
        this.router.navigate(['/pabx/user-all-nodes']);
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
@Component({
    selector: 'loanPrint',
    templateUrl: './loan.component.html'
})
export class loanPrintComponent implements OnInit {
    environment: any = environment;
    LoanForm: any;
    issuedFieldsArray: any = [];
    LoanFieldsArray: any = [];
    storeUsersList: any = [];
    DepartmentList: any[];
    param: any;
    nonCtrlFlag: boolean = true;


    constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router) {
        this.param = route.snapshot.params['id'];
        this.LoanForm = {};
        this.getDemandBookData(this.param);
    }

    ngOnInit() {
        if (this.cookieService.get('user') != null && this.cookieService.get('user') != "undefined") {
            var userCookie = JSON.parse(this.cookieService.get('user'));
            if (userCookie.sessionId != null || userCookie.sessionId != '' && userCookie.status === 1) {
                this.getstoreUsersList();
                this.getDepartmentList();
            }
        } else {
            this.router.navigate(['/login']);
        }
    }

    getDemandBookData(dmdNo: any) {
        let body = new URLSearchParams();
        body.append('action', 'getDemandItems');
        body.append('material_demand_no', dmdNo);
        this.http.post(environment.apikey + '/generateJsonUrl.php', body)
            .map(res => res.json())
            .subscribe((res: any) => {
                if (!!res) {
                    this.LoanForm = res;
                    for (let item in this.LoanForm.store_item) {
                        this.LoanFieldsArray.push(this.LoanForm.store_item[item]);
                    }
                }
            }, error => {
                console.log(error.json());
            });
    }
    getDepartmentList() {
        let body = new URLSearchParams();
        body.append('action', 'getDepartmentList');
        this.http.post(environment.apikey + '/masterData.php', body)
            .map(res => res.json())
            .subscribe((res: any) => {
                if (!!res) {
                    this.DepartmentList = res;
                }
            }, error => {
                console.log(error.json());
            });
    }
    getstoreUsersList() {
        let body = new URLSearchParams();
        body.append('action', 'getUserDetails');
        this.http.post(environment.apikey + '/generateJsonUrl.php', body)
            .map(res => res.json())
            .subscribe((res: any) => {
                if (!!res) {
                    this.storeUsersList = res;
                }
            }, error => {
                console.log(error.json());
            });
    }
    Print(id: any) {
        window.print();
    }
}

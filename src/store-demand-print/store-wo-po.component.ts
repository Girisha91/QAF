import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { environment } from '../environments/environment';
@Component({
    selector: 'storeWoPo',
    templateUrl: './store-wo-po.component.html'
})
export class storeWoPoPrintPageComponent implements OnInit {
    environment: any = environment;
    storeItemsWoPo: any;
    issuedFieldsArray: any = [];
    ItemsWoPoArray: any = [];
    storeUsersList: any = [];
    DepartmentList: any[];
    param: any;
    nonCtrlFlag: boolean = true;
    statusChange:any[];
    statusValue:string;

    constructor(private cookieService: CookieService, private http: Http, route: ActivatedRoute, private router: Router) {
        this.param = route.snapshot.params['id'];
        this.storeItemsWoPo = {};
        this.statusChange = [
            {
              label: "Available",
              value: "1"
            },
            {
              label: "Faulty",
              value: "3"
            },
            {
              label: "UnderRepair",
              value: "4"
            },
            {
              label: "Issued",
              value: "5"
            },
            {
              label: "Loan",
              value: "6"
            }
          ];
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
                    this.storeItemsWoPo = res;
                    for (let item in this.storeItemsWoPo.store_item) {
                        switch (this.storeItemsWoPo.store_item[item].status) {
                            case '1':
                                this.storeItemsWoPo.store_item[item]["statusValue"]= "Available";
                              break;
                            case '3':
                                    this.storeItemsWoPo.store_item[item]["statusValue"]= "Faulty";
                              break;
                            case '4':
                                    this.storeItemsWoPo.store_item[item]["statusValue"]= "UnderRepair";
                              break;
                            case '5':
                                    this.storeItemsWoPo.store_item[item]["statusValue"]= "Issued";
                              break;
                            case '6':
                                    this.storeItemsWoPo.store_item[item]["statusValue"]= "Loan";
                              break;
                          }
                        this.ItemsWoPoArray.push(this.storeItemsWoPo.store_item[item]);
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

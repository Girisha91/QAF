

import { Injectable } from '@angular/core';
import { BaseRequestOptions, Headers } from '@angular/http';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {
    headers = new Headers({
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type,**Authorization**',
        "Access-Control-Allow-Origin": "*",
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2020 00:00:00 GMT'
    });
}
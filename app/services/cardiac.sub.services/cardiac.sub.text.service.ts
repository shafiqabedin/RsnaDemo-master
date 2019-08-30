/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CardiacSubTextService {

    constructor(private http: Http) { }

    /**
     * This method starts the breast text callback and creates visualization accordingly
     */
    getCardiacTextData(): Promise<any> {
        // Get the local json for testing purposes
        // return this.http.get('app/data/question.json').map(res => res.json());
        return this.http
            .get('app/data/question.json')
            .toPromise()
            .then(response => response.json());
            // .then(response => {
            //     console.log(" - - "+(JSON.stringify(response.json())));
            // });
    }



}
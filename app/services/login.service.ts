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
import { UserDataModel } from '../models/user-data-model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';


@Injectable()
export class LoginService {

    private user = new UserDataModel();
    // Observable sources for the TopRankedDiagnosisData
    private userSource = new Subject<UserDataModel>();
    // Observable streams for the TopRankedDiagnosisData
    user$ = this.userSource.asObservable();

    constructor(private http: Http) { }

    /**
     * This method retrieves the username and password 
     */
    authenticate(user: UserDataModel) {
        // Get the local json for testing purposes
        this.http
            .get('app/data/user.json')
            .toPromise()
            .then(response => {
                let data = response.json()
                let username = "";
                let password = "";
                let authentication = false;

                try {
                    for (var i = 0; i < data.length; i++) {
                        if (user.username === data[i][0] && user.password === data[i][1]) {
                            user.authenticated = true;
                        }
                    }
                    this.user = user;
                    this.userSource.next(user);
                }
                catch (error) {
                    console.warn("Could not parse json data for user: " + error);
                }
            });
    }
    
    /**
    * This method retrieves the username and password 
    */
    getUser() {
        return this.user;
    }

}













































/**
 * This method authenticates and returns the result from the rest api as json
 *
 * @param username, password
 * @return authentication result from RSNA
 * @exception None
 * @see RSNA API Documentation for acme
 */

 /* authenticate(username, password) {
    var headers = new Headers();
    headers.append("cache-control", "no-cache");
    headers.append("x-api-key", "QhyAb5qttR8UDmrtgYJtG2F6IgRkD1gQ9oTnjk9M");

    let creds = "username=" + username + "&password=" + password;
    //let url = "https://gateway.rsna.org/prod/login/auth/getGlobalLogin?" + creds;  //remove comment when using actual RSNA API
    let url = 'app/data/mock-login-response.json';      //using a temporary hard-coded mock response

    return this.http
      .get(url/*,{headers}*/      //remove comment when using actual RSNA API
    /*  .map(res => res.json())
      .map((res) => {
        if(res.SUCCESS) {
          localStorage.setItem('auth_token', res.DATA.TOKEN);
          this.loggedIn = true;
        }
        return res;
      });
  }*/



















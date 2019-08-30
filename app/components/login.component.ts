/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
    moduleId: module.id,
    selector: 'my-login',
    templateUrl: './login.component.html',
    styleUrls: [ '/css/login.component.css' ]
})
export class LoginComponent implements OnInit {
  errorMessage: string;

    /** Empty Constructor */
    constructor(
        private router: Router, private loginService: LoginService
    ) {
    }

    /** Empty init method*/
    ngOnInit(): void {

    }

    /**
   * This method logs in the user by calling the authenticate() method of the LoginService
   *
   * @param username, password
   * @return authentication result from RSNA
   * @exception None
   */
    login(username: string, password: string) {
      this.loginService.authenticate(username, password).subscribe((result) => {
        if(result) {
          this.router.navigate(['/speciality']);
        }
      },
      error => {
        this.errorMessage = <any>error;
        //console.log(this.errorMessage);
    });

}
}

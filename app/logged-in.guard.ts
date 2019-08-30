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
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './services/login.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private user: LoginService) {}

  /**
 * This method is used to determine whether to restrict access to a page or not
 *
 * @param None
 * @return result from the isLoggedIn() method of LoginService
 * @exception None
 * @see CanACtivate interface from Angular2 documentation
 */
  canActivate() {
    return this.user.isLoggedIn();
  }
}

/**
 * AppComponent - the root component of the app. 
 * Houses router-outlet
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import {Component, ViewContainerRef} from '@angular/core';
//import './rxjs-operators';

@Component({
    selector: 'my-app',
    template: `
    <spinner></spinner>
    <router-outlet></router-outlet>
    `
})
export class AppComponent {

  private viewContainerRef: ViewContainerRef;

  public constructor(viewContainerRef:ViewContainerRef) {
    // You need this small hack in order to catch application root view container ref
    this.viewContainerRef = viewContainerRef;
  }
    title = 'RSNA DEMO';

}

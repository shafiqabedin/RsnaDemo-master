/**
 * BarchartComponent - class that shows a google barchart 
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, Input} from '@angular/core';

@Component(
    {
        selector: 'barchart-visualization',
        template: '<p barchart [content] = "barchartContent"></p>',
    })

export class BarchartComponent {

    barchartContent: any[] = [];

    /*
    * This is the child component taking input from the parent 
    * - this way we can create two instance of the same component
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(c: any[]) {
        this.barchartContent = c;
    }

}  

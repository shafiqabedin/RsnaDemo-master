/**
 *  SankeyComponent - class shows Google's sankey diagram
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, Input} from '@angular/core';
import { SankeyDataModel } from '../models/sankey-data-model';

@Component(
    {
        selector: 'sankey-visualization',
        template: '<p sankey [content] = "sankeyContent"></p>',
    })

export class SankeyComponent {

    sankeyContent: SankeyDataModel = new SankeyDataModel();

    /*
    * This is the child component taking input from the parent 
    * - this way we can create two instance of the same component
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(data: SankeyDataModel) {
        console.log(" Sankey length: "+ data.rows.length);
       this.sankeyContent = data;
    }

}  
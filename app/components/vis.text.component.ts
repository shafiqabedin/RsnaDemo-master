/**
 * TextVisualizationComponent - class shows the concept extractor results
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, Input} from '@angular/core';
import { TextVisualizationDataModel } from '../models/text-visualization-data-model';

@Component(
    {
        selector: 'text-visualization',
        template: '<h1 textvisualization [content] = "textVisualizationData"></h1>',
    })

export class TextVisualizationComponent {

     textVisualizationData: TextVisualizationDataModel;

    /*
    * This is the child component taking input from the parent 
    * - this way we can create two instance of the same component
    * Setter for highlightContent will trigger drawing (or refreshing)
    */

    @Input()
    set content(data: TextVisualizationDataModel) {
        this.textVisualizationData = data;
    }

}
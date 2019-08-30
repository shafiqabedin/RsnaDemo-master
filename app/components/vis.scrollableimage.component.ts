/**
 * ImageViewportComponent - class shows 2D images  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, Input} from '@angular/core';
import { ImageScrollableVisualizationDataModel } from '../models/image-scrollable-visualization-data-model';

@Component(
    {
        selector: 'scrollable-image',
        template: '<canvas scrollableimage [content] = "imageScrollableVisualizationData" width=600 height=600 style="margin-left: 72px"></canvas>',
        styles: ["margin-left: auto; margin-right: auto; display: block; position: absolute; display: flex"]
    })

export class ScrollableImageComponent {

     imageScrollableVisualizationData: ImageScrollableVisualizationDataModel;

    /*
    * This is the child component taking input from the parent 
    * - this way we can create two instance of the same component
    * Setter for highlightContent will trigger drawing (or refreshing)
    */
    @Input()
    set content(data: ImageScrollableVisualizationDataModel) {
        this.imageScrollableVisualizationData = data;
    }

}
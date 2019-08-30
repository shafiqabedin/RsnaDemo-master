/**
 * ImageViewportComponent - class shows 2D images  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, Input, trigger, transition, state, style, animate } from '@angular/core';
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';

@Component(
    {
        selector: 'image-viewport',
        template: '<p [@flyInOut]="\'in\'" imageviewport [content] = "image2DVisualizationData" ></p>',
        animations: [
            trigger('flyInOut', [
                state('in', style({ opacity: 1 })),
                transition('void => *', [
                    style({ opacity: 0 }),
                    animate(400)
                ]),
                transition('* => void', [
                    animate(400, style({ opacity: 1 }))
                ])
            ])
        ],
    })

export class ImageViewportComponent {

    image2DVisualizationData: Image2DVisualizationDataModel;

    /*
    * This is the child component taking input from the parent 
    * - this way we can create two instance of the same component
    * Setter for highlightContent will trigger drawing (or refreshing)
    */

    @Input()
    set content(data: Image2DVisualizationDataModel) {
        this.image2DVisualizationData = data;
    }

}
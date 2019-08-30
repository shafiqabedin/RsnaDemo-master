/**
 *  SankeyComponent - class shows Google's sankey diagram
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, Input } from '@angular/core';
import { ImageVisualizationDataModel } from '../models/image-visualization-data-model';

@Component(
    {
        selector: 'image-slider',
        template: `
        <div>
            <div style="width: 80%; float:left;">
                <a (click)= decreaseIndex() class="left carousel-control">
                    <span class="icon-prev" style="font-size: 45px;"></span>
                </a>        
                <div imageslider [content]=imageVisualizationData [index]=index [animator]=animator></div>
                <a (click)= increaseIndex() class="right carousel-control" style="margin-right:20%;">
                    <span class="icon-next" style="font-size: 45px;"></span>
                </a>        
            </div>
            <div style="float:right; width: 20%; margin-top: 20%">
                    <div onmouseover="this.style.opacity=.5" onmousedown="this.style.opacity=.5" onmouseout="this.style.opacity=1" style="padding: 5px; cursor: pointer; margin: 10px; color: #ffffff; font-family: helvetica neue; font-weight: 200;
                    font-size: 18px;"
                     *ngFor="let button of buttons; let idx = index" (click)=setIndex(idx)>
                        {{button}}
                    </div>
            </div>
        </div>        
        `,
    })

export class ImageSliderComponent {

    imageVisualizationData: ImageVisualizationDataModel = new ImageVisualizationDataModel();
    index: number = 0;
    buttons: string[] = [];
    animator: number = 0;
    interval: number = 8000;

    /*
    * Setter for VisData content
    */

    @Input()
    set content(data: ImageVisualizationDataModel) {
        this.imageVisualizationData = data;
        console.log("Got to component content with size:" + this.imageVisualizationData .visualizationDataArray.length);
        //Animate Buttons
        if (this.imageVisualizationData.hasBeenAnimated === false) {
            console.log("Got to component content hasBeenAnimated === false");
            this.animate();
        } else {
            for (var i = 0; i < this.imageVisualizationData.visualizationDataArray.length; i++) {
                this.buttons.push((this.imageVisualizationData.visualizationDataArray[i].title));
            }
        }
    }

    /*
    * Set Index--
    */
    decreaseIndex() {
        if (this.index > 0) {
            this.index--;
        }
    }

    /*
     * Set Index++
     */
    increaseIndex() {

        if (this.index < (this.imageVisualizationData.visualizationDataArray.length - 1)) {
            this.index++;
        }
    }

    /*
     * Set Index++
     */
    setIndex(idx) {

        this.index = idx;
    }

    /*
       * Animate
       */
    animate() {

        //Animate 
        let _this = this;
        for (var i = 0; i < this.imageVisualizationData.visualizationDataArray.length; i++) {
            (function (index) {
                setTimeout(function () {
                    _this.animator++;
                    _this.buttons.push((_this.imageVisualizationData.visualizationDataArray[(index)].title));
                    if (_this.animator == _this.imageVisualizationData.visualizationDataArray.length) {
                        //Once reached, set the has been animated to true
                        _this.imageVisualizationData.hasBeenAnimated = true;
                        _this.index = _this.imageVisualizationData.visualizationDataArray.length-1;
                    }
                }, i * _this.interval);
            })(i);
        }
    }

}  
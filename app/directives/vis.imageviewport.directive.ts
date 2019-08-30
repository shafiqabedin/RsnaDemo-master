/**
 * ImageViewportVisualizationDirective
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Directive, Input, Renderer, ElementRef } from "@angular/core";
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';

@Directive({
    selector: '[imageviewport]'
})
/*
* The ImageViewportVisualizationDirective handles the viewing of the image 
* In future we may want to add hostlisteners for pan and zoom
*/

export class ImageViewportVisualizationDirective {

    constructor(
        private el: ElementRef,
        private renderer: Renderer
    ) { }

    private image2DVisualizationData: Image2DVisualizationDataModel;

    /*
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(data: Image2DVisualizationDataModel) {
        this.image2DVisualizationData = data;
        this.render();
    }

    /*
    * This method highlights the text. First it matches against the tokens and then replaces with the custom replace function
    */
    private render() {
                
                let html = `<img src="${this.image2DVisualizationData.imageUrl}" alt="" style="max-height: 800px; max-width: 800px; margin:auto; display:block;">`;
                this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', html);
    }

}
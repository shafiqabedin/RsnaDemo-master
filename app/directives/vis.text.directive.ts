/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Directive, Input, Renderer, ElementRef } from "@angular/core";
import { TextVisualizationDataModel } from '../models/text-visualization-data-model';

@Directive({

    selector: '[textvisualization]'

})
/*
*  The TextVisualizationDirective handles the highlighting of the text
*/

export class TextVisualizationDirective {

    constructor(
        private el: ElementRef,
        private renderer: Renderer
    ) { }

    private textVisualizationData: TextVisualizationDataModel;
    private textInterval;
    private currentConcept;

    /*
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(data: TextVisualizationDataModel) {
        this.textVisualizationData = data;
        this.render();
    }

    /*
    * This method highlights the text. First it matches against the tokens and then replaces with the custom replace function
    */
    private render() {

        this.currentConcept = this.textVisualizationData.concept;
        this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', this.currentConcept);
        
        var _this = this;
        for (var i = 1; i <= this.textVisualizationData.textHighlights.length; i++) {
            (function (index) {
                setTimeout(function () {
                    _this.highlighter((index-1));
                }, i * 1000);
            })(i);
        }
    }

    /*
    * Highlighter
    */
    highlighter(i: number) {
        let tokenized: any[] = [];
        tokenized.push(this.textVisualizationData.textHighlights[i]);
        let regex = new RegExp(tokenized.join('|'), 'gmi');
        let html = this.currentConcept.replace(regex, (match, item) => {
            return this.replace(match, item);
        });
        this.currentConcept = html;
        this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', html);

    }


    /*
    * Custom replace function
    */
    replace(match, item) {
        return `<span style="text-shadow: 10 0 5px white">${match}</span>`;
    }


}
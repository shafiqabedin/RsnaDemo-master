/**
 * BarchartDirective - directive 
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Directive, ElementRef, Input, Renderer, ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { ImageVisualizationDataModel } from '../models/image-visualization-data-model';
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';
import { Image3DVisualizationDataModel } from '../models/image-3d-visualization-data-model';
import { ImageScrollableVisualizationDataModel } from '../models/image-scrollable-visualization-data-model';
import { ImageViewportComponent } from '../components/vis.imageviewport.component';
import { Visualization3DComponent } from '../components/vis.3d.component';
import { ScrollableImageComponent } from '../components/vis.scrollableimage.component';

@Directive({

    selector: '[imageslider]',

})
/*
*  The BarchartDirective handles the drawing of Google barchar
*/

export class ImageSliderDirective {

    el: HTMLElement;
    w: any;  // To store the window, without generating errors in typescript on window.google
    imageVisualizationData: ImageVisualizationDataModel = new ImageVisualizationDataModel();
    indexNumber: number = 0;
    interval: number = 8000;
    /*
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(data: ImageVisualizationDataModel) {
        this.imageVisualizationData = data;
        //Only Call when animation has been done 
    }

    @Input('index')
    set index(idx: number) {
        this.indexNumber = idx;
        //Sets the index number and check if we should enable the user control
        if (this.imageVisualizationData.hasBeenAnimated === true) {
            this.draw(this.indexNumber);
        }
    }

    @Input('animator')
    set animator(anim: number) {
        if (anim > 0 && this.imageVisualizationData.hasBeenAnimated === false) {
            this.draw((anim - 1));
        }
    }

    /*
    * Constructor injects a reference to the element
    */

    constructor(elementRef: ElementRef,
        private renderer: Renderer,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {
        this.w = window;
        this.el = elementRef.nativeElement; // You cannot use elementRef directly !
    }

    /*
    * Inject components into the parent component
    */
    draw(id: number) {
        //Clear container
        this.viewContainerRef.clear();

        //Based on what data type the visualization is rendered
        if (this.imageVisualizationData.visualizationDataArray[id] instanceof Image2DVisualizationDataModel) {

            //Create Component with factory
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ImageViewportComponent);

            //componentReference is the reference to the component
            const componentReference = this.viewContainerRef.createComponent(componentFactory);

            //imageViewportcomponent is the component 
            let imageViewportcomponent = componentReference.instance;

            //set the content for the component
            imageViewportcomponent.content = this.imageVisualizationData.visualizationDataArray[id];

            //force change detection
            componentReference.changeDetectorRef.detectChanges();

        } else if (this.imageVisualizationData.visualizationDataArray[id] instanceof Image3DVisualizationDataModel) {

            //Create Component with factory
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(Visualization3DComponent);

            //componentReference is the reference to the component
            const componentReference = this.viewContainerRef.createComponent(componentFactory);

            //imageViewportcomponent is the component 
            let imageViewportcomponent = componentReference.instance;

            //set the content for the component
            imageViewportcomponent.content = this.imageVisualizationData.visualizationDataArray[id];

            //force change detection
            componentReference.changeDetectorRef.detectChanges();

        } else if (this.imageVisualizationData.visualizationDataArray[id] instanceof ImageScrollableVisualizationDataModel) {

            //Create Component with factory
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ScrollableImageComponent);

            //componentReference is the reference to the component
            const componentReference = this.viewContainerRef.createComponent(componentFactory);

            //imageViewportcomponent is the component 
            let imageViewportcomponent = componentReference.instance;

            //set the content for the component
            imageViewportcomponent.content = this.imageVisualizationData.visualizationDataArray[id];

            //force change detection
            componentReference.changeDetectorRef.detectChanges();
        }
    }

    /*
    * Animate
    */
    animate() {

        let _this = this;
        for (var i = 1; i <= this.imageVisualizationData.visualizationDataArray.length; i++) {
            (function (index) {
                setTimeout(function () {
                    if (index < (_this.imageVisualizationData.visualizationDataArray.length)) {

                        _this.draw((index));
                    } else if (index === (_this.imageVisualizationData.visualizationDataArray.length)) {
                        _this.draw((0));

                    }
                }, i * _this.interval);
            })(i);
        }
    }

}
/**
 * ImageViewportVisualizationDirective
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Directive, Input, Renderer, ElementRef, HostListener } from "@angular/core";
import { ImageScrollableVisualizationDataModel } from '../models/image-scrollable-visualization-data-model';

@Directive({
    selector: '[scrollableimage]'
})
/*
* The ImageViewportVisualizationDirective handles the viewing of the image 
* In future we may want to add hostlisteners for pan and zoom
*/

export class ScrollableImageDirective {

    //Test Data 
    isvData: ImageScrollableVisualizationDataModel;
    //Vars
    private context: CanvasRenderingContext2D;
    private scrollableImageInterval;
    private counter: number = 0;
    private isPaused: boolean = false;
    private last: MouseEvent;
    private mouseDown: boolean = false;


    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer
    ) {
    }

    /*
        * Setter for content will trigger drawing (or refreshing)
        */

    @Input()
    set content(data:ImageScrollableVisualizationDataModel) {

        //Set data
        this.isvData = data;

        // Start Drawing
        this.init();
    }

    /*
    * This method initializes canvas to draw on
    */
    private init() {

        // Canvas Stuff
        this.context = this.elementRef.nativeElement.getContext("2d");
        //Draw 
        this.draw();
    }

    /*
    * This method draws image on canvas
    */

    draw() {

        //Draw image - after the rect has been loaded
        var _this = this;
        this.scrollableImageInterval = setInterval(function () {
            _this.drawNextImage();
        }, 100);

        // this.renderer.setElementStyle(this.elementRef.nativeElement, 'background-image', "url(" + this.image2DVisualizationData.imageUrl + ")");
        // this.renderer.setElementStyle(this.elementRef.nativeElement, 'background-size', "100%");
        // this.renderer.setElementStyle(this.elementRef.nativeElement, 'background-repeat', "no-repeat");
    }

    /*
    * This method draws image on canvas
    */
    drawNextImage() {
        var _this = this;
        var backgroundImage = new Image();
        backgroundImage.src = this.isvData.imageUrls[this.counter];

        backgroundImage.onload = function () {
            _this.context.clearRect(0, 0, _this.elementRef.nativeElement.width, _this.elementRef.nativeElement.height);
            _this.context.drawImage(backgroundImage, 0, 0);
        };

        this.counter++;
        if (this.counter == this.isvData.imageUrls.length) {
            this.counter = 0;
        }
    }

    /*
    * MOUSEUP - Controls for the canvas
    */
    @HostListener('mouseup')
    onmouseup() {
        this.mouseDown = false;
    }

    /*
    * MOUSEDOWN - Controls for the canvas - Pause image
    */
    @HostListener('click', ['$event'])
    onclick(event) {
        //Update position
        this.last = event;
        this.mouseDown = true;

        //Resume pause play
        if (this.isPaused === false) {
            clearInterval(this.scrollableImageInterval);
            this.isPaused = true;
        } else if (this.isPaused === true) {
            this.draw();
            this.isPaused = false;
        }

    }

    /*
    * MOUSEDOWN - Controls for the canvas - Pause image
    */
    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
        if (this.mouseDown) {
            let x = event.clientX - this.last.clientX;
        }
    }

    /*
    * Must clear interval on destroy
    */

    ngOnDestroy(){
        console.log("Destroying scrollableimage");
        clearInterval(this.scrollableImageInterval);
    }

}
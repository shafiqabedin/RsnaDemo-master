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
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';

@Directive({
    selector: '[drawableimage]'
})
/*
* The ImageViewportVisualizationDirective handles the viewing of the image 
* In future we may want to add hostlisteners for pan and zoom
*/

export class DrawableImageDirective {

    private rectangle: any;
    private drag = false
    private mouseX;
    private mouseY;
    private closeEnough = 10;
    private dragTL = false;
    private dragBL = false;
    private dragTR = false;
    private dragBR = false;
    private context: CanvasRenderingContext2D;
    w: any;  // To store the window, without generating errors in typescript on window.google


    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer
    ) {
        this.w = window;
        // this.el = elementRef.nativeElement; // You cannot use elementRef directly !        
        this.rectangle = {
            startX: 100,
            startY: 200,
            w: 300,
            h: 200
        }
    }

    private image2DVisualizationData: Image2DVisualizationDataModel;

    /*
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(data: Image2DVisualizationDataModel) {
        this.image2DVisualizationData = data;

        // For test 
        this.image2DVisualizationData.imageUrl = "https://s-media-cache-ak0.pinimg.com/originals/d1/c1/86/d1c186f563d521371ad93ab68693a362.png";

        // Start Drawing
        this.init();
    }

    /*
    * This method initializes canvas to draw on
    */
    private init() {

        // Canvas Stuff
        this.context = this.elementRef.nativeElement.getContext("2d");
        this.renderer.setElementStyle(this.elementRef.nativeElement, 'background-image', "url(" + this.image2DVisualizationData.imageUrl + ")");
        this.renderer.setElementStyle(this.elementRef.nativeElement, 'background-size', "100%");
        this.renderer.setElementStyle(this.elementRef.nativeElement, 'background-repeat', "no-repeat");
        

        //Draw 
        this.draw();
    }
    /*
    * This method draws image on canvas
    */

    draw() {

        //Draw rectangle - after the rect has been loaded
        this.context.fillStyle = 'rgba(119,136,153,0.5)';
        this.context.fillRect(this.rectangle.startX, this.rectangle.startY, this.rectangle.w, this.rectangle.h);

        // Draw the handles
        this.drawHandles();

    }

    /*
    * This method draws the handles
    */
    drawCircle(x, y, radius) {
        this.context.fillStyle = "#4682B4";
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.fill();
    }

    /*
    * This method draws the handles
    */
    drawHandles() {
        this.drawCircle(this.rectangle.startX, this.rectangle.startY, this.closeEnough);
        this.drawCircle(this.rectangle.startX + this.rectangle.w, this.rectangle.startY, this.closeEnough);
        this.drawCircle(this.rectangle.startX + this.rectangle.w, this.rectangle.startY + this.rectangle.h, this.closeEnough);
        this.drawCircle(this.rectangle.startX, this.rectangle.startY + this.rectangle.h, this.closeEnough);
    }

    /*
    * MOUSEDOWN - Controls for the canvas
    */

    @HostListener('mousedown', ['$event'])
    onmousedown(event) {

        this.mouseX = event.pageX - this.elementRef.nativeElement.offsetLeft;
        this.mouseY = event.pageY - this.elementRef.nativeElement.offsetTop;

        // if there isn't a this.rectangle yet
        if (this.rectangle.w === undefined) {
            this.rectangle.startX = this.mouseY;
            this.rectangle.startY = this.mouseX;
            this.dragBR = true;
        }

        // if there is, check which corner
        //   (if any) was clicked
        //
        // 4 cases:
        // 1. top left
        else if (this.checkCloseEnough(this.mouseX, this.rectangle.startX) && this.checkCloseEnough(this.mouseY, this.rectangle.startY)) {
            this.dragTL = true;
        }
        // 2. top right
        else if (this.checkCloseEnough(this.mouseX, this.rectangle.startX + this.rectangle.w) && this.checkCloseEnough(this.mouseY, this.rectangle.startY)) {
            this.dragTR = true;

        }
        // 3. bottom left
        else if (this.checkCloseEnough(this.mouseX, this.rectangle.startX) && this.checkCloseEnough(this.mouseY, this.rectangle.startY + this.rectangle.h)) {
            this.dragBL = true;

        }
        // 4. bottom right
        else if (this.checkCloseEnough(this.mouseX, this.rectangle.startX + this.rectangle.w) && this.checkCloseEnough(this.mouseY, this.rectangle.startY + this.rectangle.h)) {
            this.dragBR = true;

        }
        // (5.) none of them
        else {
            // handle not resizing
        }

        this.context.clearRect(0, 0, this.elementRef.nativeElement.width, this.elementRef.nativeElement.height);
        this.draw();

    }

    /*
    * MOUSEUP - Controls for the canvas
    */

    @HostListener('mouseup', ['$event'])
    onmouseup(event) {

        this.dragTL = this.dragTR = this.dragBL = this.dragBR = false;
    }

    /*
    * MOUSEUP - Controls for the canvas
    */

    @HostListener('mousemove', ['$event'])
    onmousemove(event) {

        this.mouseX = event.pageX - this.elementRef.nativeElement.offsetLeft;
        this.mouseY = event.pageY - this.elementRef.nativeElement.offsetTop;
        if (this.dragTL) {
            this.rectangle.w += this.rectangle.startX - this.mouseX;
            this.rectangle.h += this.rectangle.startY - this.mouseY;
            this.rectangle.startX = this.mouseX;
            this.rectangle.startY = this.mouseY;
        } else if (this.dragTR) {
            this.rectangle.w = Math.abs(this.rectangle.startX - this.mouseX);
            this.rectangle.h += this.rectangle.startY - this.mouseY;
            this.rectangle.startY = this.mouseY;
        } else if (this.dragBL) {
            this.rectangle.w += this.rectangle.startX - this.mouseX;
            this.rectangle.h = Math.abs(this.rectangle.startY - this.mouseY);
            this.rectangle.startX = this.mouseX;
        } else if (this.dragBR) {
            this.rectangle.w = Math.abs(this.rectangle.startX - this.mouseX);
            this.rectangle.h = Math.abs(this.rectangle.startY - this.mouseY);
        }
        this.context.clearRect(0, 0, this.elementRef.nativeElement.width, this.elementRef.nativeElement.height);
        this.draw();

    }

    /*
    * Check proximity
    */

    checkCloseEnough(p1, p2) {
        return Math.abs(p1 - p2) < this.closeEnough;
    }



}


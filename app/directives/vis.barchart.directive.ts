/**
 * BarchartDirective - directive 
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Directive, ElementRef, Input } from "@angular/core";
declare var google: any;

@Directive({

    selector: '[barchart]'

})
/*
*  The BarchartDirective handles the drawing of Google barchar
*/

export class BarchartDirective {

    el: HTMLElement;
    w: any;  // To store the window, without generating errors in typescript on window.google
    private _content: any[] = [];
    private chart;
    private data = new google.visualization.DataTable();
    private options;

    /*
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(dat: any[]) {
        this._content = dat;
        if (this.data.getNumberOfRows() === this._content.length) {
            for (var i = 0; i < this.data.getNumberOfRows(); i++) {
                //Set Value
                this.data.setValue(i, 1, this._content[i][1]);
            }

        } else {
            for (let c in this._content) {
                this.data.addRow([this._content[c][0], this._content[c][1]]);
            }
        }
        this.draw();
    }

    get content() {
        return this._content;
    }

    /*
    * Constructor injects a reference to the element
    */

    constructor(elementRef: ElementRef) {

        console.log("Constructing Bar Chart...");

        this.w = window;
        this.el = elementRef.nativeElement; // You cannot use elementRef directly !
        if (!this.w.google) { console.error("Oops ! It seems the needed google script was not loaded ?"); };

        //Create chart
        this.chart = new google.visualization.BarChart(this.el);

        //Setup data 
        this.data.addColumn('string', 'Name');
        this.data.addColumn('number', 'Value');
        // Set chart options
        this.options = {
            'chartArea': {
                'top': 0,
                'bottom': 0,
                'left': 100,
                'height': 60,
                'width': 400
            },
            animation: {
                'duration': 2000,
                'easing': 'out',
                'startup': true
            },
            'vAxis': {
                'baselineColor': '#1C3748',
                'gridlineColor': '#1C3748',
                'textStyle': {
                    'color': '#9CA8AB',
                    'fontSize': 12
                }
            },
            'hAxis': {
                minValue: 0,
                maxValue: 1,
                'baselineColor': '#1C3748',
                'gridlineColor': '#1C3748',
                'textPosition': 'none'
            },
            'backgroundColor': {
                'fill': '#1C3748',
                'opacity': 100
            },
            'colors': ['#96A0AA'],
            'titleTextStyle': {
                'fontSize': '18',
                'fontName': 'Arial',
                'color': '#9CA8AB'
            },
            'legend': {
                'position': 'none'
            }
        };
    }

    /*
    * Draw the bar chart
    */

    draw() {
        
        this.chart.draw(this.data, this.options);
    }
}
/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Directive, ElementRef, Input, Renderer } from "@angular/core";
import { SankeyDataModel } from '../models/sankey-data-model';

declare var google: any;

@Directive({

    selector: '[sankey]'
})
/*
*  The SankeyDirective handles the drawing of Google sankey
*/

export class SankeyDirective {

    el: HTMLElement;
    w: any;  // To store the window, without generating errors in typescript on window.google
    private timerIndex: number = 0;
    private sankeyData: SankeyDataModel = new SankeyDataModel();
    private tmpSankeyData: SankeyDataModel = new SankeyDataModel();
    private sankeyInterval;

    /*
    * Setter for content will trigger drawing (or refreshing)
    */

    @Input()
    set content(content: SankeyDataModel) {
        this.sankeyData = content;
        // this.draw();
        this.updateSankeyData();
    }

    get content() {
        return this.sankeyData;
    }

    /*
    * Constructor injects a reference to the element
    */

    constructor(elementRef: ElementRef, private renderer: Renderer) {
        this.w = window;
        this.el = elementRef.nativeElement; // You cannot use elementRef directly !
        if (!this.w.google) { console.error("Oops ! It seems the needed google script was not loaded ?"); };
    }

    /*
    * Draw the sankey
    */

    draw() {
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'From');
        data.addColumn('string', 'To');
        data.addColumn('number', 'Weight');
        data.addColumn({ type: 'string', role: 'tooltip' });
        data.addColumn({ type: 'string', role: 'style' });
        // 
        data.addRows(this.tmpSankeyData.rows);

        // Set chart options

        var options = {
            'animation': {
                'duration': 1000,
                'easing': 'in'
            },
            'title': 'Reasoning Dagram',
            'width': '100%',
            'height': '600',
            'sankey': {
                'node': {
                     colors: [ '#87CEFA' ],
                    'interactivity': true,
                    'nodePadding': 80,
                    'width': 7,
                    'label': {
                        'color': 'white',
                        'fontSize': 14,
                    }
                },
            }
        };

        // Draw
        (new google.visualization.Sankey(this.el))
            .draw(data, options);
    }

    /**
     * Sankey data updater for animation
     */

    updateSankeyData() {
        var _this = this;
        this.renderer.setElementProperty(this.el, 'innerHTML', "");
        _this.tmpSankeyData = new SankeyDataModel();
        _this.tmpSankeyData.rows = JSON.parse(JSON.stringify(_this.sankeyData.rows));

        for (var i = 0; i < _this.sankeyData.rows.length; i++) {
            (function (index) {
                setTimeout(function () {
                    let row = _this.tmpSankeyData.rows[_this.timerIndex];
                    let splitted = row[4].split(";");
                    let col = splitted[1];
                    row[4] = "opacity: 0.4;" + col;
                    _this.tmpSankeyData.rows[_this.timerIndex] = row;
                    _this.timerIndex++;
                    //Draw
                    _this.draw();
                }, i * 1000);
            })(i);
        }


        // this.sankeyInterval = setInterval(function () {
        //     if (_this.timerIndex < _this.sankeyData.rows.length) {

        //         let row = _this.tmpSankeyData.rows[_this.timerIndex];
        //         let splitted = row[4].split(";");
        //         let col = splitted[1];
        //         row[4] = "opacity: 0.4;" + col;
        //         _this.tmpSankeyData.rows[_this.timerIndex] = row;
        //         _this.timerIndex++;
        //         // _this.sankeyDataDiscrete.rows.push(_this.sankeyData.rows[_this.timerIndex++]);
        //         //Draw
        //         console.log("Tick:"+ new Date());
        //         _this.draw();

        //     } else if (_this.timerIndex >= _this.sankeyData.rows.length) {
        //         console.log("Clearing Interval -- ");
        //         _this.timerIndex = 0;
        //         clearInterval(_this.sankeyInterval);
        //     }
        // }, 1000);

    }

    /**
     * sleep function to simulate delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    //
}
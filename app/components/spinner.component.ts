/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
    selector: 'spinner',
    template: `
        <div *ngIf="active" style="
                background-color: #001d30;
                border: 1px solid #4cb9fe;
                border-radius: 3px;
                box-shadow: 0 0 20px rgba(225, 255, 255, 1);
                color: #2ec4c2;
                opacity: 0.7;
                padding: 10px;
                position: absolute;
                right: 22%;
                top: 10%;
                z-index: 999;">
                <img src="/images/ellipsis.gif"><p style="
                display: inline;
                text-shadow: 0 0 20px rgba(255, 255, 255, 1);
                font-family: helvetica neue;
                font-size: .8em;
                font-weight: normal;
                ">  {{message}} </p>
        </div>
    `
})

export class SpinnerComponent {
    public active: boolean;
    public message: string;

    constructor(spinner: SpinnerService) {
        //Active subscription
        spinner.status.subscribe((status: boolean) => {
            this.active = status;
        });

        //Message subscription
        spinner.message.subscribe((msg: string) => {
            this.message = msg;
        });
    }
}
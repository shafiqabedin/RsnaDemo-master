/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share';

@Injectable()
export class SpinnerService {

    public status = new Subject<boolean>();
    private _active: boolean = false;
    public message = new Subject<string>();


    /**
     * Setter method for _active 
     */
    public get active(): boolean {
        return this._active;
    }

    /**
     * Getter method for _active 
     */
    public set active(value: boolean) {
        this._active = value;
        this.status.next(value);
    }

    /**
     * Start activates the spinner div 
     */
    public start(msg: string): void {
        this.active = true;
        this.message.next(msg);
    }

    /**
     * Start deactivates the spinner div 
     */
    public stop(): void {
        this.active = false;
        this.message.next("");
    }


}
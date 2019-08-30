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
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'my-speciality',
    templateUrl: './speciality.component.html',
    styleUrls: ['/css/speciality.component.css']
})

export class SpecialityComponent implements OnInit {

    constructor(
        private router: Router
    ) {
    }

    ngOnInit(): void {

    }
    /*
	 * This method routes to the breast component  
	 */
    breastClick(event) {
        this.router.navigate(['/breast']);
    }

    /*
	 * This method routes to the cardiac component
	 */
    cardiacClick(event) {
        this.router.navigate(['/cardiac']);
    }

}
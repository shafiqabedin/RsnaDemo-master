/**
 * Routing handles the routing of different pages
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarouselComponent } from './components/carousel.component';
import { SpecialityComponent }   from './components/speciality.component';
import { BreastComponent }   from './components/breast.component';
import { CardiacComponent } from './components/cardiac.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/carousel',
        pathMatch: 'full'
    },
    {
        path: 'carousel',
        component: CarouselComponent,
        
    },
    {
        path: 'speciality',
        component: SpecialityComponent,
        
    },
    {
        path: 'breast',
        component: BreastComponent,
    },
    {
        path: 'cardiac',
        component: CardiacComponent,
    },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

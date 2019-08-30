/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
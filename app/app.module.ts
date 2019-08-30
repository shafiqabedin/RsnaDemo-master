/**
 * AppModule has the NgModule and reference to all components
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app.component';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { routing } from './app.routing';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ConfigService } from './services/config.service';
import { SpecialityComponent } from './components/speciality.component';
import { BreastComponent } from './components/breast.component';
import { CardiacComponent } from './components/cardiac.component';
import { BarchartComponent } from './components/vis.barchart.component';
import { BarchartDirective } from './directives/vis.barchart.directive';
import { TextVisualizationComponent } from './components/vis.text.component';
import { TextVisualizationDirective } from './directives/vis.text.directive';
import { CarouselComponent } from './components/carousel.component';
import { ImageViewportComponent } from './components/vis.imageviewport.component';
import { ImageViewportVisualizationDirective } from './directives/vis.imageviewport.directive';
import { SankeyDirective } from './directives/vis.sankey.directive';
import { SankeyComponent } from './components/vis.sankey.component';
import { QuestionComponent } from './components/question.component';
import { SpinnerComponent } from './components/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { QuestionService } from './services/question.service';
import { LoginService } from './services/login.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Visualization3DComponent } from './components/vis.3d.component';
import { DrawableImageComponent } from './components/vis.drawableimage.component';
import { DrawableImageDirective } from './directives/vis.drawableimage.directive';
import { ScrollableImageComponent } from './components/vis.scrollableimage.component';
import { ScrollableImageDirective } from './directives/vis.scrollableimage.directive';
import { ImageSliderComponent } from './components/imageslider.component';
import { ImageSliderDirective } from './directives/imageslider.directive';





DrawableImageDirective


@NgModule({
    imports: [BrowserModule, routing, Ng2BootstrapModule, FormsModule, HttpModule, JsonpModule, NgbModule.forRoot()],
    declarations: [AppComponent, SpecialityComponent, BreastComponent,
        CardiacComponent, BarchartComponent, BarchartDirective, TextVisualizationComponent, TextVisualizationDirective, CarouselComponent,
        ImageViewportComponent, ImageViewportVisualizationDirective, SankeyDirective, SankeyComponent, QuestionComponent, SpinnerComponent,
        Visualization3DComponent, DrawableImageComponent, DrawableImageDirective, ScrollableImageComponent, ScrollableImageDirective,
        ImageSliderComponent, ImageSliderDirective
    ],
    entryComponents: [ImageViewportComponent, ScrollableImageComponent, Visualization3DComponent],
    providers: [ConfigService, SpinnerService, QuestionService, LoginService],
    bootstrap: [AppComponent]
})

export class AppModule { }

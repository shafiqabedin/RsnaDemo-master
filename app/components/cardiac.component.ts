/**
 * CardiacComponent - class that deals with firing off the services for the cardiac visualization
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 *
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, OnInit, trigger, transition, state, style, animate, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common/src/directives';
import { CardiacService } from '../services/cardiac.service'
import { TextVisualizationDataModel } from '../models/text-visualization-data-model';
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';
import { ImageVisualizationDataModel } from '../models/image-visualization-data-model';
import { PatientCaseAnalysisDataModel } from '../models/patient-case-analysis-data-model';
import { TopRankedDiagnosisDataModel } from '../models/top-ranked-diagnosis-data-model';
import { ImageScrollableVisualizationDataModel } from '../models/image-scrollable-visualization-data-model';
import { QuestionDataModel } from '../models/question-data-model';
import { AnswerDataModel } from '../models/answer-data-model';
import { QuestionComponent } from '../components/question.component';
import { QuestionService } from '../services/question.service';
import { Visualization3DComponent } from '../components/vis.3d.component';
import { PaginationModule } from 'ng2-bootstrap/components/pagination';
import { SankeyDataModel } from '../models/sankey-data-model';
import { SpinnerService } from '../services/spinner.service';


@Component({
    moduleId: module.id,
    animations: [
        trigger('flyInOut', [
            state('in', style({ transform: 'translateX(0)' })),
            transition('void => *', [
                style({ transform: 'translateX(-100%)' }),
                animate(400)
            ]),
            transition('* => void', [
                animate(400, style({ transform: 'translateX(100%)' }))
            ])
        ])
    ],
    selector: 'my-cardiac-speciality',
    templateUrl: './main.component.html',
    styleUrls: ['/css/main.component.css'],
    providers: [CardiacService]
})
export class CardiacComponent implements OnInit {
    // Data Vars
    topRankedDiagnosisData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();
    textVisualizationData: TextVisualizationDataModel = new TextVisualizationDataModel();
    imageVisualizationData: ImageVisualizationDataModel = new ImageVisualizationDataModel();
    reasoningVisualizationData: SankeyDataModel = new SankeyDataModel();
    selectedAnswerData: AnswerDataModel = new AnswerDataModel();
    public selectedQuestion: QuestionDataModel = new QuestionDataModel();

    //Vars
    public showAnalysisImages: boolean = true;
    public showRightAside: boolean = false;
    public showNav: boolean = false;
    public showImageBox: boolean = false;
    public showButton: boolean = true;
    public max: number = 200;
    public showWarning: boolean;
    public dynamic: number;
    public type: string;
    public stacked: number[] = [0, 1, 2, 3];
    public isCardiac: boolean = true;      // tells main.component.html that we are in the cardiac component
    public isBreast: boolean = false;      // tells main.component.html that we are in the cardiac component
    public subState: string = '';          // value 'text' is first subState
    public imageState: number = 0;             // value 0 is first imageState
    public answerState: number;                // value 0 is first answer state
    public imageDescs: string[];
    public examAnswers: string[];
    public showQuestionImage: string = "";  //string to aid control of images on left panel are shown after intermediate page
    public navState: string = "";   //string to aid control of answer states on left panel
    public showImAnalysis = false;

    // Test Drawable data 
    drawableImage: Image2DVisualizationDataModel = new Image2DVisualizationDataModel();
    //Set the image urls for the scrollable imagedata
    displayData: ImageScrollableVisualizationDataModel = new ImageScrollableVisualizationDataModel();



    /*
    * This method automatically pushes the tabs when the page is opened by calling addTab
    */
    constructor(
        private router: Router,
        private cardiacService: CardiacService,
        private questionService: QuestionService,
        private changeDetectorRef: ChangeDetectorRef,
        private spinnerService: SpinnerService,
    ) {
        //All 5 data vars should bind/subscribe to the service 
        cardiacService.topRankedDiagnosisData$.subscribe(
            trdData => {
                this.topRankedDiagnosisData = trdData;
            });

        //Text
        cardiacService.textVisualizationData$.subscribe(
            textData => {
                this.textVisualizationData = textData;
            });

        //Image
        cardiacService.imageVisualizationData$.subscribe(
            imageData => {
                this.imageVisualizationData = imageData;
            });

        //Reasoning
        cardiacService.reasoningVisualizationData$.subscribe(
            reasoningData => {
                this.reasoningVisualizationData = reasoningData;
            });
        //Answer
        cardiacService.answerVisualizationData$.subscribe(
            answerData => {
                this.selectedAnswerData = answerData;
            });

        //Fake display data 
        for (var i = 1; i <= 294; i++) {
            //Odd numbered slices?!
            this.displayData.imageUrls.push("app/data/AorticDissection/rawdata/0" + i + ".jpg");
        }
        this.displayData.title = "Raw Data";

    }

    /*
    * ngOninit - calling all sub functions
    */
    ngOnInit(): void {

        this.selectedQuestion = this.questionService.getQuestion();
    }

    /*
    * This method reroutes to carousel when home button is pressed on nav and Next Case button is pushed at
    * end of FooBar analysis
    */
    homeClick(event) {
        this.router.navigate(['/carousel']);
    }

    /*
    * This method will get the data arry from getCardiacTextVisualizationData
    */
    getTextVisualizationData() {
        this.cardiacService.getCardiacTextVisualizationData();
    }

    /*
    * This method will get the data arry from getCardiacTextVisualizationData
    */
    getImageVisualizationData() {
        this.cardiacService.getCardiacImageVisualizationData();
    }

    /*
    * This method will get the data arry from getReasoningVisualizationData
    */
    getReasoningVisualizationData() {
        this.cardiacService.getCardiacReasoningVisualization();
    }

    /*
    * This method will get the data arry from getReasoningVisualizationData
    */
    getAnswerVisualizationData() {
        this.cardiacService.getCardiacAnsweringVisualization();
    }

    /*
    * Set the subState, which controls what is displayed in the view;
    *    called by main.component.html
    */
    setSubstate(sIn) {
        this.subState = sIn;
    }

    /*
    * Set the imageState, which controls what images are displayed in the center panel;
    *    called by main.component.html
    */
    setImageState(iIn) {
        this.imageState = iIn;
    }

    /*
    * This method starts the analysis and times it
    */
    startAnalysis(event) {

        this.showImageBox = true;
        this.showAnalysisImages = false;
        this.showRightAside = true;
        this.showNav = true;
        this.showImageBox = true;
        this.showButton = false;
        this.showQuestionImage = "yes";

        //Start analysis in loop
        let _thisRef = this;

        //At 0 
        setTimeout(function () {
            _thisRef.spinnerService.start("Processing Text");
        }, 0);

        //At 8000 
        setTimeout(function () {
            _thisRef.subState = 'text';
            _thisRef.getTextVisualizationData();
        }, 8000);

        //At 12000 
        setTimeout(function () {
            _thisRef.spinnerService.stop();
        }, 12000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.start("Processing Image");
            _thisRef.subState = 'images';
            _thisRef.getImageVisualizationData();
        }, 14000);

        //At 10000 
        setTimeout(function () {
            _thisRef.showImAnalysis = true;
            _thisRef.spinnerService.stop();
        }, 56000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.start("Processing Reasoning");
            _thisRef.subState = 'diagnosis';
            _thisRef.getReasoningVisualizationData();
        }, 58000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.stop();
        }, 80000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.start("Processing Answer");
        }, 80000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.stop();
            _thisRef.subState = 'decide';
            _thisRef.getAnswerVisualizationData();
        }, 84000);


    }

}

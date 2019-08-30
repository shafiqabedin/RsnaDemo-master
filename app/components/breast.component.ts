/**
 * BreastComponent - class that deals with firing off the services for the breast visualization
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
import { BreastService } from '../services/breast.service'
import { TextVisualizationDataModel } from '../models/text-visualization-data-model';
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';
import { Image3DVisualizationDataModel } from '../models/image-3d-visualization-data-model';
import { ImageVisualizationDataModel } from '../models/image-visualization-data-model';
import { PatientCaseAnalysisDataModel } from '../models/patient-case-analysis-data-model';
import { TopRankedDiagnosisDataModel } from '../models/top-ranked-diagnosis-data-model';
import { ImageScrollableVisualizationDataModel } from '../models/image-scrollable-visualization-data-model';
import { QuestionComponent } from '../components/question.component';
import { QuestionService } from '../services/question.service';
import { QuestionDataModel } from '../models/question-data-model';
import { AnswerDataModel } from '../models/answer-data-model';
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
    selector: 'my-breast-speciality',
    templateUrl: './main.component.html',
    styleUrls: ['/css/main.component.css'],
    providers: [BreastService]
})
export class BreastComponent implements OnInit {
    // Data Vars
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
    public isCardiac: boolean = false;      // tells main.component.html that we are in the cardiac component
    public isBreast: boolean = true;      // tells main.component.html that we are in the cardiac component
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

    /*
    * This method automatically pushes the tabs when the page is opened by calling addTab
    */
    constructor(
        private router: Router,
        private breastService: BreastService,
        private questionService: QuestionService,
        private changeDetectorRef: ChangeDetectorRef,
        private spinnerService: SpinnerService,
    ) {

        //Get the question first


        this.selectedQuestion = this.questionService.getQuestion();
        // if (this.questionService.getQuestion().questionText === "") {
        //     console.warn("Question not selected. Routing back to carousel.");
        //     this.homeClick("");
        // }


        //All 5 data vars should bind/subscribe to the service 
        breastService.topRankedDiagnosisData$.subscribe(
            trdData => {
                this.topRankedDiagnosisData = trdData;
            });

        //Text
        breastService.textVisualizationData$.subscribe(
            textData => {
                this.textVisualizationData = textData;
            });

        //Image
        breastService.imageVisualizationData$.subscribe(
            imageData => {
                this.imageVisualizationData = imageData;
            });

        //Reasoning
        breastService.reasoningVisualizationData$.subscribe(
            reasoningData => {
                this.reasoningVisualizationData = reasoningData;
            });
        //Answer
        breastService.answerVisualizationData$.subscribe(
            answerData => {
                this.selectedAnswerData = answerData;
            });

        //Fake display data 
        this.drawableImage.imageUrl = "https://s-media-cache-ak0.pinimg.com/originals/d1/c1/86/d1c186f563d521371ad93ab68693a362.png"
    }


    ngOnInit(): void {
        this.breastService.getBreastJson();
        // this.getTopRankedDiagnosisData();
        // this.getTextVisualizationData();
        // this.getImageVisualizationData();
        // this.getReasoningVisualizationData();
        // this.getAnswerVisualizationData();
    }

    /*
    * This method reroutes to carousel when home button is pressed on nav and Next Case button is pushed at
    * end of FooBar analysis
    */
    homeClick(event) {
        console.log("Home Clicked: " + event);
        this.router.navigate(['/carousel']);
    }

    /*
    * This method will get the json locally from the breast service
    * - for now - and feed to the barchart component
    */
    getTopRankedDiagnosisData() {
        this.topRankedDiagnosisData = this.breastService.getTopRankedDiagnosis();
    }
    /*
    * This method will get the data arry from getBreastTextVisualizationData
    */
    getTextVisualizationData() {
        this.breastService.getBreastTextVisualizationData();
    }

    /*
    * This method will get the data arry from getBreastTextVisualizationData
    */
    getImageVisualizationData() {
        this.breastService.getBreastImageVisualizationData();
    }

    /*
    * This method will get the data arry from getReasoningVisualizationData
    */
    getReasoningVisualizationData() {
        this.breastService.getBreastReasoningVisualization();
    }

    /*
    * This method will get the data arry from getReasoningVisualizationData
    */
    getAnswerVisualizationData() {
        this.breastService.getBreastAnsweringVisualization();
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
    * This method removes/adds elements to the DOM when Begin FooBar Analysis button is pushed 
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
        }, 5000);

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
        }, 94000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.start("Processing Reasoning");
            _thisRef.subState = 'diagnosis';
            _thisRef.getReasoningVisualizationData();
        }, 96000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.stop();
        }, 120000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.start("Processing Answer");
        }, 121000);

        //At 10000 
        setTimeout(function () {
            _thisRef.spinnerService.stop();
            _thisRef.subState = 'decide';
            _thisRef.getAnswerVisualizationData();
        }, 123000);
    }

}

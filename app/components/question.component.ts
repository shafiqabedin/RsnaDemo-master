/**
 * QuestionComponent - handles showing of the question   
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common/src/directives';
import { QuestionDataModel } from '../models/question-data-model';
import { QuestionService } from '../services/question.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'my-question',
    templateUrl: 'app/components/question.component.html',
    styleUrls: ['/css/main.component.css'],
    providers: []
})

export class QuestionComponent {

    public answerState: number;                // value 0 is first answer state
    public examAnswers: string[];
    public imageThumb: boolean = false; //hides image thumbnails
    public chooseAnswer: boolean = true; //allows user choose from answers on left panel
    public disableAnswer: boolean = false; //disables answers on left panel
    private selectedQuestion: QuestionDataModel = new QuestionDataModel();;
    private selectedQuestionSubscription: Subscription;


    //Constructor
    constructor(
        private questionService: QuestionService,
        private changeDetectorRef: ChangeDetectorRef        
    ) {
        //Question Subscription
        this.selectedQuestionSubscription = questionService.question$.subscribe(
            data => {
                //Update questions 
                this.selectedQuestion = data;
            });
    }

    ngOnInit(): void {
        this.getExamAnswers();
        // Get question and answers 
        this.getQuestionData();
    }

    @Input() questionImage: string;
    @Input() answer: string;
    @Input() disable: string;

        
    ngOnChanges(): void{
        this.questionImageShow();
        this.answerStateControl();
    }

    /*this method waits for a string value showQuestionImage in the cardiac component 
    to be updated to "yes" when analysis begins - once analysis begins, the image 
    thumbnails are shown on question component 
    */
    questionImageShow() {
        if (this.questionImage == "yes") {
            this.imageThumb = true;
        }
    }

    /*This method waits for a string value navState in the cardiac component 
    to be updated to "decideState" when FooBar has completed analysis - if user has
    not chosen an answer on the left panel they will be disabled 
    */
    answerStateControl() {
        if (this.disable == "decideState") {
            if (this.answerState) {
                return;
            } else {
                this.disableAnswer = true;
                this.chooseAnswer = false;
            }
        }
    }

    /*
    * This method will get the json locally from the question service
    * - for now - and feed to the questionData: QuestionDataModel;
    */
    getQuestionData() {
        this.selectedQuestion = this.questionService.getQuestion();
    }

    /*
    * Stub for getting the possible answers for the exam question
    */
    getExamAnswers() {
        this.examAnswers = [
            'Enlarged lymph node'
            , 'Aortic dissection'
            , 'Aortic aneurism'
            , 'Congential vascular anomaly'
        ];
    }

    /*
    * Returns the selected exam answer
    */
    getExamAnswer() {
        var sAnswer = (this.answerState) ? this.examAnswers[this.answerState - 1] : 'No answer';

        return sAnswer;
    }

    /*
    * Set the answerState, which controls whether answered questions are shown in the left panel;
    *    called by question.component.html
    */
    setAnswerState(iIn) {
        this.answerState = this.answerState || iIn;
    }

    /*
    * For ordered lists where it's not possible to include the letter, return the
    *    corresponding lowercase alpha, given an integer
    */
    getAlphaFromOrdinal(iIn) {
        return String.fromCharCode(iIn + 96) + '. ';
    }
}
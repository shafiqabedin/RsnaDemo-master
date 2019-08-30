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
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { QuestionDataModel } from '../models/question-data-model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';



@Injectable()
export class CarouselService {

    // Observable sources for the questions
    private questionsSource = new Subject<QuestionDataModel[]>();
    // Observable streams for the questions
    questions$ = this.questionsSource.asObservable();

    constructor(private http: Http) { }

    /**
     * This method retrives the question and answers 
     */
    getQuestions(): void {

        let questions: QuestionDataModel[] = [];
        // Get the local json for testing purposes
        // Get the local json for testing purposes
        this.http
            .get('app/data/testExam.json')
            .toPromise()
            .then(response => {
                let data = response.json();
                let displayImages: any[] = [];

                for (var i = 0; i < data.cases[0].questions.length; i++) {
                    let questionData: QuestionDataModel = new QuestionDataModel();
                    let questionUid = "";
                    let questionText = "";
                    let answerChoices: string[] = [];
                    let mediaUrls: string[] = [];
                    let specialty: string = "";
                    let questionDisplayImage: any;

                    try {
                        //questionUID
                        questionUid = data.cases[0].questions[i].questionUID;

                        //specialty
                        specialty = data.cases[0].questions[i].specialty;

                        //Extract the question text
                        questionText = data.cases[0].questions[i].questionText.text[0].replace(/"/gmi, "");

                        //Extract answer choices
                        for (var j = 0; j < data.cases[0].questions[i].answerChoices.length; j++) {
                            answerChoices.push(data.cases[0].questions[i].answerChoices[j].choice);
                        }

                        //Extract questionMediaUrls
                        for (var k = 0; k < data.cases[0].questions[i].questionMedia.length; k++) {
                            mediaUrls.push(data.cases[0].questions[i].questionMedia[k].mediaDisplayImages[0]);
                        }

                        //Set questionDisplayImage - atleast one display Image is required
                        if(data.cases[0].questions[i].questionMedia.length>0){
                            let source = data.cases[0].questions[i].questionMedia[0].mediaDisplayImages[0]
                            questionDisplayImage = {image: `${source}`}
                        }

                    }
                    catch (error) {
                        console.warn("Could not parse json data for question: " + error);
                    }
                    finally {
                        questionData.questionUID = questionUid;
                        questionData.specialty = specialty;
                        questionData.questionText = questionText;
                        questionData.answerChoices = answerChoices;
                        questionData.questionMediaUrls = mediaUrls;
                        questionData.questionDisplayImage = questionDisplayImage;

                    }
                    //Push question into questions array
                    questions.push(questionData);
     
                }
                //Update the questions data source
                this.questionsSource.next(questions);
     
            });

    }

}
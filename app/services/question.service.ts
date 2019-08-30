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
export class QuestionService {

    // Observable sources for the questions
    private questionSource = new Subject<QuestionDataModel>();
    // Observable streams for the questions
    question$ = this.questionSource.asObservable();

    public selectedQuestion: QuestionDataModel = new QuestionDataModel();


    constructor(private http: Http) { }

    /**
     * Set the question 
     */
    setQuestion(question: QuestionDataModel) {
        this.selectedQuestion = question;
        this.questionSource.next(question);
    }

    /**
     * Get the question - This method gets the question set by the carousel component
     */
    getQuestion(): QuestionDataModel {
        return this.selectedQuestion;
    }


}
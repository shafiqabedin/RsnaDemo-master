/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

export class QuestionDataModel {
    questionUID: string;
    questionText: string = "";
    answerChoices: string[] = [];
    selectedAnswer: string = "";
    questionMediaUrls: string[] = [];
    specialty: string = "";
    questionDisplayImage: any;

}
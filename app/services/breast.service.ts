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
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { TextVisualizationDataModel } from '../models/text-visualization-data-model';
import { ImageVisualizationDataModel } from '../models/image-visualization-data-model';
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';
import { PatientCaseAnalysisDataModel } from '../models/patient-case-analysis-data-model';
import { TopRankedDiagnosisDataModel } from '../models/top-ranked-diagnosis-data-model';
import { ImageAnalysisDataModel } from '../models/image-analysis-data-model';
import { SpinnerService } from '../services/spinner.service';
import { QuestionService } from '../services/question.service';
import { ConfigService } from '../services/config.service';
import { SankeyDataModel } from '../models/sankey-data-model';
import { AnswerDataModel } from '../models/answer-data-model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';


@Injectable()

export class BreastService {

    private datastr: string;

    // Observable sources / streams for the TopRankedDiagnosisData
    private topRankedDiagnosisSource = new Subject<TopRankedDiagnosisDataModel>();
    topRankedDiagnosisData$ = this.topRankedDiagnosisSource.asObservable();

    // Observable sources / streams for the Text
    private textVisualizationDataSource = new Subject<TextVisualizationDataModel>();
    textVisualizationData$ = this.textVisualizationDataSource.asObservable();

    // Observable sources / streams for the Image
    private imageVisualizationDataSource = new Subject<ImageVisualizationDataModel>();
    imageVisualizationData$ = this.imageVisualizationDataSource.asObservable();

    // Observable sources / streams for the Reasoning
    private reasoningVisualizationDataSource = new Subject<SankeyDataModel>();
    reasoningVisualizationData$ = this.reasoningVisualizationDataSource.asObservable();

    // Observable sources / streams for the 
    private answerVisualizationDataSource = new Subject<AnswerDataModel>();
    answerVisualizationData$ = this.answerVisualizationDataSource.asObservable();

    constructor(
        private http: Http,
        private configService: ConfigService,
        private spinnerService: SpinnerService,
        private questionService: QuestionService
    ) { }

    /**
     * This method get the json from backend and then parses to get text for TextVisualization
     */
    getBreastTextVisualizationData() {

        // Must initialize data model here - otherwise you will get an undefined error
        let tmpTextData: TextVisualizationDataModel = new TextVisualizationDataModel();

        this.http
            .get('app/data/qconcepts_HAIFA.json')
            .toPromise()
            .then(response => {
                //
                let breastNoOfConcepts = 0;
                let data = response.json();
                let concept = "";
                let textHighlights: string[] = [];
                let separator = /[\s,]+/;
                let pcaData: PatientCaseAnalysisDataModel = new PatientCaseAnalysisDataModel();
                let tmpTrdData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();


                try {
                    //Get number of concepts
                    breastNoOfConcepts = data.explanationTextAnalytics.extractedConcepts.length;

                    //Extract the question text
                    concept = this.questionService.getQuestion().questionText.replace(/"/gmi, "");

                    //Extract all the features for patient case analysis
                    for (let i = 0; i < data.explanationTextAnalytics.extractedConcepts.length; i++) {
                        pcaData.features.push([data.explanationTextAnalytics.extractedConcepts[i].name, data.explanationTextAnalytics.extractedConcepts[i].value]);
                    }

                    //Extract the symptoms
                    for (let i = 0; i < data.explanationTextAnalytics.extractedConcepts.length; i++) {
                        if (data.explanationTextAnalytics.extractedConcepts[i].highligthedPhrases.length > 0) {
                            textHighlights.push(data.explanationTextAnalytics.extractedConcepts[i].highligthedPhrases[0]);
                        }
                    }

                    //Extract the answer for bargraph
                    for (let i = 0; i < data.explanationTextAnalytics.answersWeights.length; i++) {
                        tmpTrdData.data.push(
                            [data.explanationTextAnalytics.answersWeights[i].name, data.explanationTextAnalytics.answersWeights[i].metadata.weight]
                        );
                    }
                }
                catch (error) {
                    console.warn("Could not parse text json data for text: " + error);
                }
                finally {
                    tmpTextData.concept = concept;
                    tmpTextData.textHighlights = textHighlights;
                    tmpTextData.id = 0;
                    tmpTextData.color = "red";
                    tmpTextData.patientCaseAnalysisData = pcaData;
                    //Update topRankedDiagnosis 
                    this.topRankedDiagnosisSource.next(tmpTrdData);
                    // Update textVisualizationData
                    this.textVisualizationDataSource.next(tmpTextData);

                }
            });
    }

    /**
     * This method starts the breast image service and returns text visualization
     */
    getBreastImageVisualizationData() {

        // Must initialize data model here - otherwise you will get an undefined error
        let tmpImageData: ImageVisualizationDataModel = new ImageVisualizationDataModel();
        let tmpTrdData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();

        this.http
            .get('app/data/qimaging_HAIFA.json')
            .toPromise()
            .then(response => {
                let data = response.json();
                let imData: ImageAnalysisDataModel = new ImageAnalysisDataModel();

                // Loop through the animationGroups to extract urls - this may change 
                for (let i = 0; i < data.explanationImagingAnalytics.displayGraphics.groups[0].frames.length; i++) {

                    let url = "";
                    let title = "-Missing Title-";
                    try {
                        url = data.explanationImagingAnalytics.displayGraphics.groups[0].frames[i].images[0].url.replace(/"/gmi, "");
                        title = data.explanationImagingAnalytics.displayGraphics.groups[0].frames[i].title.replace(/"/gmi, "");
                    }
                    catch (error) {
                        console.warn("Could not parse image json data for " + i + "th element: " + error);
                    }
                    finally {
                        if (url) {
                            let tmp2dData: Image2DVisualizationDataModel = new Image2DVisualizationDataModel();
                            tmp2dData.id = i;
                            tmp2dData.imageUrl = url;
                            tmp2dData.title = title;
                            tmp2dData.canvasWidth = window.innerWidth * 0.60;
                            tmp2dData.canvasHeight = window.innerHeight * 0.60;
                            tmp2dData.canDrawRectangle = true;
                            tmpImageData.visualizationDataArray.push(tmp2dData);
                        }
                    }
                }

                //Extract the features for Image Analysis
                for (let i = 0; i < data.explanationImagingAnalytics.extractedConcepts.length; i++) {
                    imData.features.push([data.explanationImagingAnalytics.extractedConcepts[i].name, data.explanationImagingAnalytics.extractedConcepts[i].value]);
                }

                //Extract the answer for bargraph
                for (let i = 0; i < data.explanationImagingAnalytics.answerWeights.length; i++) {
                    console.log(data.explanationImagingAnalytics.answerWeights[i].name + " - " + data.explanationImagingAnalytics.answerWeights[i].metadata.weight);
                    tmpTrdData.data.push(
                        [data.explanationImagingAnalytics.answerWeights[i].name, data.explanationImagingAnalytics.answerWeights[i].metadata.weight]
                    );
                }
                //Update topRankedDiagnosis 
                this.topRankedDiagnosisSource.next(tmpTrdData);

                //Set Image Analysis Data
                tmpImageData.imageAnalysisData = imData;
                this.imageVisualizationDataSource.next(tmpImageData);

            });

    }

    /**
     * This method starts the breast Reasoning service and returns text visualization
     */
    getBreastReasoningVisualization() {

        // Must initialize data model here - otherwise you will get an undefined error
        let reasoningData: SankeyDataModel = new SankeyDataModel();
        this.http
            .get('app/data/qreasoning_HAIFA.json')
            .toPromise()
            .then(response => {
                let data = response.json();
                let tmpTrdData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();
                try {
                    //Get the levels + nodes
                    // let t = "\n\n";
                    // for (var i = 0; i < data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels.length; i++) {
                    //     for (var j = 0; j < data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes.length; j++) {
                    //         if (data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j]) {
                    //             let src = data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].source
                    //                 .replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                    //             let dst = data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].destination
                    //                 .replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                    //             reasoningData.rows.push([
                    //                 src,
                    //                 dst,
                    //                 data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].weight,
                    //                 data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].label,
                    //                 "\"opacity: 0.0; color: #4682B4;\""
                    //             ]);
                    //             t += "[" +
                    //                 "\"" + src + "\", " +
                    //                 "\"" + dst + "\", " +
                    //                 data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].weight +", "+
                    //                 "\"" + data.explanationReasoning.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].label + "\", " +
                    //                 "\"opacity: 0.0; color: #4682B4;\", " +
                    //                 "]\n";
                    //         }
                    //     }
                    // }
                    // console.log(t);

                    let rows = [
                        // ["Text: Screening Mammography", "Screening Mammography", 1, "Clinical concept detection", "opacity: 0.0; color: #4682B4;"],
                        ["Lumpectomy", "Lumpectomy Of Breast", 2, "Clinical concept detection", "opacity: 0.0; color: #4682B4;"],
                        ["80-year-old", "Age: Advanced", 1, "Clinical concept detection", "opacity: 0.0; color: #4682B4;"],
                        ["Mass Density: Fat-containing", "Bi-rads Assesment: Bi-rads 2", 1, "Image semantic features", "opacity: 0.0; color: #4682B4;"],
                        ["Mass Density: Fat-containing", "Minimal Image Representation Set", 1.5, "Mininmum Image Representing Set key", "opacity: 0.0; color: #4682B4;"],
                        ["Mass Margin: Indistinct", "Bi-rads Assesment: Bi-rads 2", 1, "Image semantic features", "opacity: 0.0; color: #4682B4;"],
                        ["Mass Shape: Irregular", "Bi-rads Assesment: Bi-rads 2", 1, "Image semantic features", "opacity: 0.0; color: #4682B4;"],
                        ["Mass Uniformity: Heterogenous", "Bi-rads Assesment: Bi-rads 2", 1, "Image semantic features", "opacity: 0.0; color: #4682B4;"],
                        ["Mass Uniformity: Heterogenous", "Minimal Image Representation Set", 1.5, "Mininmum Image Representing Set key", "opacity: 0.0; color: #4682B4;"],
                        ["Age: Advanced", "Idc", 2, "Age", "opacity: 0.0; color: #4682B4;"],
                        ["Age: Advanced", "Simple Cyst Of Breast", 0.1, "Age", "opacity: 0.0; color: #4682B4;"],
                        ["Age: Advanced", "Fibroadenoma Of Breast", 0.1, "Age", "opacity: 0.0; color: #4682B4;"],
                        ["Age: Advanced", "Fat Necrosis Of Breast", 1, "Age", "opacity: 0.0; color: red;"],
                        ["Lumpectomy Of Breast", "Idc", 2, "H/O: surgery", "opacity: 0.0; color: #4682B4;"],
                        ["Lumpectomy Of Breast", "Simple Cyst Of Breast", 0.1, "H/O: surgery", "opacity: 0.0; color: #4682B4;"],
                        ["Lumpectomy Of Breast", "Fibroadenoma Of Breast", 0.1, "H/O: surgery", "opacity: 0.0; color: #4682B4;"],
                        ["Lumpectomy Of Breast", "Fat Necrosis Of Breast", 2, "H/O: surgery", "opacity: 0.0; color: red;"],
                        ["Screening Mammography", "Idc", 1, "Indication", "opacity: 0.0; color: #4682B4;"],
                        ["Screening Mammography", "Simple Cyst Of Breast", 0.1, "Indication", "opacity: 0.0; color: #4682B4;"],
                        ["Screening Mammography", "Fibroadenoma Of Breast", 1, "Indication", "opacity: 0.0; color: #4682B4;"],
                        ["Screening Mammography", "Fat Necrosis Of Breast", 1, "Indication", "opacity: 0.0; color: red;"],
                        ["Bi-rads Assesment: Bi-rads 2", "Minimal Image Representation Set", 4, "Mininmum Image Representing Set key", "opacity: 0.0; color: #4682B4;"],
                        ["Minimal Image Representation Set", "Fat Necrosis Of Breast", 7, "Mininmum Image Representing Set key", "opacity: 0.0; color: red;"]
                    ];
                    reasoningData.rows = rows;
                    //Extract the answer for bargraph
                    for (let i = 0; i < data.explanationReasoning.answerWeights.length; i++) {
                        tmpTrdData.data.push(
                            [data.explanationReasoning.answerWeights[i].name, data.explanationReasoning.answerWeights[i].metadata.weight]
                        );
                    }

                }
                catch (error) {
                    console.warn("Could not parse reasoning json data for links: " + error);
                }
                finally {
                    //Update topRankedDiagnosis 
                    this.topRankedDiagnosisSource.next(tmpTrdData);

                    //Update sankey data 
                    this.reasoningVisualizationDataSource.next(reasoningData);
                }
            });
    }

    /**
     * This method starts the breast answering service and returns text visualization
     */
    getBreastAnsweringVisualization(): void {

        // Must initialize data model here - otherwise you will get an undefined error
        let selectedAnswer: AnswerDataModel = new AnswerDataModel();
        this.http
            .get('app/data/qselectedanswer_HAIFA.json')
            .toPromise()
            .then(response => {
                let data = response.json();
                let answer = "";
                try {
                    //Get the levels + nodes   
                    if (data.explanationAnswerSelection.selectedAnswers[0]) {
                        answer = data.explanationAnswerSelection.selectedAnswers[0].choice;
                    }
                }
                catch (error) {
                    console.warn("Could not parse answer json data for choice: " + error);
                }
                finally {
                    selectedAnswer.selectedAnswers = answer;
                    //Update sankey data 
                    this.answerVisualizationDataSource.next(selectedAnswer);
                }
            });
    }

    /**
     * This method starts the breast text service and returns text visualization
     */
    getTopRankedDiagnosis(): TopRankedDiagnosisDataModel {

        let tmpTrdData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();
        // Get the local json for testing purposes
        // Get the local json for testing purposes
        this.http
            .get('app/data/ranked-diagnosis.json')
            .toPromise()
            .then(response => {
                let data = response.json()
                tmpTrdData.data = data;
            });

        return tmpTrdData;
    }

    /**
     * This method starts the breast text service and returns text visualization
     */
    updateTopRankedDiagnosis() {
        //This is where we will actually update the TopRankedDiagnosisData but for now lets do some randon values

        let tmpTrdData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();
        tmpTrdData.data.push(
            ["Breast Hamartoma", this.getRandomArbitrary(1, 10)],
            ["Fibroadenoma of Breast", this.getRandomArbitrary(1, 10)],
            ["Simple Cyst of Breast", this.getRandomArbitrary(1, 10)],
            ["Infiltrating Duct Carcinoma of Breast", this.getRandomArbitrary(1, 10)]
        );

        // Update the TopRankedDiagnosisDataModel
        this.topRankedDiagnosisSource.next(tmpTrdData);
    }

    /**
     * This method randomly generates number between min and max
     */
    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * sleep function to simulate delay
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * sleep function to simulate delay
     */
    getBreastJson() {
        console.log("Get Question: " + this.configService.sampleBreastQuestion.name);
        console.log("Get Question: " + this.configService.sampleBreastQuestion + " - " + this.extractQuestionDetailsFromQuestionObject());

        var question = this.extractQuestionDetailsFromQuestionObject();
        var serviceURL = this.configService.breastConfig.RsnaBreastAnalyticService;
        var visDir = this.configService.breastConfig.visualizationDir;

        // reading the list of inputURIs to join
        // ====================================================================		
        var inputURIs = [];
        var media = question.media;
        for (var media_index = 0; media_index < media.length; ++media_index) {
            inputURIs.push(media[media_index].mediaURL);
        }

        // Creating the input params object
        // ==================================================================== 
        var inputParams = {};
        inputParams.CTAEngine = {};
        inputParams.QAEngine = {};
        inputParams.CTAEngine.options = [];
        for (let ans_index = 0; ans_index < question.answers.length; ++ans_index) {
            var ans = {};
            ans.id = ans_index;
            ans.val = question.answers[ans_index].text;
            inputParams.CTAEngine.options.push(ans);
        }
        inputParams.QAEngine.saveExplanation = 1;
        inputParams.FBSegmentation = {};
        inputParams.FBSegmentation.saveExplanation = 1;

        // Creating the headers for the medical sieve REST request
        // ====================================================================
        var headersOptions = {};
        headersOptions["Accept"] = "application/json";
        headersOptions['X-Medsieve-Analytics-Name'] = question.pipeline;
        headersOptions['X-Medsieve-Text'] = question.text;
        headersOptions['X-Medsieve-Input-ID'] = question.questionUID;
        headersOptions['X-Medsieve-Input-URI'] = inputURIs.join(";");
        headersOptions["X-Medsieve-Input-Params"] = JSON.stringify(inputParams);
        headersOptions['X-Medsieve-Visualization-URI'] = this.configService.breastConfig.visualizationDir;
      
         var xhttp = new XMLHttpRequest();
         xhttp.open("POST", serviceURL + 'service/Analytics', false);
         for (var name in headersOptions)
         {
         	xhttp.setRequestHeader(name, headersOptions[name]);
         }
         xhttp.send();
         var response = xhttp.responseText;
         console.log("Response: " + response);
         return (JSON.parse(response));  
    }

    /**
     * getActualDisplayURI to get display links
     */
    getActualDisplayURI(uri) {
        var displayUri = uri.replace(this.configService.breastConfig.mediaURLLocationPrefix, this.configService.breastConfig.displayImagesService).split(" ").join("%20")
        var b = Number(displayUri.lastIndexOf("/"));
        var e = Number(displayUri.lastIndexOf("."));
        displayUri = (displayUri.substring(0, e) + ".jpg").split("+").join("%2B");
        return displayUri;
    }

    /**
     * extractQuestionDetailsFromQuestionObject
     */
    extractQuestionDetailsFromQuestionObject() {
        var caseObj = {};
        caseObj.source = this.configService.sampleBreastQuestion;
        var sp = caseObj.source.name.split(";");
        caseObj.pipeline = sp[0];
        caseObj.questionUID = sp[1];
        caseObj.text = caseObj.source.questionText.text[0];
        var questionMedia = caseObj.source.questionMedia;
        caseObj.media = [];
        for (var mi in questionMedia) {
            var mediaObj = {};
            mediaObj.mediaURL = questionMedia[mi].mediaURL.replace('\\', '/');
            mediaObj.displayFile = this.getActualDisplayURI(mediaObj.mediaURL);
            caseObj.media.push(mediaObj);
        }
        var answerChoices = caseObj.source.answerChoices;
        caseObj.answers = [];
        for (var ai in answerChoices) {
            var answerObj = {};
            answerObj.id = ai;
            answerObj.text = answerChoices[ai].choice;
            answerObj.selected = false;
            caseObj.answers.push(answerObj);
        }

        caseObj.isAnswered = false;
        caseObj.radiologicChoice = -1;
        caseObj.isAskedFooBar = false;
        caseObj.isFooBarAnswered = false;
        return caseObj;
    };

}
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
import { TextVisualizationDataModel } from '../models/text-visualization-data-model';
import { ImageVisualizationDataModel } from '../models/image-visualization-data-model';
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';
import { Image3DVisualizationDataModel } from '../models/image-3d-visualization-data-model';
import { PatientCaseAnalysisDataModel } from '../models/patient-case-analysis-data-model';
import { TopRankedDiagnosisDataModel } from '../models/top-ranked-diagnosis-data-model';
import { ImageAnalysisDataModel } from '../models/image-analysis-data-model';
import { ImageScrollableVisualizationDataModel } from '../models/image-scrollable-visualization-data-model';
import { SankeyDataModel } from '../models/sankey-data-model';
import { AnswerDataModel } from '../models/answer-data-model';
import { SpinnerService } from '../services/spinner.service';
import { QuestionService } from '../services/question.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';


@Injectable()

export class CardiacService {

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
        private spinnerService: SpinnerService,
        private questionService: QuestionService
    ) { }

    /**
     * This method get the json from backend and then parses to get text for TextVisualization
     */
    getCardiacTextVisualizationData() {

        // Must initialize data model here - otherwise you will get an undefined error
        let tmpTextData: TextVisualizationDataModel = new TextVisualizationDataModel();
        this.http
            .get('app/data/qconcepts.json')
            .toPromise()
            .then(response => {
                //
                let cardiacNoOfConcepts = 0;
                let data = response.json();
                let concept = "";
                let textHighlights: string[] = [];
                let separator = /[\s,]+/;
                let pcaData: PatientCaseAnalysisDataModel = new PatientCaseAnalysisDataModel();
                let tmpTrdData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();

                try {
                    //Get number of concepts
                    cardiacNoOfConcepts = data.extractedConcepts.length;

                    //Extract the question text
                    concept = this.questionService.getQuestion().questionText.replace(/"/gmi, "");

                    //Extract all the features for patient case analysis
                    //For Age
                    pcaData.features.push([data.extractedConcepts[2].name, data.extractedConcepts[2].content.value.value + " " + data.extractedConcepts[2].content.value.unit]);
                    //For Gender
                    pcaData.features.push([data.extractedConcepts[3].name, data.extractedConcepts[3].content.value.value]);

                    //Extract the symptoms
                    for (let i = 4; i < (cardiacNoOfConcepts - 4); i++) {
                        textHighlights.push(data.extractedConcepts[i].name);
                        pcaData.features.push([data.extractedConcepts[i].conceptype.name, data.extractedConcepts[i].name]);
                    }
                    //For Modality
                    pcaData.features.push([data.extractedConcepts[0].name, data.extractedConcepts[0].content.value.value]);
                    //For Q Type
                    pcaData.features.push([data.extractedConcepts[1].name, data.extractedConcepts[1].content.value.value]);


                    //Extract the answer for bargraph
                    for (let i = (cardiacNoOfConcepts - 4); i < cardiacNoOfConcepts; i++) {
                        tmpTrdData.data.push(
                            [data.extractedConcepts[i].name, data.extractedConcepts[i].metadata.weight]
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
    getCardiacImageVisualizationData() {

        // Must initialize data model here - otherwise you will get an undefined error
        let tmpImageData: ImageVisualizationDataModel = new ImageVisualizationDataModel();

        // this.sleep(10).then(() => {
        this.http
            .get('app/data/qimaging.json')
            .toPromise()
            .then(response => {
                let data = response.json();
                let imData: ImageAnalysisDataModel = new ImageAnalysisDataModel();

                //Set the image urls for the scrollable imagedata

                let tmpScrollData1: ImageScrollableVisualizationDataModel = new ImageScrollableVisualizationDataModel();
                for (var i = 1; i <= 294; i++) {
                    //Odd numbered slices?!
                    tmpScrollData1.imageUrls.push("app/data/AorticDissection/rawdata/0" + i + ".jpg");
                }
                tmpScrollData1.title = "Original Data";
                tmpImageData.visualizationDataArray.push(tmpScrollData1);

                //Set the vtk file paths for the 3D data
                let tmp3dData1: Image3DVisualizationDataModel = new Image3DVisualizationDataModel();
                tmp3dData1.title = "3D Segmentation Result";
                tmp3dData1.vtkfiles = [
                    "app/data/AorticDissection/autoseg/12.vtk",
                    "app/data/AorticDissection/autoseg/13.vtk",
                    "app/data/AorticDissection/autoseg/14.vtk",
                    "app/data/AorticDissection/autoseg/15.vtk",
                    "app/data/AorticDissection/autoseg/16.vtk",
                    "app/data/AorticDissection/autoseg/17.vtk",
                    "app/data/AorticDissection/autoseg/18.vtk",
                    "app/data/AorticDissection/autoseg/19.vtk",
                    "app/data/AorticDissection/autoseg/20.vtk",
                    "app/data/AorticDissection/autoseg/21.vtk",
                    "app/data/AorticDissection/autoseg/22.vtk",
                    "app/data/AorticDissection/autoseg/23.vtk",
                    "app/data/AorticDissection/autoseg/24.vtk",
                    "app/data/AorticDissection/autoseg/25.vtk",
                    "app/data/AorticDissection/autoseg/26.vtk",
                    "app/data/AorticDissection/autoseg/27.vtk",
                    "app/data/AorticDissection/autoseg/28.vtk",
                    "app/data/AorticDissection/autoseg/29.vtk",
                    "app/data/AorticDissection/autoseg/31.vtk"
                ];
                tmpImageData.visualizationDataArray.push(tmp3dData1);

                //Set the vtk file paths for the 3D data
                let tmp3dData2: Image3DVisualizationDataModel = new Image3DVisualizationDataModel();
                tmp3dData2.title = "3D Segmented Aorta";
                tmp3dData2.vtkfiles = [
                    "app/data/AorticDissection/aorta_thoracoabdominal/8.vtk",
                    "app/data/AorticDissection/aorta_thoracoabdominal/13.vtk",
                    "app/data/AorticDissection/aorta_thoracoabdominal/14.vtk",
                    "app/data/AorticDissection/aorta_thoracoabdominal/25.vtk"
                ];
                tmpImageData.visualizationDataArray.push(tmp3dData2);

                // Loop through the animationGroups to extract urls - this may change 
                for (let i = 0; i < data.displayGraphics.groups.length; i++) {
                    let url = "";
                    let title = "-Missing Title-";
                    try {

                        url = data.displayGraphics.groups[i].frames[0].images[0].url.replace(/"/gmi, "");
                        title = data.displayGraphics.groups[i].frames[0].title.replace(/"/gmi, "");
                    }
                    catch (error) {
                        console.warn("Could not parse image json data for " + i + "th element: " + error);
                    }
                    finally {
                        if (url) {
                            let tmp2dData: Image2DVisualizationDataModel = new Image2DVisualizationDataModel();
                            tmp2dData.id = i;
                            tmp2dData.imageUrl = url;
                            tmp2dData.title = "Flap Representing Dissection";
                            tmp2dData.canvasWidth = window.innerWidth * 0.60;
                            tmp2dData.canvasHeight = window.innerHeight * 0.60;
                            tmp2dData.canDrawRectangle = true;
                            tmpImageData.visualizationDataArray.push(tmp2dData);
                        }
                    }
                }

                //Extract the features for Image Analysis
                for (let i = 0; i < data.extractedConcepts.length; i++) {
                    imData.features.push([data.extractedConcepts[i].name, data.extractedConcepts[i].content.value.value]);
                }

                //Set the image urls for the scrollable imagedata

                let tmpScrollData2: ImageScrollableVisualizationDataModel = new ImageScrollableVisualizationDataModel();
                for (var i = 1; i <= 176; i++) {
                    //Odd numbered slices?!
                    tmpScrollData2.imageUrls.push("app/data/AorticDissection/markeddissectedregion/overlay_" + i + ".jpg");
                }
                tmpScrollData2.title = "Slices With Possible Dissection";
                tmpImageData.visualizationDataArray.push(tmpScrollData2);

                // 
                // var text = "\n\n";
                // for (var i = 0; i <= 30; i++) {
                //     text += "\"app/data/3d-data/surface-" + i + ".vtk\",\n";
                // }
                // console.log(text);

                //Set Image Analysis Data
                tmpImageData.imageAnalysisData = imData;
                this.imageVisualizationDataSource.next(tmpImageData);
            });
        // });
    }

    /**
     * This method starts the  Reasoning service and returns reasoning visualization
     */
    getCardiacReasoningVisualization() {

        // Must initialize data model here - otherwise you will get an undefined error
        let reasoningData: SankeyDataModel = new SankeyDataModel();
        this.http
            .get('app/data/qreason.json')
            .toPromise()
            .then(response => {
                let data = response.json();
                let tmpTrdData: TopRankedDiagnosisDataModel = new TopRankedDiagnosisDataModel();

                try {
                    //Get the levels + nodes  

                    reasoningData.rows = [
                        ["Imaging Result: Aortic Dissection Type A", "Aortic Dissection", 1.0, "Imaging Result", "opacity: 0.0; color: red;"],
                        ["Chest Pain", "Aortic Dissection", 1.0, "Symptom", "opacity: 0.0; color: red;"],
                        ["Chest Pain", "Pain In Chest", 0.5, "Synonym", "opacity: 0.0; color: #4682B4;"],
                        ["Chest Pain", "Pain Thoracic", 0.5, "Synonym", "opacity: 0.0; color: #4682B4;"],
                        ["Shortness Of Breath", "Dyspnea", 0.5, "Synonym", "opacity: 0.0; color: #4682B4;"],
                        ["Woman", "Female", 0.5, "Gender", "opacity: 0.0; color: #4682B4;"],
                        ["72 Year", "Adult", 0.5, "Age-group", "opacity: 0.0; color: #4682B4;"],
                        ["Ct Scan", "Aortic Dissection", 0.5, "Test", "opacity: 0.0; color: red;"],
                        ["Chest Pain", "Pulmonary Embolism", 0.5, "Symptom", "opacity: 0.0; color: #4682B4;"],
                        ["Shortness Of Breath", "Pulmonary Embolism", 0.5, "Symptom", "opacity: 0.0; color: #4682B4;"],
                        ["Ct Scan", "Pulmonary Embolism", 0.5, "Test", "opacity: 0.0; color: #4682B4;"],
                        ["Pain In Chest", "Aortic Dissection", 1.0, "symptom", "opacity: 0.0; color: red;"],
                        ["Pain Thoracic", "Aortic Dissection", 1.0, "symptom", "opacity: 0.0; color: red;"],
                        ["Dyspnea", "Aortic Dissection", 1.0, "symptom", "opacity: 0.0; color: red;"],
                        ["Dyspnea", "Pulmonary Embolism", 0.5, "symptom", "opacity: 0.0; color: #4682B4;"],
                        ["Adult", "Demographics", 0.5, "Demographics", "opacity: 0.0; color: #4682B4;"],
                        ["Female", "Demographics", 0.5, "Demographics", "opacity: 0.0; color: #4682B4;"],
                        ["Pain In Chest", "Pulmonary Embolism", 0.5, "symptom", "opacity: 0.0; color: #4682B4;"],
                        ["Demographics", "Aortic Dissection", 1.0, "Gender and Age-group", "opacity: 0.0; color: red;"],
                        ["Demographics", "Pulmonary Embolism", 0.5, "Gender and Age-group", "opacity: 0.0; color: #4682B4;"],
                    ];

                    // for (var i = 0; i < data.displayGraphics.groups[0].frames[0].knowledge.graph.levels.length; i++) {
                    //     for (var j = 0; j < data.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes.length; j++) {
                    //         if (data.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j]) {
                    //             let src = data.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].source
                    //                 .replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
                    //             let dst = data.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].destination
                    //                 .replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });                                    
                    //             reasoningData.rows.push([
                    //                 src,
                    //                 dst,
                    //                 0.5,
                    //                 data.displayGraphics.groups[0].frames[0].knowledge.graph.levels[i].nodes[j].label,
                    //                 "opacity: 0.0; color: #4682B4;"
                    //             ]);
                    //         }
                    //     }
                    // }

                    //Extract the answer for bargraph
                    for (let i = 0; i < data.answerChoices.length; i++) {
                        tmpTrdData.data.push(
                            [data.answerChoices[i].extractedConcepts[0].name, data.answerChoices[i].extractedConcepts[0].metadata.weight]
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
    getCardiacAnsweringVisualization() {

        // Must initialize data model here - otherwise you will get an undefined error
        let selectedAnswer: AnswerDataModel = new AnswerDataModel();
        this.http
            .get('app/data/qselectedanswer.json')
            .toPromise()
            .then(response => {
                let data = response.json();
                let answer = "";
                try {
                    //Get the levels + nodes   
                    if (data.selectedAnswers[0]) {
                        answer = data.selectedAnswers[0].choice;
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

}
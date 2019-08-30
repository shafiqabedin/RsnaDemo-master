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
import { Observable } from 'rxjs';
import { UserDataModel } from '../models/user-data-model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/Rx';


@Injectable()
export class ConfigService {

    public breastConfig = {
        "isMock": false,
        "RsnaBreastAnalyticService": "http://bmfm3.haifa.acme.com:9086/RsnaBreastAnalyticsService/",
        "displayImagesService": "http://bmfm3.haifa.acme.com:9086/RsnaBreastAnalyticsService/DisplayImages",
        "examJson": "inputData/Selected_Exam_2US_3MG_GPFS.json",
        "mediaURLLocationPrefix": "/gpfs/haifa/projects/m/msieve/MedicalSieve/PatientData",
        "visualizationDir": "/home/simona/wlp/usr/servers/RsnaAnalyticsServer/dropins/RsnaBreastAnalyticsService.war/Results",
        "supportedPipelines": ["USAuto", "MGAuto", "USAutoQA", "MGAutoQA", "MGUSAutoQA", "MGDualViewAutoQA", "MGCalcMacroQA", "MGCalcMicroQA", "MGArchDistQA"],
        "internalMode": ["MGArchDistQA", "MGAutoQA", "MGCalcMacroQA", "MGCalcMicroQA", "MGDualViewAutoQA", "MGUSAutoQA", "USAutoQA"]


    };

    //Just a sample breast q for testing
    public sampleBreastQuestion = {
        "questionUID": null,
        "source": "manual",
        "specialty": [
            "BREAST"
        ],
        "modality": [
            "MG"
        ],
        "questionText": {
            "jsonModelName": "com.acme.medsieve.exam.models.QuestionText",
            "vocabsource": "EXAMBANK",
            "vocabType": null,
            "searchkey": null,
            "score": null,
            "numhits": null,
            "name": null,
            "textUID": null,
            "source": "manual",
            "text": [
                "A 80-year-old woman presents for screening mammography. She underwent lumpectomy on the left side 8 years ago. What is the most probable diagnosis?"
            ],
            "concepts": null,
            "provenance": null,
            "nulled": false
        },
        "questionMedia": [
            {
                "jsonModelName": "com.acme.medsieve.exam.models.ExamMmItem",
                "vocabsource": "EXAMBANK",
                "vocabType": null,
                "searchkey": null,
                "score": null,
                "numhits": null,
                "name": null,
                "mediaUID": null,
                "mediasrcID": null,
                "mediaURL": "/Medsieve/ImagesData/LN/LN215/20150210_201502647701/MG/8_bit/I3900000_8bit.tif",
                "source": "manual",
                "media": {
                    "modality": "MG",
                    "specialty": "BREAST",
                    "format": "TIF",
                    "nulled": false,
                    "multiFrame": false
                },
                "caption": "",
                "concepts": null,
                "provenance": null,
                "nulled": false
            }
        ],
        "answerChoices": [
            {
                "jsonModelName": "com.acme.medsieve.exam.models.AnswerChoice",
                "vocabsource": "EXAMBANK",
                "vocabType": null,
                "searchkey": null,
                "score": null,
                "numhits": null,
                "name": "IDC",
                "answerUID": null,
                "type": "TEXT",
                "choice": "IDC",
                "choiceName": "IDC",
                "modalitychoice": "TEXT",
                "concepts": null,
                "provenance": null,
                "nulled": false
            },
            {
                "jsonModelName": "com.acme.medsieve.exam.models.AnswerChoice",
                "vocabsource": "EXAMBANK",
                "vocabType": null,
                "searchkey": null,
                "score": null,
                "numhits": null,
                "name": "Simple cyst of breast",
                "answerUID": null,
                "type": "TEXT",
                "choice": "Simple cyst of breast",
                "choiceName": "Simple cyst of breast",
                "modalitychoice": "TEXT",
                "concepts": null,
                "provenance": null,
                "nulled": false
            },
            {
                "jsonModelName": "com.acme.medsieve.exam.models.AnswerChoice",
                "vocabsource": "EXAMBANK",
                "vocabType": null,
                "searchkey": null,
                "score": null,
                "numhits": null,
                "name": "Fibroadenoma of breast",
                "answerUID": null,
                "type": "TEXT",
                "choice": "Fibroadenoma of breast",
                "choiceName": "Fibroadenoma of breast",
                "modalitychoice": "TEXT",
                "concepts": null,
                "provenance": null,
                "nulled": false
            },
            {
                "jsonModelName": "com.acme.medsieve.exam.models.AnswerChoice",
                "vocabsource": "EXAMBANK",
                "vocabType": null,
                "searchkey": null,
                "score": null,
                "numhits": null,
                "name": "Fat necrosis of breast",
                "answerUID": null,
                "type": "TEXT",
                "choice": "Fat necrosis of breast",
                "choiceName": "Fat necrosis of breast",
                "modalitychoice": "TEXT",
                "concepts": null,
                "provenance": null,
                "nulled": false
            }
        ],
        "answerKey": null,
        "state": "NOTATTEMPTED",
        "nulled": true,
        "provenance": null,
        "type": null,
        "name": "MGAutoQA;case9_MG_Tumor_q1_v1_i1_a1",
        "features": null,
        "questionScore": 0.0
    };

}

















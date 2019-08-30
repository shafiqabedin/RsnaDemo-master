/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */
import { PatientCaseAnalysisDataModel } from '../models/patient-case-analysis-data-model';


export class TextVisualizationDataModel {
    id: number = 0;
    color: string  = "yellow";
    concept: string = "";
    textHighlights: string[] = [];
    patientCaseAnalysisData: PatientCaseAnalysisDataModel = new PatientCaseAnalysisDataModel();  
}

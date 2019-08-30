/**
 * @TO DO  
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */
import { Image2DVisualizationDataModel } from '../models/image-2d-visualization-data-model';
import { Image3DVisualizationDataModel } from '../models/image-3d-visualization-data-model';
import { ImageAnalysisDataModel } from '../models/image-analysis-data-model';
import { ImageScrollableVisualizationDataModel } from '../models/image-scrollable-visualization-data-model';

export class ImageVisualizationDataModel {
    id: number = 0;
    imageAnalysisData: ImageAnalysisDataModel = new ImageAnalysisDataModel();
    // image2DVisualizationDataArray: Image2DVisualizationDataModel[] = [];
    // image3DVisualizationDataArray: Image3DVisualizationDataModel[] = [];
    // imageScrollableVisualizationDataArray: ImageScrollableVisualizationDataModel[] = [];
    visualizationDataArray: any[] = [];
    hasBeenAnimated = false;

}


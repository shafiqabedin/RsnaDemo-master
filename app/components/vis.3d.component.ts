/**
 * Visualization3DComponent - class that shows 3D data  
 *
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 */

import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Image3DVisualizationDataModel } from '../models/image-3d-visualization-data-model';


@Component(
  {
    selector: 'visualization3d',
    template: '<div></div>',
  })


export class Visualization3DComponent {
  el: HTMLElement;
  w: any;
  private visualization3dData: Image3DVisualizationDataModel = new Image3DVisualizationDataModel();
  private stats: Stats;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: TrackballControls;
  private sphere: Mesh;
  private offset = 50;
  private mesh: Mesh;
  private animationId;

  @Input()
  public set content(content: Image3DVisualizationDataModel) {
    this.visualization3dData = content;

  }
  @ViewChild('myvis3d') vis3delement: HTMLElement;

  /*
  * Constructor injects a reference to the element
  */
  constructor(elementRef: ElementRef) {
    this.w = window;
    this.el = elementRef.nativeElement; // You cannot use elementRef directly !
  }

  /*
  * Constructor injects a reference to the element
  */
  ngOnInit() {

    console.log(this.vis3delement);
    this.init();

  }

  /*
  * Draw 3d stuff
  */
  public init() {

    var _thisReference = this;

    this.addStats();

    // const width = window.innerWidth;
    // const height = window.innerHeight - 90;
    // const width = window.innerWidth*0.6;
    const width = 600;
    const height = 600;
    console.log("Width: " + window.innerWidth + "Width 60%: " + window.innerWidth*0.6);

    this.camera = new THREE.PerspectiveCamera(45, width / height);
    this.camera.position.set(0, 0, 650);

    this.scene = new THREE.Scene();
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);


    this.el.appendChild(this.renderer.domElement);

    console.log(" -- " + this.visualization3dData);

    this.controls = new THREE.TrackballControls(this.camera, this.el);


    // VTK Loader
    for (var i = 0; i < this.visualization3dData.vtkfiles.length; i++) {

      // Closure - since events are dispatched by the loader, we need to capture the events and attacha filename 
      (function (fileName) {


        //Three.js VTKLoader 
        var loader = new THREE.VTKLoader();
        loader.load(_thisReference.visualization3dData.vtkfiles[i], function (geometry) {

          /* Center elements - we will get this from Clinical Feature Model (CFM)
           * but for now lets set static.
           * cx:202.76881790161133 cy:158.42913818359375 cz:129.19802856445312  
           */
          geometry.translate(-202.76, -158.42, -129.19);

          //  Prepare the mesh
          // Create random colors - this will be fixed later
          var r = _thisReference.getRandomArbitrary(0, 1);
          var g = _thisReference.getRandomArbitrary(0, 1);
          var b = _thisReference.getRandomArbitrary(0, 1);
          var color = new THREE.Color(r, g, b);

          // Create the material 
          // var material = new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide});
          var material = new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
          _thisReference.mesh = new THREE.Mesh(geometry, material);

          // Add the mesh to scene
          _thisReference.scene.add(_thisReference.mesh);

        });

      } (i)); // End of closure
    }



    // Lights
    //1
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(200, 200, 1000).normalize;
    // this.scene.add(dirLight1);
    // this.scene.add(dirLight1.target);  
    this.camera.add(dirLight1);

    // start animation
    this.animate();

    // bind to window resizes
    window.addEventListener('resize', _ => this.onResize());
  }

  public addStats() {
    this.stats = new Stats();
    this.el.appendChild(this.stats.domElement);
    // document.body.appendChild(this.stats.domElement);
  }

  public addVtkMesh() {

  }

  public updateScale(newScale: number) {
    const that = this;
    new TWEEN.Tween({ scale: this.sphere.scale.x })
      .to({ scale: newScale }, 1000)
      .easing(TWEEN.Easing.Elastic.InOut)
      .onUpdate(function () {
        that.sphere.scale.set(this.scale, this.scale, this.scale);
      })
      .start();
  }

  public animate() {
    this.animationId = window.requestAnimationFrame(_ => this.animate());

    this.stats.update();
    this.controls.update();
    TWEEN.update();

    this.renderer.render(this.scene, this.camera);
  }

  public onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight - 90;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }


  /**
   * This is the random number generation method that 
   * creates number for random color
   * 
   * @param Min & Max numer  
   * @return Random number betweenmin and max 
   * @exception 
   * @see 
   */
  getRandomArbitrary(min, max) {

    return Math.random() * (max - min) + min;
  }

    /*
    * Must clear interval on destroy
    */

    ngOnDestroy(){
        console.log("Destroying visualization3d"+ this.animationId);
        cancelAnimationFrame( this.animationId );
        
        this.camera = null;
        this.renderer = null;
        this.camera = null;
        this.controls = null;
        this.scene = null;
        this.mesh = null;
    }  


}

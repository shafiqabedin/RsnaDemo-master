/**
 * The RenderService is the class that 
 * renders the 3d visualization 
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 * 
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import WebGLRenderer = THREE.WebGLRenderer;
import Scene = THREE.Scene;
import TrackballControls = THREE.TrackballControls;
import PerspectiveCamera = THREE.PerspectiveCamera;
import Mesh = THREE.Mesh;

export class RenderService {
    private stats: Stats;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private controls: TrackballControls;
    private sphere: Mesh;
    private offset = 50;

    public init(container: HTMLElement) {
        this.addStats();

        // const width = window.innerWidth;
        // const height = window.innerHeight - 90;
        const width = 600;
        const height = 600;

        this.camera = new THREE.PerspectiveCamera(45, width / height);
        this.camera.position.set(0, 0, 40);

        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000);

        container.appendChild(this.renderer.domElement);
        this.controls = new THREE.TrackballControls(this.camera, container);


        //Particle Generator
        var geometry, materials = [], parameters, h, color, size, particles, sprite;
        geometry = new THREE.Geometry();

        sprite = new THREE.TextureLoader().load("images/textures/sprites/circle.png");

        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                for (var z = 0; z < 10; z++) {

                    var vertex = new THREE.Vector3();
                    vertex.x = x;
                    vertex.y = y;
                    vertex.z = z;

                    geometry.vertices.push(vertex);
                    // var vertexcolor = "rgb(" + (x * 2) + ", " + (y * 2) + ", " + (z * 2) + ")";
                    var vertexcolor = "rgb(" + 128 + ", " + 128 + ", " + 128 + ")";
                    geometry.colors.push(new THREE.Color(vertexcolor));
                }
            }
        }

        // materials = new THREE.PointsMaterial({ size: 1, vertexColors: THREE.VertexColors });
        materials = new THREE.PointsMaterial({ size: 1, map: sprite, vertexColors: THREE.VertexColors, alphaTest: 0.5, transparent: true });
        particles = new THREE.Points(geometry, materials);
        this.scene.add(particles);


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
        document.body.appendChild(this.stats.domElement);
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
        window.requestAnimationFrame(_ => this.animate());

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
}

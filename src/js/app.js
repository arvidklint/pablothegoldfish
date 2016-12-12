var container;
var camera, scene, projector, renderer, mixer;

var pablo, aquarium, waterLevel ;

var spline, counter = 0, line;
var pabloDepletion = 6;
var pabloIsDead = false;

var tangent = new THREE.Vector3();
var axis = new THREE.Vector3();
var up = new THREE.Vector3(0, 0, 1);

const depleteFactor = 0.005;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );


    //

    scene = new THREE.Scene();

    // Crreate a camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 100;

    // Create a directional light and position it like the camera, sort of
    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
    dirLight.position = camera.position;
    dirLight.rotation = camera.rotation;
    dirLight.position.x += 300;
    dirLight.position.y += 300;
    scene.add(dirLight);

    // Create an ambient light
    var ambLight = new THREE.AmbientLight( 0xffffff, 0.8 );
    ambLight.position.y = 1000;
    scene.add(ambLight);

    var loader = new THREE.JSONLoader();
    loader.load( "../models/pablo-escofish2.json", function( geometry, materials ) {
        for ( var i = 0; i < materials.length; i ++ ) {
            var m = materials[ i ];
            //m.skinning = true;
            m.morphTargets = true;
            console.log(m);
        }
        pablo  = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial( materials ) );

        // pablo = new THREE.Mesh( geometry, new THREE.MultiMaterials( {
        //     vertexColors: THREE.FaceColors,
        //     morphTargets: true
        // } ) );
        pablo.scale.set( 1, 1, 1 );
        scene.add( pablo );

        console.log(scene);

        mixer = new THREE.AnimationMixer( pablo );

        var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'skeletalAction.001', geometry.morphTargets, 30, false );
        console.log(clip);
        mixer.clipAction( clip ).setDuration( 3 ).play();

    } );

    // Create the water level
    waterLevel = new THREE.Object3D();
    waterLevel.add( new THREE.Mesh(
        new THREE.BoxGeometry(100, 60, 70),

        new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: 0.4
        } )
    ) );

    // Set it at the bottom of the aquarium
    waterLevel.position.y = -4.99;

    // Add to scene
    scene.add( waterLevel );

    // Create the glass aquarium
    aquarium = new THREE.Object3D();
    aquarium.add( new THREE.Mesh(
        new THREE.BoxGeometry(100, 70, 70),

        new THREE.MeshPhongMaterial( {
            color: 0xE0EAE7,
            // emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
            transparent: true,
            opacity: 0.2
        } )
    ) );

    // Add to scene
    scene.add( aquarium );

    //

    var numPoints = 50;

    spline = new THREE.SplineCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(20, 0, 20),
        new THREE.Vector3(40, 0, 0),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(-25, 0, 0),
        new THREE.Vector3(-15, 0, 5),
        new THREE.Vector3(-10, 0, -20),
        new THREE.Vector3(0, 0, 0)]);

    var material = new THREE.LineBasicMaterial({
        color: 0xff00f0,
    });

    var geometry = new THREE.Geometry();
    var splinePoints = spline.getPoints(numPoints);

    for (var i = 0; i < splinePoints.length; i++) {
        geometry.vertices.push(splinePoints[i]);
    }

    // uncomment if we want to show the path
    // line = new THREE.Line(geometry, material);
    // scene.add(line);

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild(renderer.domElement);

    // Render the objects in the scene in the order they were created
    renderer.sortObjects = false;

    // Create the controls to rotate the aquarium
    var orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = false;

    // Lock the rotation in x-axis, meaning we can't look above or below the aquarium
    orbit.minPolarAngle = Math.PI / 2; // radians
    orbit.maxPolarAngle = Math.PI / 2; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    orbit.minAzimuthAngle = - Math.PI / 2; // radians
    orbit.maxAzimuthAngle = Math.PI / 2; // radians

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//
var prevTime = Date.now();
function moveBox() {
    if (counter <= 1) {
        pabloDepletion += depleteFactor * 30;

        var splinePoint = spline.getPointAt(counter);

        splinePoint.y -= depleteFactor * 30;


        if(pabloDepletion > 35 && !pabloIsDead){
            pablo.position.y = -35;
            pabloIsDead = true;
            prevTime = Date.now();
        } else if(pabloIsDead) {
            var time = Date.now();

            // Run the animation when Pablo hits the bottom of the tank
            mixer.update( ( time - prevTime ) * 0.001 );

            prevTime = time;
        }
        else {
            pablo.position.x = splinePoint.x;
            pablo.position.y = splinePoint.y - pabloDepletion;
            pablo.position.z = splinePoint.z;

            tangent = spline.getTangentAt(counter).normalize();

            axis.crossVectors(up, tangent).normalize();

            var radians = Math.acos(up.dot(tangent));

            pablo.quaternion.setFromAxisAngle(axis, radians);
        }

        // pablo.position.y = (splinePoint.y - pabloDepletion) < -35 ? 0 : splinePoint.y - pabloDepletion;
        // pablo.position.z = splinePoint.z;
        // pablo.position.copy( spline.getPointAt(counter) );


        counter += 0.001
    } else {
        counter = 0;
    }
}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    moveBox();

    if(waterLevel.scale.y > 0){
        // If the water isn't already completely depleted, lower the water level
        waterLevel.scale.y -= depleteFactor;
        console.log(waterLevel.scale.y);
        waterLevel.position.y -= (depleteFactor * 30);
    }

    renderer.render( scene, camera );

}
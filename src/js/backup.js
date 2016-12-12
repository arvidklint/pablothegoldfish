var scene, camera, renderer;
var pablo, aquarium, waterLevel ;

var rotWorldMatrix;

const depleteFactor = 0.005;

init();
animate();

function init() {

    scene = new THREE.Scene();

    // Crreate a camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 150;

    // Create a directional light and position it like the camera, sort of
    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
    dirLight.position = camera.position;
    dirLight.rotation = camera.rotation;
    dirLight.position.x += 300;
    dirLight.position.y += 300;
    scene.add(dirLight);

    // Create an ambient light
    var ambLight = new THREE.AmbientLight( 0xffffff, 0.5 );
    ambLight.position.y = 1000;
    scene.add(ambLight);


    // Add the goldfish here
    pablo = new THREE.Object3D();
    pablo.add( new THREE.Mesh(
        new THREE.BoxGeometry(10, 6, 7),

        new THREE.MeshPhongMaterial({
            color: 0xFFA600,
            // emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
        })
    ));

    scene.add(pablo);


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


    // Make the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Render the objects in the scene in the order they were created
    renderer.sortObjects = false;

    // Add the 3D canvas to the DOM
    document.body.appendChild( renderer.domElement );

    // Create the controls to rotate the aquarium
    var orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.enableZoom = false;

    // Lock the rotation in x-axis, meaning we can't look above or below the aquarium
    orbit.minPolarAngle = Math.PI / 2; // radians
    orbit.maxPolarAngle = Math.PI / 2; // radians

    // How far you can orbit horizontally, upper and lower limits.
    // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    orbit.minAzimuthAngle = - Math.PI / 6; // radians
    orbit.maxAzimuthAngle = Math.PI / 6; // radians
 
}

 
function animate() {
 
    requestAnimationFrame( animate );



    if(waterLevel.scale.y > 0){
        // If the water isn't already completely depleted, lower the water level
        waterLevel.scale.y -= depleteFactor;
        waterLevel.position.y -= (depleteFactor * 30);
        pablo.position.y -= depleteFactor * 30;
    }

    // mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.002;

    renderer.render( scene, camera );
}
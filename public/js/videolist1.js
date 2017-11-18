
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  var container, stats;
  var params = {
    projection: 'normal',
    autoRotate: true,
    reflectivity: 0.5,
    background: false,
    exposure: 1.0,
    gemColor: 'Green'
  };
  var plight;
  var camera, scene, renderer, controls, objects = [];
  var hdrCubeMap;
  var composer;
  var gemBackMaterial, gemFrontMaterial;
  var hdrCubeRenderTarget;
  var projector = new THREE.Projector();

var cleanWhite1 = new THREE.MeshStandardMaterial({

color:0xffffff,


metalness:0.3, //0.1 white unreflective
roughness:0.9,
wireframe:true,

wireframe:true
})



  var ray, OBJLOADED;
  //	var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
  init();
  animate();
  function init() {

    container = document.createElement( 'div' );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    console.log(container);
    renderer.setSize(500,500);
    document.body.appendChild(container);
    // renderer.domElement.style.width = renderer.domElement.width * 2 + 'px';
    // renderer.domElement.style.height = renderer.domElement.height * 2 + 'px';
    console.log(renderer.domElement);

    camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 7, 2, 12 * 1.5 );
  //	camera.updateMatrixWorld();
    scene = new THREE.Scene();


  //	renderer.setClearColor( new THREE.Color( 0xffffff ) );
         //   scene.fog=new THREE.Fog( 0xffffff, 0.015, 100 );



    gemBackMaterial = new THREE.MeshPhysicalMaterial( {
      map: null,
      color: 0x0000ff,
      metalness: 0.2,
      roughness: 0.5,
      opacity: 0.9,
    //	side: THREE.BackSide,
      transparent: true,
      shading: THREE.SmoothShading,
    //	envMapIntensity: 5,
    //	premultipliedAlpha: true
      // TODO: Add custom blend mode that modulates background color by this materials color.
    } );
    gemFrontMaterial = new THREE.MeshPhysicalMaterial( {
      map: null,
      color: 0x0000ff,
      metalness: 0.0,
      roughness: 0,
      opacity: 0.15,
      side: THREE.FrontSide,
      transparent: true,
      shading: THREE.SmoothShading,
      envMapIntensity: 5,
      premultipliedAlpha: true
    } );


    var mtl1Loader = new THREE.MTLLoader();
    var lambert = new THREE.MeshLambertMaterial();
    mtl1Loader.setBaseUrl( '/yamaha/' );
    mtl1Loader.setPath( '/yamaha/' );
    mtl1Loader.load( 'torso.mtl', function( materials ) {
    //	var merged = new THREE.Geometry();
      materials.preload();
    //	materials.shininess = 30;
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials( materials );
  //		hackMaterials(materials);
      objLoader.setPath( '/yamaha/' );
      objLoader.load( 'torso.obj', function ( object ) {

                    object.castShadow = true;
                    object.receiveShadow = true;
        object.updateMatrix();

      //	console.log(scene.position);
        object.position.set(0,1.2,0);
      //	object2.scale.x=object2.scale.y=object2.scale.z=787;
        object.frustumCulled=true;
        OBJLOADED = object;
         object.traverse( function( child ) { if ( child instanceof THREE.Mesh ) {



          if (child.material.name == "b0b0b0")  {

                                    child.material=cleanWhite1;

              //	child.material.side=THREE.DoubleSide;
                child.castShadow = true;
                child.receiveShadow = true;
              }





                     }
                     object.scale.set( 2.02, 2.02, 2.02);

    //	object2.scale.set( 0.004, 0.004, 0.004 );
    //	object.rotateX(320);
    //	object2.rotation.y= Math.PI/-2;
scene.add(object)


      });
      });
    })
    // Lightsjec
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.position.set(100, 140, 130);
            spotLight.intensity = 1;
            spotLight.castShadow=true;
            spotLight.angle -=4.71;  // Math.PI/1;

spotLight.intensity= 0.5;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 50;
spotLight.shadow.camera.far = 50;
spotLight.shadow.camera.fov = 40;
            scene.add(spotLight);
            var spotLightHelper = new THREE.SpotLightHelper( spotLight);
        //    scene.add( spotLightHelper );

  plight = new THREE.PointLight( 0x00aad7, 0.8, 2.7 );
plight.position.set( 0, 0, -500 );
scene.add( plight );



            renderer.shadowMap.enabled = true;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    stats = new Stats();
    container.appendChild( stats.dom );
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.enablePan = false;
controls.enableZoom = true;
controls.enableDamping = true;
controls.minPolarAngle = 0.8;
controls.maxPolarAngle = 2.4;
controls.dampingFactor = 0.07;
controls.rotateSpeed = 0.09;
  //	controls.update();
        renderer.setPixelRatio( window.devicePixelRatio );
  //	renderer.setSize( window.innerWidth, window.innerHeight );

    window.addEventListener( 'resize', onWindowResize, false );
     renderer.domElement.addEventListener("dblclick", ondblclick, false);
     var flag=false;
    $('div.fullscreen').click(function(){
      if ( flag==false) {
                 THREEx.FullScreen.request();
       return flag=true;
                }
      else{
         THREEx.FullScreen.cancel();
         return flag=false;
      }

});

    document.addEventListener('mousemove', onMouseMove, false);
    var gui = new dat.GUI();
    gui.add( params, 'reflectivity', 0, 1 );
    gui.add( params, 'exposure', 0.1, 2 );
    gui.add( params, 'autoRotate' );
    gui.add( params, 'gemColor', [ 'Blue', 'Green', 'Red', 'White', 'Black' ] );
    gui.open();

  }
  function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
  }
  function onMouseMove(event) {

// Update the mouse variable
event.preventDefault();
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;




// Make the sphere follow the mouse
var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
vector.unproject( camera );
var dir = vector.sub( camera.position ).normalize();
var distance = - camera.position.z / dir.z;
var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
plight.position.copy(pos);

// Make the sphere follow the mouse
//	mouseMesh.position.set(event.clientX, event.clientY, 0);
};


var posX = camera.position.x;
var posY = camera.position.y;
var posZ = camera.position.z;


$( document ).ready(function() {
    var from = {
        x: camera.position.x - 40,
        y: camera.position.y - 40,
        z: camera.position.z - 40
    };

    var to = {
        x: 7,
        y: 2,
        z: 12 * 1.5
    };
    var tween = new TWEEN.Tween(from)
        .to(to, 2500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(function () {
        camera.position.set(this.x, this.y, this.z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
        .onComplete(function () {
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
        .start();
});





function ondblclick(event) {
var posX1 = camera.position.x;
var posY1 = camera.position.y;
var posZ1 = camera.position.z;


var newZ = -(camera.position.x * Math.cos(5.49779)) - (camera.position.z * Math.sin(5.49779));
var newX = (camera.position.x * Math.cos(0.78)) + (camera.position.z * Math.sin(0.78));
console.log('click');

var vectorX = camera.position.clone();
var vectorY = camera.position.clone();
var vectorZ = camera.position.clone();
vectorX.applyMatrix4( camera.matrixWorld );
vectorY.applyMatrix4( camera.matrixWorld );
vectorZ.applyMatrix4( camera.matrixWorld );

var from = {
        x: newX,
        y: newZ,
        z: newZ
    };

    var to = {
        x: 7,
        y: 2,
        z: 12 * 1.5
    };
    var tween = new TWEEN.Tween(from)
        .to(to, 1500)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
        camera.position.set(this.x, this.y, this.z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
        .onComplete(function () {
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
        .start();




}

//window.oncontextmenu = function () { return false; }
//document.onkeydown = function (e) {	if (window.event.keyCode == 123 || e.button==2)	return false; }
  //
  function animate() {
     TWEEN.update();
    requestAnimationFrame( animate );
    stats.begin();
    render();
    stats.end();
  }
  function render() {
    controls.update();
// For rendering
// For rendering
renderer.autoClear=false;
renderer.clear();

  //	if ( gemBackMaterial !== undefined && gemFrontMaterial !== undefined ) {
      gemBackMaterial.reflectivity = params.reflectivity;
      var newColor = gemBackMaterial.color;
      switch( params.gemColor ) {
        case 'Blue': newColor = new THREE.Color( 0x000088 ); break;
        case 'Red': newColor = new THREE.Color( 0x880000 ); break;
        case 'Green': newColor = new THREE.Color( 0x008800 ); break;
        case 'White': newColor =  new THREE.Color( 0x888888 ); break;
        case 'Black': newColor =  new THREE.Color( 0x0f0f0f ); break;
      }
      gemBackMaterial.color = newColor;

    renderer.toneMappingExposure = params.exposure;
    var timer = Date.now() * 0.00025;
    camera.lookAt( scene.position );
    if( params.autoRotate ) {
      for ( var i = 0, l = objects.length; i < l; i ++ ) {
        var object = objects[ i ];
        object.rotation.y += 0.005;
                     object.scale.x=object.scale.y=object.scale.z=0.2;
      }
    }
    renderer.render( scene, camera );
  }

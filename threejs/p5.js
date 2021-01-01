// Variables globales consensuadas
var renderer, scene, camera;
var controles;
var keyboard;


function init() {
    // Configurar el motor de render
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFAA));
    renderer.shadowMap.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 2000);
    camera.position.set(200, 275, 200);
    let targetPoint = new THREE.Vector3(0, 200, 0);
    camera.lookAt(targetPoint);
    controles = new THREE.OrbitControls(camera, renderer.domElement);
    controles.target = targetPoint;
    controles.maxDistance = 350;

    // Desactivamos el uso de las flechas para mover la cámara
    controles.noKeys = true;
    keyboard = new THREEx.KeyboardState();
    document.addEventListener("keydown", onKeyDown, false);
}

var materialCastillo, materialAntebrazo, materialRotula, wallsMaterial;

function cargarMaterialesTexturas() {



    materialAntebrazo = new THREE.MeshPhongMaterial({
      color: "gold",
      castShadow:true,
      shininess:300
    })
    material = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        shininess:50,
        castShadow:true
    });

    var texturaSuelo = new THREE.TextureLoader().load("images/pisometal_1024x1024.jpg");
    console.log(texturaSuelo);
    texturaSuelo.wrapS = texturaSuelo.wrapT = THREE.RepeatWrapping;
    texturaSuelo.repeat.set(1, 1);
    texturaSuelo.magFilter = THREE.LinearFilter; // pixel menor que texel
    texturaSuelo.minFilter = THREE.LinearFilter; // texel menor que pixel

    materialSuelo = new THREE.MeshPhongMaterial({
        color: 0xaaaaaa,
        specular: 0x444444,
        shininess: 50,
        map: texturaSuelo
    });

    path = "images/";
    var urls = [path + "posx.jpg", path + "negx.jpg",
          path + "posy.jpg", path + "negy.jpg",
          path + "posz.jpg", path + "negz.jpg" ];
    var mapaEntorno = new THREE.CubeTextureLoader().load( urls );
    mapaEntorno.format = THREE.RGBFormat;

    materialRotula = new THREE.MeshPhongMaterial( { color:0xFFFFFF,
                                                           specular:0x999999,
                                                           shininess:50,
                                                           envMap: mapaEntorno} );
    // var esfera = new THREE.Mesh(new THREE.SphereGeometry( 1, 50, 50 ),
    //                 materialRotula);

    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = mapaEntorno;

    wallsMaterial = new THREE.ShaderMaterial( {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    } );


}


var material;
var geometriaBase, geometriaEje;
var eje, suelo, base, brazo, antebrazo, mano, pinzaDerecha, pinzaIzquierda, robot;


function loadScene() {

    cargarMaterialesTexturas();


    // Suelo
    suelo = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000, 30, 30), materialSuelo);
    suelo.position.set(0, 0, 0); // Centrado en el origen de coordenadas
    suelo.rotation.set(-Math.PI / 2, 0, Math.PI / 2); // Girar el plano para que se ponga horizontal
    suelo.receiveShadow = true;

    // Base
    var geobase = new THREE.CylinderGeometry(50, 50, 15, 50, false);
    base = new THREE.Mesh(geobase, material);
    base.castShadow = true;
    base.receiveShadow = true;
    base.position.set(0, 7.5, 0);;

    // Brazo del robot
    // Contenedor con 4 elementos
    brazo = new THREE.Object3D();

    // Eje
    var geoEje = new THREE.CylinderGeometry(20, 20, 18, 50, false);
    var eje = new THREE.Mesh(geoEje, material);
    eje.position.set(0, 0, 0); // Origen de coordenadas relativo al brazo
    eje.rotation.set(0, 0, Math.PI / 2); // 90º sobre el eje Z
    eje.castShadow = true;
    eje.receiveShadow = true;
    brazo.add(eje)

    // Esparrago
    var esparrago = new THREE.Mesh(new THREE.BoxGeometry(18, 120, 12), material);
    esparrago.position.set(0, 60, 0); // Centrado en altura/2
    esparrago.castShadow = true;
    esparrago.receiveShadow = true;
    brazo.add(esparrago);

    // Rotula
    var rotula = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), materialRotula);
    rotula.position.set(0, 120, 0); // Centrada al final del esparrago
    rotula.castShadow = true;
    rotula.receiveShadow = true;
    brazo.add(rotula);

    // Antebrazo del robot
    // Es un contenedor con 3 elementos
    antebrazo = new THREE.Object3D();
    antebrazo.castShadow = true;
    antebrazo.receiveShadow = true;

    // Disco
    // Cilindro que hace de base del antebrazo
    var disco = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 6, 50, false), materialAntebrazo);
    disco.position.set(0, 0, 0);
    disco.castShadow = true;
    disco.receiveShadow = true;
    antebrazo.add(disco);

    // Nervios
    // "Huesos" que unen la base del antebrazo con la mano
    var geoNervio = new THREE.BoxGeometry(4, 80, 4);
    var coordenadasNervios = [-8, 46, 8, -8, 46, -8, 8, 46, -8, 8, 46, 8];
    for (var i = 0; i < coordenadasNervios.length; i += 3) {
        var nervio = new THREE.Mesh(geoNervio, materialAntebrazo);
        nervio.position.set(coordenadasNervios[i], coordenadasNervios[i + 1], coordenadasNervios[i + 2]);
        antebrazo.add(nervio);
    }

    // Mano
    // Contenedor de 3 elementos
    mano = new THREE.Object3D();
    mano.castShadow = true;
    mano.receiveShadow = true;

    // "Palma" de la mano
    var palmaMano = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 40, 50, false), materialAntebrazo);
    palmaMano.position.set(0, 0, 0);
    palmaMano.rotation.set(0, 0, Math.PI / 2);
    palmaMano.castShadow = true;
    palmaMano.receiveShadow = true;
    mano.add(palmaMano);

    // Pinza derecha del robot
    var verticesDerechos = [-6, 3, 10, -10, 3, 10, -10, 3, 29, -8, 3, 48, -6, 3, 48, -6, 3, 29, -6, 23, 10, -10, 23, 10, -10, 23, 29, -8, 23, 48, -6, 23, 48, -6, 23, 29];
    var triangulosDerechos = [0, 1, 2,
        1, 2, 5,
        2, 3, 5,
        3, 4, 5,
        1, 2, 8,
        1, 8, 7,
        2, 9, 8,
        2, 3, 9,
        3, 4, 10,
        3, 10, 9,
        6, 7, 0,
        1, 0, 7,
        6, 11, 0,
        0, 11, 5,
        5, 11, 10,
        5, 10, 4,
        6, 8, 11,
        6, 7, 8,
        8, 9, 11,
        11, 9, 10
    ];

    var mallaDerecha = new THREE.Geometry();
    for (var i = 0; i < verticesDerechos.length; i += 3) {
        var vertice = new THREE.Vector3(verticesDerechos[i], verticesDerechos[i + 1], verticesDerechos[i + 2]);
        mallaDerecha.vertices.push(vertice);
    }
    for (var i = 0; i < triangulosDerechos.length; i += 3) {
        var triangulo = new THREE.Face3(triangulosDerechos[i], triangulosDerechos[i + 1], triangulosDerechos[i + 2]);
        mallaDerecha.faces.push(triangulo);
    }

    pinzaDerecha = new THREE.Mesh(mallaDerecha, material);
    pinzaDerecha.position.set(0, -13, 0);
    pinzaDerecha.castShadow = true;
    pinzaDerecha.receiveShadow = true;
    mano.add(pinzaDerecha);

    // La pinta izquierda es igual que la derecha pero con otra posicion y rotacion
    pinzaIzquierda = pinzaDerecha.clone();
    pinzaIzquierda.rotation.set(0, 0, Math.PI);
    pinzaIzquierda.position.set(0, 13, 0);
    pinzaIzquierda.castShadow = true;
    pinzaIzquierda.receiveShadow = true;
    mano.add(pinzaIzquierda);


    // Escenografia
    scene.add(new THREE.AxisHelper(500));
    scene.add(suelo);

    // Offsets
    brazo.position.set(0, 15, 0);
    antebrazo.position.set(0, 120, 0);
    mano.position.set(0, 85, 0);

    // Robot
    robot = new THREE.Object3D();
    robot.castShadow = true;
    robot.receiveShadow = true;
    antebrazo.add(mano);
    brazo.add(antebrazo);
    base.add(brazo);
    robot.add(base);
    scene.add(robot);

    // Crea la habitacion con el material de las paredes
    var room = new THREE.Mesh( new THREE.CubeGeometry( 1000, 500, 1000 ), wallsMaterial );
    room.position.y = 240;
    scene.add( room );

}

function setupGui() {
    // Definicion de los controles
    effectController = {
        mensaje: 'Interfaz',
        giroBaseY: 0,
        giroBrazoZ: 0,
        giroAntebrazoY: 0,
        giroAntebrazoZ: 0,
        giroPinzaZ: 0,
        posicionPinza: 0,
        reiniciar: function() {
            TWEEN.removeAll();
            eje.position.set(-2.5, 0, -2.5);
            eje.rotation.set(0, 0, 0);
            startAnimation();
        },
        sombras: true,
        color: "rgb(255,0,0)"
    };

    // Creacion interfaz
    var gui = new dat.GUI();

    // Construccion del menu
    var h = gui.addFolder("Control robot");
    h.add(effectController, "mensaje").name("Robot");
    h.add(effectController, "giroBaseY", -180, 180, 0.5).name("Giro Base (Y)");
    h.add(effectController, "giroBrazoZ", -45, 45, 0.5).name("Giro Brazo (Z)");
    h.add(effectController, "giroAntebrazoY", -180, 180, 0.5).name("Giro Antebrazo (Y)");
    h.add(effectController, "giroAntebrazoZ", -90, 90, 0.5).name("Giro Antebrazo (Z)");
    h.add(effectController, "giroPinzaZ", -40, 220, 0.5).name("Giro Pinza (Z)");
    h.add(effectController, "posicionPinza", 0, 15, 0.5).name("Apertura/Cierre Pinza");
    h.add(effectController, "reiniciar").name("Reiniciar");
    var sensorColor = h.addColor(effectController, "color").name("Color");
    sensorColor.onChange(function(color) {
        robot.traverse(function(hijo) {
            if (hijo instanceof THREE.Mesh) hijo.material.color = new THREE.Color(color);
        })
    });
}

function onKeyDown() {
    // console.log(cameraControls);
    if (keyboard.pressed("left")) {
        robot.position.x -= 1;
    }
    if (keyboard.pressed("right")) {
        robot.position.x += 1;
    }
    if (keyboard.pressed("up")) {
        robot.position.z -= 1;
    }
    if (keyboard.pressed("down")) {
        robot.position.z += 1;
    }
}

function encenderLuces() {
    var luzFocal = new THREE.SpotLight(0xFFFFFF, .6);
    luzFocal.position.set(500, 500, 500);
    luzFocal.target.position.set(0, 0, 0);
    luzFocal.angle = Math.PI / 3;
    luzFocal.penumbra = 0.25;
    // luzFocal.shadow.camera.near = 1;
    // luzFocal.shadow.camera.far = 20;
    // luzFocal.shadow.camera.fov = 70;
    // luzFocal.shadow.mapSize.width = 1024;
    // luzFocal.shadow.mapSize.height = 1024;
    luzFocal.shadowCameraNear = 10;
    luzFocal.shadowCameraFar = 500;
    luzFocal.shadowCameraVisible = true;
    luzFocal.castShadow = true;
    // luzFocal.shadowCameraVisible = true;
    // luzFocal.shadowDarkness = 1;
    scene.add(luzFocal);
    // scene.add( new THREE.CameraHelper(luzFocal.shadow.camera) );

    var luzAmbiente = new THREE.AmbientLight(0xaaaaaa, .2);
    // luzAmbiente.castShadow = true;
    scene.add(luzAmbiente);

    // var sol = new THREE.PointLight(0xFFFFFF, 1.0);
    // sol.position.set(0, 14, 0);
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

function update() {
    base.rotation.y = (effectController.giroBaseY * Math.PI) / 180;
    brazo.rotation.z = (effectController.giroBrazoZ * Math.PI) / 180;
    antebrazo.rotation.y = (effectController.giroAntebrazoY * Math.PI) / 180;
    antebrazo.rotation.z = (effectController.giroAntebrazoZ * Math.PI) / 180;
    mano.rotation.z = (effectController.giroPinzaZ * Math.PI) / 180;
    pinzaIzquierda.position.setX(-effectController.posicionPinza / 2);
    pinzaDerecha.position.setX(effectController.posicionPinza / 2);
}

function main() {
    init();
    loadScene();
    encenderLuces();
    setupGui();
    render();
}

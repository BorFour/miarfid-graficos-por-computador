/*
Seminario GPC #2. Importar un modelo JSON
*/
// Variables globales consensuadas
var renderer, scene, camera;
var controles;

function init() {
    // Configurar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x0000AA));
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Camara
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(200, 275, 200);
    camera.lookAt(new THREE.Vector3(0, 200, 0));
    // controles = new THREE.OrbitControls(camera, renderer.domElement);
}

var material;
var geometriaBase, geometriaEje;
var eje, base, suelo;

function loadScene() {

    var material = new THREE.MeshBasicMaterial({
        color: "red",
        wireframe: true
    });

    // Suelo
    suelo = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000, 30, 30), material);
    suelo.position.set(0, 0, 0); // Centrado en el origen de coordenadas
    suelo.rotation.set(Math.PI / 2, 0, Math.PI / 2); // Girar el plano para que se ponga horizontal

    // Base
    var geobase = new THREE.CylinderGeometry(50, 50, 15, 50, false);
    base = new THREE.Mesh(geobase, material);;
    base.position.set(0, 7.5, 0);;

    // Brazo del robot
    // Contenedor con 4 elementos
    var brazo = new THREE.Object3D();

    // Eje
    var geoEje = new THREE.CylinderGeometry(20, 20, 18, 50, false);
    var eje = new THREE.Mesh(geoEje, material);
    eje.position.set(0, 0, 0); // Origen de coordenadas relativo al brazo
    eje.rotation.set(0, 0, Math.PI / 2); // 90º sobre el eje Z
    brazo.add(eje)

    // Esparrago
    var esparrago = new THREE.Mesh(new THREE.BoxGeometry(18, 120, 12), material);
    esparrago.position.set(0, 60, 0); // Centrado en altura/2
    brazo.add(esparrago);

    // Rotula
    var rotula = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), material);
    rotula.position.set(0, 120, 0); // Centrada al final del esparrago
    brazo.add(rotula);

    // Antebrazo del robot
    // Es un contenedor con 3 elementos
    var antebrazo = new THREE.Object3D();

    // Disco
    // Cilindro que hace de base del antebrazo
    var disco = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 6, 50, false), material);
    disco.position.set(0, 0, 0);
    antebrazo.add(disco);

    // Nervios
    // "Huesos" que unen la base del antebrazo con la mano
    var geoNervio = new THREE.BoxGeometry(4, 80, 4);
    var coordenadasNervios = [-8, 46, 8, -8, 46, -8, 8, 46, -8, 8, 46, 8];
    for (var i = 0; i < coordenadasNervios.length; i += 3) {
        var nervio = new THREE.Mesh(geoNervio, material);
        nervio.position.set(coordenadasNervios[i], coordenadasNervios[i + 1], coordenadasNervios[i + 2]);
        antebrazo.add(nervio);
    }

    // Mano
    // Contenedor de 3 elementos
    var mano = new THREE.Object3D();

    // "Palma" de la mano
    var palmaMano = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 40, 50, false), material);
    palmaMano.position.set(0, 0, 0);
    palmaMano.rotation.set(0, 0, Math.PI / 2);
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

    var pinzaDerecha = new THREE.Mesh(mallaDerecha, material);
    pinzaDerecha.position.set(0, -13, 0);
    mano.add(pinzaDerecha);

    // La pinta izquierda es igual que la derecha pero con otra posicion y rotacion
    var pinzaIzquierda = pinzaDerecha.clone();
    pinzaIzquierda.rotation.set(0, 0, Math.PI);
    pinzaIzquierda.position.set(0, 13, 0);
    mano.add(pinzaIzquierda);


    // Escenografia
    scene.add(new THREE.AxisHelper(500));
    scene.add(suelo);

    // Offsets
    brazo.position.set(0, 15, 0);
    antebrazo.position.set(0, 120, 0);
    mano.position.set(0, 85, 0);

    // Robot
    var robot = new THREE.Object3D();
    antebrazo.add(mano);
    brazo.add(antebrazo);
    base.add(brazo);
    robot.add(base);
    scene.add(robot);

}

function render() {
    requestAnimationFrame(render);
    // update();
    renderer.render(scene, camera);
}

function main() {
    init();
    loadScene();
    render();
}

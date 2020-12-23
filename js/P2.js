/* 
Seminario GPC #2. Forma Basica de biblioteca
*/
// Variables globales consensuadas
var renderer, scene, camera;
init();
loadScene();
render();

function init() {
    // Configurar el motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    document.getElementById('container').appendChild(renderer.domElement);
    // Escena
    scene = new THREE.Scene();
    // Camara 
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    camera.position.set(0, 0, 3);
}

function loadScene() {
    // Forma basica de geometria de biblioteca
    // var geometria = new THREE.IcosahedronGeometry(1, 30);
    //    var geometria = new THREE.IcosahedronGeometry(1, 3);
    var geometria = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 'yellow'
        , wireframe: true
    });
    var forma = new THREE.Mesh(geometria, material);
    forma.matrixAutoUpdate = false;
    var rotacion = new THREE.Matrix4();
    rotacion.makeRotationX(Math.PI / 4);
    var traslacion = new THREE.Matrix4();
    traslacion.makeTranslation(1.0, 0.0, 0.0);
    // Transformaciones
//    forma.position.set(1.0, 0.0, 0.0);
//    forma.rotation.z = Math.PI / 4;
    
    forma.matrix = rotacion.multiply(traslacion);
    scene.add(forma);
    scene.add(new THREE.AxisHelper(1));
}

function render() {
    requestAnimationFrame(render);
    // update();
    renderer.render(scene, camera);
}
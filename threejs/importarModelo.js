/*
Seminario GPC #2. Importar un modelo JSON
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
    renderer.setClearColor(new THREE.Color(0x0000AA));
    document.getElementById('container').appendChild(renderer.domElement);
    // Escena
    scene = new THREE.Scene();
    
    scene.add(new THREE.HemisphereLight)
    
    
    
    // Camara 
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
    camera.position.set(0, 0, 3);
}

function loadScene() {
    // Importar un modelo externo
    var loader = new THREE.ObjectLoader();
    loader.load('models/dragon-threejs/dragon.json', function (objeto) {
        objeto.position.y = -1;
        scene.add(objeto)
    });
    scene.add(new THREE.AxisHelper(1));
}

function render() {
    requestAnimationFrame(render);
    // update();
    renderer.render(scene, camera);
}
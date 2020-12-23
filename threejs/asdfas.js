// Posicionar la camara pa que se vea bien
camera = new THREE.PerspectiveCamera(40, aspectRatio, 1, 2000);
camera.position.set(250, 250, 250);
camera.lookAt(new Three.Vector3(0, 50, 0));

//.....




// La jerarquia debe quedar asi
antebrazo.add(pinzaIzquierda);
antebrazo.add(pinzaDerecha);
brazo.add(antebrazo);
base.add(brazo);
robot.add(base);
scene.add(robot);
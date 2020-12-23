/*
Seminario #1 Introduccion a WebGL.
Dibuja puntos de 10 pixeles conforme
el usuario los puntea con el raton
El color es fijo.
*/

// SHADER DE VERTICES
var VSHADER_SOURCE = jQuery.ajax({
    async: false,
    url: vertex_shader_url,
    dataType: 'xml',
}).responseText;;

// SHADER DE FRAGMENTOS
var FSHADER_SOURCE = jQuery.ajax({
    async: false,
    url: fragment_shader_url,
    dataType: 'xml',
}).responseText;


function main(argument) {
    // Recuperar el area de dibujo
    var canvas = document.getElementById('canvas');
    if (!canvas) {
        console.log("Fallo al recuperar el canvas");
        return;
    }

    // Recuperar el contexto de dibujo webgl
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("Fallo al recuperar el contexto WebGL");
        return;
    }

    // Inicializar los shaders 
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Fallo al Inicializar los shaders");
        return;
    }

    // Fijamos el color de borrado
    gl.clearColor(0.0, 0.0, 0.7, 1.0);
    // Borrar
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Localizar el atributo de posicion 
    var coordenadas = gl.getAttribLocation(gl.program, 'posicion');
    coordenadas_Previas = gl.getAttribLocation(gl.program, 'posicion_Previa');

    // Localizar la variable centro

    var centroShader = gl.getUniformLocation(gl.program, 'centro');
    var maxDistanciaShader = gl.getUniformLocation(gl.program, 'max_Distancia');

    // Asignar el valor correspondiente al centro de coordenadas en los shaders


    gl.uniform3f(centroShader, 0.0, 0.0, 0.0);
    gl.uniform3f(maxDistanciaShader, 1.0, 1.0, 0.0);

    // Instalo una callback al boton del raton

    canvas.onmousedown = function (evento) {
        click(evento, gl, canvas, coordenadas);
    }

}

//var puntos = [0.0, 0.0, 0.0];
var puntos = [];

var vertexVBO;
var colorVBO;

function cargar_Polilinea(gl) {

    // Coordenadas
    //  Se crea un buffer nuevo
    vertexVBO = gl.createBuffer();
    //  Se vincula al programa actual (gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexVBO);
    //  Se le asignan valores al buffer, indicando el tipo de dato
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(puntos), gl.STATIC_DRAW);

    // Colores
    // Este buffer no hace falta; los colores de la polilinea se
    // calculan en el shader de fragmentos
    /*
    colorVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Array(puntos.length).fill(1.0)), gl.STATIC_DRAW);
    */
}

var bufferPuntos;

function cargar_Puntos(gl) {

    //  Se crea un buffer nuevo
    bufferPuntos = gl.createBuffer();
    //  Se vincula al programa actual (gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPuntos);
    //  Se le asignan valores al buffer, indicando el tipo de dato
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(puntos), gl.STATIC_DRAW);

}

function dibujar_Polilinea(gl) {

    var vertexPositionAttribute = gl.getAttribLocation(gl.program, "posicion");
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexVBO);
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, puntos.length / 3);

    //    var vertexColorAttribute = gl.getAttribLocation(gl.program, "vertexColor");
    //    gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
    //    gl.enableVertexAttribArray(vertexColorAttribute);
    //    gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0, 0);

}


function dibujar_Puntos(gl) 
    {

    //    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPuntos);
    var coordenadas = gl.getAttribLocation(gl.program, 'posicion');
    gl.vertexAttribPointer(coordenadas, puntos.length, gl.FLOAT, false, 0, 0);
    //    gl.uniformMatrix4fv(shaderProgram.pMatrixLoc, 0, pMatrix);
    gl.drawArrays(gl.POINTS, 0, puntos.length / 3);
    
}


function click(evento, gl, canvas, coordenadas) {
    // Sistema de referencia del documento
    var x = evento.clientX;
    var y = evento.clientY;

    // Sistema de referencia centrado en el canvas
    var rect = evento.target.getBoundingClientRect();
    x = (x - rect.left) - canvas.width / 2;
    y = canvas.height / 2 - (y - rect.top);

    // Convertir a un cuadrado de 2x2
    x = x * 2 / canvas.width;
    y = y * 2 / canvas.height;

    puntos.push(x);
    puntos.push(y);
    puntos.push(0.0);

    // Color de fondo previamente establecido
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Polilinea
    cargar_Polilinea(gl);
    dibujar_Polilinea(gl);

    // Puntos    
    cargar_Puntos(gl);
    dibujar_Puntos(gl);

}
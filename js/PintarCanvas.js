/*
Seminario #1 Introduccion a WebGL.
Rellena el canvas pintandolo de color azul
*/

function main(argument) {
	// Recuperar el area de dibujo
	var canvas = document.getElementById('canvas');
	if ( !canvas ) {
		console.log("Fallo al recuperar el canvas");
		return;
	}

	// Recuperar el contexto de dibujo webgl
	var gl = getWebGLContext( canvas );
	if( !gl ){
		console.log("Fallo al recuperar el contexto WebGL");
		return;
	}

	// Fijamos el color de borrado
	gl.clearColor( 0.0, 0.0, 0.7, 1.0 );
	// Borrar
	gl.clear( gl.COLOR_BUFFER_BIT );

	


}
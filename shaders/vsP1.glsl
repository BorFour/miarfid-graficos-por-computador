attribute vec3 posicion;
//attribute vec4 posicion_Previa;
attribute vec3 vertexColor;
uniform vec3 centro;
uniform vec3 max_Distancia;
varying highp float intensidad;
varying highp float max_Intensidad;

void main(){														
	// Sistema de referencia por defecto: cuadrado 2x2				
	gl_Position = vec4(posicion, 1.0);											
	gl_PointSize = 10.0;
//    centro = vec3(0.0, 0.0, 0.0);
    max_Intensidad = distance(centro, max_Distancia);
    intensidad = (max_Intensidad - distance(centro, posicion)) / max_Intensidad;
//    intensidad = distancia;
}
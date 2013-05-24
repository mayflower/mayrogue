precision highp float;

uniform mat4 u_projMatrix, u_viewMatrix;
attribute vec2 a_position;
attribute vec2 a_textureCoords;
varying vec2 v_textureCoords;

void main() {
  gl_Position = u_projMatrix * vec4(a_position, 0, 1);
  v_textureCoords = a_textureCoords;
  gl_PointSize = 5.0;
}
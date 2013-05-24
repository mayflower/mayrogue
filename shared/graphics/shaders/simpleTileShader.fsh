precision highp float;

uniform sampler2D u_texture;

varying vec2 v_textureCoords;

void main() {
  vec4 col = texture2D(u_texture, v_textureCoords);
  gl_FragColor = col;
  //gl_FragColor = vec4(1.0,1.0,0,1.0);//vec4(v_textureCoords.x,v_textureCoords.y, 1.0, 1.0); //texture2D(u_texture, v_textureCoords);
}
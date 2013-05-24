// vim:softtabstop=4:shiftwidth=4

define(
    [
        'underscore',
        'util',
        'graphics/webGLHelper',
        'graphics/gl-matrix',
        'text!graphics/shaders/simpleTileShader.fsh',
        'text!graphics/shaders/simpleTileShader.vsh'
    ],
    function(_, Util, WebGLHelper, GLMatrix, fragmentShaderSource, vertexShaderSource)
    {
        "use strict";

        var MapView = Util.extend(Util.Base, {
            properties: [
                {field: '_world', getter: true},
                {field: '_tiles', getter: true},
                {field: '_canvas', getter: true}
            ],

            _context: null,

            create: function(config) {
                var me = this;
                Util.Base.prototype.create.apply(me, arguments);

                me.getConfig(config,
                    ['world', 'tiles', 'canvas']);

                me._world.attachListeners({visibleChange: me.redraw}, me);

                me._canvas.width = me._tiles.width * me._world.getViewport().getWidth();
                me._canvas.height = me._tiles.height * me._world.getViewport().getHeight();


                me._context = WebGLHelper.initWebGL(me._canvas);
                //me._context.fillStyle = config.textColor || '#FFFFFF';
                me._context.clearColor(0.5, 0.5, 0.5, 1.0);

                me._context.disable(me._context.DEPTH_TEST);
                me._context.blendFunc(me._context.SRC_ALPHA, me._context.ONE_MINUS_SRC_ALPHA);
                me._context.enable(me._context.BLEND);

                //create default projection matrix
                this._projectionMatrix = GLMatrix.mat4.create();

                //set default projection matrix to ortho view with viewport bounds = canvas bounds
                GLMatrix.mat4.ortho(this._projectionMatrix, 0, me._canvas.width, me._canvas.height, 0, 0.0001, 10000);

                //create shaders
                var vertexShader = WebGLHelper.compileShader(me._context, vertexShaderSource, me._context.VERTEX_SHADER);
                var fragmentShader = WebGLHelper.compileShader(me._context, fragmentShaderSource, me._context.FRAGMENT_SHADER);
                me._shaderProgram = WebGLHelper.createProgram(me._context, vertexShader, fragmentShader);

                me._shaderProgram.u_projMatrix = me._context.getUniformLocation(me._shaderProgram, "u_projMatrix");
                me._shaderProgram.u_viewMatrix = me._context.getUniformLocation(me._shaderProgram, "u_viewMatrix");
                me._shaderProgram.a_position = me._context.getAttribLocation(me._shaderProgram, "a_position");
                me._shaderProgram.a_textureCoords = me._context.getAttribLocation(me._shaderProgram, "a_textureCoords");
                me._shaderProgram.u_texture = me._context.getUniformLocation(me._shaderProgram, "u_texture");

                console.log(me._shaderProgram);
                me._vertexBuffer = me._context.createBuffer();

                me.redraw();
            },

            destroy: function() {
                var me = this;

                me._world.detachListeners({visibleChange: me.redraw}, me);
            },

            createVertexData: function(coords, texCoords) {

                var startX = coords.x * coords.w;
                var startY = coords.y * coords.h;
                var endX = startX + coords.w;
                var endY = startY + coords.h;

                var texLeft = texCoords.x;
                var texRight = texCoords.x + texCoords.w;
                var texTop = texCoords.y;
                var texBottom = texCoords.y + texCoords.h;

                //first the positions in points
                return [
                    startX,
                    startY,     //vertex 1
                    texLeft,
                    texTop,


                    endX,
                    startY,       //vertex 2
                    texRight,
                    texTop,


                    startX,
                    endY,      //vertex 3
                    texLeft,
                    texBottom,

                    startX,
                    endY,       //vertex 4
                    texLeft,
                    texBottom,

                    endX,
                    startY,       //vertex 5
                    texRight,
                    texTop,


                    endX,
                    endY,        //vertex 6
                    texRight,
                    texBottom
                ];


            },

            redraw: function () {
                var me = this;
                me._context.clear(me._context.COLOR_BUFFER_BIT);

                //prepare gl
                me._context.useProgram(me._shaderProgram);
                me._context.uniformMatrix4fv(me._shaderProgram.u_projMatrix, false, me._projectionMatrix);

                //prepare buffers

                var dataBuffer = [];

                var x, y;
                var mapData = me._world.getMapData();
                var viewport = me._world.getViewport();
                var x0 = viewport.getX(), y0 = viewport.getY();
                var currentTileSet = null;

                for (x = x0; x < x0 + viewport.getWidth(); x++) {

                    for (y = y0; y < y0 + viewport.getHeight(); y++) {
                        var tileId = mapData[x][y];
                        var newTileSet = me._tiles.getTileSheet(tileId);

                        if (currentTileSet != newTileSet && currentTileSet !== null) {
                            me.renderData(dataBuffer, currentTileSet);
                            dataBuffer = [];

                        }
                        currentTileSet = newTileSet;

                        if (currentTileSet !== null) {
                            var texCoords = currentTileSet.getTextureCoords(tileId);
                            var coords = {
                                x: x-x0,
                                y: y-y0,
                                w: currentTileSet._tileWidth,
                                h: currentTileSet._tileHeight
                            }
                            //prepare to render
                            dataBuffer.push(me.createVertexData(coords, texCoords));
                        }
                    }
                }

                _.each(me._world.getEntities(), function(entity) {

                    var tileId = entity.getShape();
                    var newTileSet = me._tiles.getTileSheet(tileId);

                    if (currentTileSet != newTileSet && currentTileSet !== null) {
                        me.renderData(dataBuffer, currentTileSet);
                        dataBuffer = [];

                    }
                    currentTileSet = newTileSet;

                    if (currentTileSet !== null) {
                        var texCoords = currentTileSet.getTextureCoords(tileId, entity);

                        var coords = {
                            x: entity.getX() - x0,
                            y: entity.getY() - y0,
                            w: currentTileSet._tileWidth,
                            h: currentTileSet._tileHeight
                        }
                        //prepare to render
                        dataBuffer.push(me.createVertexData(coords, texCoords));
                    }
                });

                //render the rest
                if (currentTileSet != null && dataBuffer.length > 0) {
                    me.renderData(dataBuffer, currentTileSet);
                }

            },

            renderData: function(dataBuffer, tileSet) {
                var me = this;

                me.bindTexture(me._context, tileSet._image);
                dataBuffer = _.flatten(dataBuffer);

                me._context.bindBuffer(me._context.ARRAY_BUFFER, me._vertexBuffer);

                me._context.bufferData(
                    me._context.ARRAY_BUFFER,
                    new Float32Array(dataBuffer),
                    me._context.STATIC_DRAW
                );

                me._context.enableVertexAttribArray(me._shaderProgram.a_position);
                me._context.vertexAttribPointer(me._shaderProgram.a_position, 2, me._context.FLOAT, false, 4 * 4, 0); /*GLFLOAT has 4 byte */
                me._context.enableVertexAttribArray(me._shaderProgram.a_textureCoords);
                me._context.vertexAttribPointer(me._shaderProgram.a_textureCoords, 2,  me._context.FLOAT, false, 4 * 4, 2 * 4); /*GLFLOAT has 4 byte */


                //and render...
                //this.bindTexture(gl, mapInfo.resolveTileSet(tileSwitch.tileId));
                me._context.drawArrays(me._context.TRIANGLES, 0, dataBuffer.length / 4);

            },

            bindTexture: function(gl, image) {
                var me = this;
                if (me._boundTextures === undefined ) {
                    me._boundTextures = {};
                }
                if (me._boundTextures[image.src] === undefined) {
                    me._boundTextures[image.src] = gl.createTexture();
                    console.log("Creating tex for "+image.src);
                    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

                    gl.bindTexture(gl.TEXTURE_2D, me._boundTextures[image.src]);

                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

                    gl.generateMipmap(gl.TEXTURE_2D);

                    gl.bindTexture(gl.TEXTURE_2D, null);
                }

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, me._boundTextures[image.src]);
                gl.uniform1i(me._shaderProgram.u_texture, 0);
            }
        });

    return MapView;
});

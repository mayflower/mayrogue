

define([], function () {

    "use strict";
    var WebGLHelper = {

        /**
         * Creates and compiles a shader.
         *
         * @param {!WebGLRenderingContext} gl The WebGL Context.
         * @param {string} shaderSource The GLSL source code for the shader.
         * @param {number} shaderType The type of shader, VERTEX_SHADER or
         *     FRAGMENT_SHADER.
         * @return {!WebGLShader} The shader.
         */
        compileShader: function (gl, shaderSource, shaderType) {
            // Create the shader object
            var shader = gl.createShader(shaderType),
                success;

            // Set the shader source code.
            gl.shaderSource(shader, shaderSource);

            // Compile the shader
            gl.compileShader(shader);

            // Check if it compiled
            success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!success) {
                // Something went wrong during compilation; get the error
                throw "could not compile shader:" + gl.getShaderInfoLog(shader);
            }

            return shader;
        },


        /**
         * Creates a program from 2 shaders.
         *
         * @param {!WebGLRenderingContext) gl The WebGL context.
         * @param {!WebGLShader} vertexShader A vertex shader.
         * @param {!WebGLShader} fragmentShader A fragment shader.
         * @return {!WebGLProgram} A program.
         */
        createProgram: function (gl, vertexShader, fragmentShader) {
            // create a program.
            var program = gl.createProgram(),
                success;

            // attach the shaders.
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            // link the program.
            gl.linkProgram(program);

            // Check if it linked.
            success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!success) {
                // something went wrong with the link
                throw ("program failed to link:" + gl.getProgramInfoLog(program));
            }

            return program;
        },


        /**
         * Creates a shader from the content of a script tag.
         *
         * @param {!WebGLRenderingContext} gl The WebGL Context.
         * @param {string} scriptId The id of the script tag.
         * @param {string} opt_shaderType. The type of shader to create.
         *     If not passed in will use the type attribute from the
         *     script tag.
         * @return {!WebGLShader} A shader.
         */
        createShaderFromScript: function (gl, scriptId, opt_shaderType) {
            // look up the script tag by id.
            var shaderScript = document.getElementById(scriptId),
                shaderSource;
            if (!shaderScript) {
                throw new Error("*** Error: unknown script element" + scriptId);
            }

            // extract the contents of the script tag.
            shaderSource = shaderScript.text;

            // If we didn't pass in a type, use the 'type' from
            // the script tag.
            if (!opt_shaderType) {
                if (shaderScript.type === "x-shader/x-vertex") {
                    opt_shaderType = gl.VERTEX_SHADER;
                } else if (shaderScript.type === "x-shader/x-fragment") {
                    opt_shaderType = gl.FRAGMENT_SHADER;
                } else if (!opt_shaderType) {
                    throw new Error("*** Error: shader type not set");
                }
            }

            return gl.compileShader(gl, shaderSource, opt_shaderType);
        },

        /**
         * Creates a program from 2 script tags.
         *
         * @param {!WebGLRenderingContext} gl The WebGL Context.
         * @param {string} vertexShaderId The id of the vertex shader script tag.
         * @param {string} fragmentShaderId The id of the fragment shader script tag.
         * @return {!WebGLProgram} A program
         */
        createProgramFromScriptTags: function (gl, vertexShaderId, fragmentShaderId) {
            var vertexShader = WebGLUtils.createShaderFromScriptTag(vertexShaderId),
                fragmentShader = WebGLUtils.createShaderFromScriptTag(fragmentShaderId);
            return WebGLUtils.createProgram(gl, vertexShader, fragmentShader);
        },


        initWebGL: function (canvas) {
            // Initialize the global variable gl to null.
            var gl = null;

            try {
                // Try to grab the standard context. If it fails, fallback to experimental.
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            } catch (e) {}

            // If we don't have a GL context, give up now
            if (!gl) {
                alert("Unable to initialize WebGL. Your browser may not support it.");
            }

            return gl;
        }

    };

    return WebGLHelper;
});
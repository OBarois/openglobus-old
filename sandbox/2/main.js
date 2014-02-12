goog.require('og');
goog.require('og.webgl.Handler');
goog.require('og.Renderer');
goog.require('og.control.KeyboardNavigation');
goog.require('og.shaderProgram');
goog.require('og.node.Axes');
goog.require('my.Cubes');
goog.require('og.math.Vector3');

function start() {

    og.webgl.MAX_FRAME_DELAY = 15;

    var flatShader = new og.shaderProgram.ShaderProgram("flat", {
        uniforms: {
            uPMVMatrix: { type: og.shaderProgram.types.MAT4 }
        },
        attributes: {
            aVertexPosition: { type: og.shaderProgram.types.VEC3, enableArray: true },
            aVertexColor: { type: og.shaderProgram.types.VEC4, enableArray: true }
        },
        vertexShader: og.utils.readTextFile(og.shaderProgram.SHADERS_URL + "flat_vs.txt"),
        fragmentShader: og.utils.readTextFile(og.shaderProgram.SHADERS_URL + "flat_fs.txt")
    });

    var colorShader = new og.shaderProgram.ShaderProgram("colorShader", {
        uniforms: {
            uPMVMatrix: { type: og.shaderProgram.types.MAT4 },
            uSampler: { type: og.shaderProgram.types.SAMPLER2D },
            uColor: { type: og.shaderProgram.types.VEC4 }
        },
        attributes: {
            aVertexPosition: { type: og.shaderProgram.types.VEC3, enableArray: true }
        },
        vertexShader: "attribute vec3 aVertexPosition; \
                    uniform mat4 uPMVMatrix; \
                    void main(void) { \
                        gl_Position = uPMVMatrix * vec4(aVertexPosition, 1.0); \
                    }",
        fragmentShader: "precision mediump float; \
                    uniform vec4 uColor; \
                    void main(void) { \
                        gl_FragColor = uColor; \
                    }"
    });

    context = new og.webgl.Handler("canvas");
    context.addShaderProgram(flatShader);
    context.addShaderProgram(colorShader);
    context.init();

    renderer = new og.Renderer(context);
    renderer.init();

    var axes = new og.node.Axes(10000);

    renderer.addRenderNode(new my.Cubes("Cubes", 500));
    renderer.addRenderNode(axes);

    renderer.addControls([
        new og.control.KeyboardNavigation({ autoActivate: true }),
    ]);

    renderer.Start();
};
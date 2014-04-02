goog.provide('og.Globus');

goog.require('og.webgl.Handler');
goog.require('og.Renderer');
goog.require('og.node.Planet');
goog.require('og.ellipsoid.wgs84');

/**
 * var globe = new og.Globus({
 *   viewExtent: new og.Extent(new og.LonLat(-180,-90), new og.LonLat(180,90)),
 *   ellipsoid: og.ellipsoid.wgs84,
 *   layers: [
 *     new og.layers.XYZ()
 *   ],
 *   terrains: [
 *     new og.terrain
 *   ],
 *   controls: [
 *     new og.controls.LayerSwitcher({autoActivated:true})
 *   ],
 *   name: "Earth",
 *   target: 'globus'
 */

og.Globus = function (options) {

    //Canvas creation.
    var _canvasId = og.Globus.CANVAS_ID_PREFIX + og.Globus.__id;
    var _canvas = document.createElement("canvas");
    _canvas.id = _canvasId;
    _canvas.style.width = "100%";
    _canvas.style.height = "100%";
    _canvas.style.display = "block";

    /**
     * @public
     * @type {Element}
     */
    this.div = document.getElementById(options.target);
    this.div.appendChild(_canvas);
    function _disableWheel() { return false; };
    function _enableWheel() { return true; };
    this.div.onmouseenter = function () { document.onmousewheel = _disableWheel };
    this.div.onmouseleave = function () { document.onmousewheel = _enableWheel };

    //WegGL handler creation
    var _handler = new og.webgl.Handler(_canvasId);
    _handler.init();

    /**
     * @public
     * @type {Element}
     */
    this.renderer = new og.Renderer(_handler);
    this.renderer.init();

    //Skybox
    if (options.skybox) {
        this.renderer.addRenderNode(options.skybox);
    }

    /**
     * Planet node name. Access by this.renderer.<name>
     * @private
     * @type {String}
     */
    this._planetName = options.name ? options.name : og.Globus.PLANET_NAME_PREFIX + og.Globus.__id;

    /**
     * Planet node
     * @public
     * @type {Object}
     */
    this.planet = new og.node.Planet(this._planetName, options.ellipsoid ? options.ellipsoid : og.ellipsoid.wgs84);
    if (options.layers) {
        this.planet.addLayers(options.layers);
    }
    this.renderer.addRenderNode(this.planet);

    //Attach terrain provider
    if (options.terrain) {
        this.planet.setTerrainProvider(options.terrain);
    }

    //Add controls
    if (options.controls) {
        this.renderer.addControls(options.controls)
    }

    og.Globus.__id++;

    if (options.viewExtent) {
        this.planet.viewToExtent(options.viewExtent);
    }

    //Run!
    if (isUndefined(options.autoActivate) || options.autoActivate)
        this.renderer.start();
};

/**
 * og.Globus static variables
 *
 */
og.Globus.__id = 1;
og.Globus.CANVAS_ID_PREFIX = "globus_viewport_";
og.Globus.PLANET_NAME_PREFIX = "globus_planet_";

function isUndefined(obj) {
    return obj === void 0;
};
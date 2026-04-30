/**
 * Contains methods to work with colors.
 */
class Color {
    /** Color object. Define `r` channel only to greyscale the color.
     * @param {*} r Red   color channel `0...255`.
     * @param {*} g Green color channel `0...255`.
     * @param {*} b Blue  color channel `0...255`.
     * @param {*} a Alpha color channel `0...255`.
     */
    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;

        if (r === undefined) {
            this.r = 0;
        }
        if (g === undefined) {
            this.g = this.r;
        }
        if (b === undefined) {
            this.b = this.r;
        }
        if (a === undefined) {
            this.a = 255;
        }
    }
    /**
     * Returns a new `Color` object from a hex color string.
     * 
     *  You can use any of these variations: `#RRGGBB`, `#RRGGBBAA`, `#RGB`, `#RGBA`.
     * 
     * @param {*} hex a HEX color reference.
     */
    static fromHEX(hex) {
        if (hex[0] == "#") {
            hex = hex.substr(1); // remove #
        }

        var r, g, b, a;

        if (hex.length == 3) {
            r = parseInt(`${hex[0]}${hex[0]}`, 16);
            g = parseInt(`${hex[1]}${hex[1]}`, 16);
            b = parseInt(`${hex[2]}${hex[2]}`, 16);
        }

        if (hex.length == 4) {
            r = parseInt(`${hex[0]}${hex[0]}`, 16);
            g = parseInt(`${hex[1]}${hex[1]}`, 16);
            b = parseInt(`${hex[2]}${hex[2]}`, 16);
            a = parseInt(`${hex[3]}${hex[3]}`, 16);
        }

        if (hex.length >= 6) {
            r = parseInt(`${hex[0]}${hex[1]}`, 16);
            g = parseInt(`${hex[2]}${hex[3]}`, 16);
            b = parseInt(`${hex[4]}${hex[5]}`, 16);
        }

        if (hex.length == 8) {
            a = parseInt(`${hex[6]}${hex[7]}`, 16);
        }

        return new Color(r, g, b, a);
    }
    toGreyscale() {
        return new Color(Math.floor((this.r + this.g + this.b) / 3));
    }
    toHEX() {
        var r = this.r.toString(16).padStart(2, "0");
        var g = this.g.toString(16).padStart(2, "0");
        var b = this.b.toString(16).padStart(2, "0");

        return `#${r}${g}${b}`;
    }
}
/**
 * Extension class to work with colors.
 */
class ColorHelper {
    /**
     * Returns a new `Color` object by a hue `value` specified.
     * 
     * @param {*} value hue angle in degrees.
     */
    static byAngle(value) { // 0...360...720...etc. -> 0...255

        // loop angle in between `0...360`
        value -= 360 * Math.floor(value / 360);

        // color definitions
        var r, g, b;

        /**
         * Returns a color channel byte in between `255...0`
         * by a start angle `offset` specified.
         */
        function decreaseFrom(offset) {
            return Math.floor(255 * (1 - ((value - offset) / 60)))
        }
        /**
         * Returns a color channel byte in between `0...255`
         * by a start angle `offset` specified.
         */
        function increaseFrom(offset) {
            return Math.floor(255 * ((value - offset) / 60));
        }

        // check each 60deg interval on a hue circle
        if (value <= 60) {
            r = 255;
            // 0...60 -> 0...60x (60x = 255; x = 255/60 = 4.25)
            g = increaseFrom(0);
            b = 0;
        }
        else if (value > 60 && value < 120) {
            // 60...120 -> 0...60 -> 0...1 -> 1...0 -> 255...0
            r = decreaseFrom(60);
            g = 255;
            b = 0;
        }
        else if (value >= 120 && value < 180) {
            r = 0;
            g = 255;
            // 120...180 -> 0...60 -> 0...1 -> 0...255
            b = increaseFrom(120);
        }
        else if (value >= 180 && value < 240) {
            r = 0;
            // 180...240 -> 0...60 -> 0...1 -> 1...0 -> 255...0
            g = decreaseFrom(180);
            b = 255;
        }
        else if (value >= 240 && value < 300) {
            // 240...300 -> 0...60 -> 0...1 -> 0...255
            r = increaseFrom(240);
            g = 0;
            b = 255;
        }
        else if (value >= 300) {
            r = 255;
            g = 0;
            // 300...360 -> 0...60 -> 0...1 -> 1...0 -> 255...0
            b = decreaseFrom(300);
        }

        return new Color(r, g, b);
    }
}
class Converter {
    /**
     * Converts string to a [utf-8] HEX string.
     * @param {*} ref a string reference.
     * @returns a [utf-8] HEX string.
     */
    static toHEX(ref) {
        return ref.split("")
            .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("");
    }
}
/**
 * Contains file types for `Tools.readFile(path, type)`.
 */
class FileType {
    static get Text() {
        return 0;
    }
    static get Bytes() {
        return 1;
    }
    static get Json() {
        return 2;
    }
}
/**
 * Scene class to work with HTML scenes.
 */
class Scene {
    /**
     * @param {*} root  A reference to a scene root container as `HTMLElement`.
     *                  It will be used as a container to work with scene content.
     */
    constructor(root) {
        if (!root) {
            throw new Error("You have to specify a <root> for a scene, the instance won't work properly otherwise.");
        }

        root.setAttribute("style", `/* modified by whale-lib */
            box-sizing: border-box;
            display: block;

            width: 100%;
            height: 100%;

            flex-grow: 1;

            padding: 0;
            margin: 0;
        `);

        this.root = root;

        Scene.#SCENE_CACHE.push(this);
    }

    /**
     * Cache of all loaded scenes during application job.
     * Used to get scenes by their ids.
     */
    static #SCENE_CACHE = [];

    /**
     * Returns the scene by `id` specified.
     * `null` if the scene doesn't exist.
     */
    static get(id) {
        for (var i = 0; i < Scene.#SCENE_CACHE.length; i++) {
            if (Scene.#SCENE_CACHE[i].getId() == id) {
                return Scene.#SCENE_CACHE[i];
            }
        }
    }

    /**
     * Returns current scene identifier.
     */
    getId() {
        return this.root.id;
    }

    /**
     * `true` whenever the scene is empty.
     */
    isEmpty() {
        return this.root.innerHTML == "";
    }

    /**
     * `true` whenever the scene is collapsed.
     */
    isCollapsed() {
        return this.root.style.visibility == "collapse";
    }

    /**
     * Collapses (hides) current scene. 
     * Pauses `update()` method execution.
     */
    collapse() {
        this.root.style.visibility = "collapse";
    }

    /**
     * Shows current scene if was collapsed previously. 
     * Resumes `update()` method execution.
     */
    show() {
        this.root.style.visibility = "unset";
    }

    /**
     * Loads scene content by `scenePath` specified.
     * @param {*} scenePath path to scene directory.
     * 
     * @returns Current scene instance if the root is not `null`.
     */
    load(scenePath) {
        // remove "/" as a last char if exists
        if (scenePath.endsWith("/")) {
            scenePath = scenePath.substring(0, scenePath.length - 1);
        }

        // load html
        fetch(`${scenePath}/layout.html`).then(res => {
            if (!res.ok) return this;
            
            res.text().then(content => {
                this.root.innerHTML = content;

                // execute javascript
                fetch(`${scenePath}/main.js`).then(res => {
                    if (!res.ok) return this;

                    res.text().then(code => {
                        eval(code);
                    }).catch(e => {
                        console.error(e);
                    });
                });
            });
        });

        return this;
    }

    /**
     * Clears the scene. Doesn't affect evaluating javascript code, 
     * so it have to be stopped from the inside.
     * 
     * @returns Current scene instance.
     */
    clear() {
        this.root.innerHTML = "";
        return this;
    }
    
    /**
     * General update loop. Breaks after scene is being cleared (i.e. has an empty body).
     * @param {*} _void a function to be looped.
     * 
     * @returns Current scene instance.
     */
    update(_void) {
        if (!this.root) return this;

        if (!this.isEmpty()) {
            // skip loop content while scene is loaded, but collapsed
            if (!this.isCollapsed()) {
                _void();
            }
            setTimeout(() => { this.update(_void) }, 1);
        }

        return this;
    }
}
/**
 * Contains QoL to improve development process.
 */
class Tools {
    /**
     * Applies several styles to a <body> tag.
     */
    static useCleanBody() {
        document.body.setAttribute("style", `/* modified by whale-lib */
            padding: 0;
            margin: 0;
            
            width: 100vw;
            height: 100vh;

            overflow: hidden;
        `);
    }
    /**
     * Asynchronically evaluates javascript by path specified.
     * @param {*} path path to `.js` file to evaluate.
     */
    static eval(path) {
        fetch(path).then(res => {
            if (!res.ok) {
                return;
            }

            res.text().then(code => {
                eval(code);
            });
        });
    }

    /**
     * Reads file returning file content of specified type.
     * @param {*} path path to file.
     * @param {*} type File type. Use `FileType` class to resolve this.
     * @returns File content based on type specified.
     */
    static async readFile(path, type) {
        var data;

        const file = await fetch(path);

        if (type == FileType.Text) {
            data = await file.text();
        }

        if (type == FileType.Bytes) {
            data = await file.bytes();
        }

        if (type == FileType.Json) {
            data = await file.json();
        }

        return data;
    }
}
/**
 * Manages `Mesh` objects.
 */
class MeshManager {
    /**
     * Returns a new `Mesh` object by `wavefrontData` specified.
     * @param {*} wavefrontData Raw wavefront `.obj` data as string.
     */
    static createMesh(wavefrontData) {
        const vertices  = []; // vertices array
        const edges     = []; // edges array

        const fileLines = wavefrontData.split("\n");

        for (let fileLine of fileLines) {
            // if line is vertex data
            if (fileLine.startsWith("v ")) {
                const coords = fileLine.replace("v ", "").split(" "); // parse vertex coords
                const vertex  = new Vector3(
                    parseFloat(coords[0]), parseFloat(coords[1]), 1 - parseFloat(coords[2])
                );
                vertices.push(vertex);
            }
            if (fileLine.startsWith("l ")) {
                const indexes = fileLine.replace("l ", "").split(" "); // parse edges indexes
                const edge = new Edge(
                    parseInt(indexes[0]) - 1, parseInt(indexes[1]) - 1
                );
                edges.push(edge);
            }
        }

        return new Mesh(vertices, edges);
    }
}
/**
 * Works with 3D graphics using wavefront objects as a reference.
 * 
 * If you use Blender as editing software 
 * make sure exported `.obj` files have [line elements](https://en.wikipedia.org/wiki/Wavefront_.obj_file#Line_elements).
 * To let Blender properly export your mesh data use `Delete -> 'Only Faces'` in `Edit Mode`.
 * 
 * `ViewportManager` is performant 3D engine, so all of decisions is built following this construct. 
 * There is no animation support or texture draw calls. This engine works with wireframe graphics only,
 * using vanilla [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) methods.
 */
class ViewportManager {
    constructor(viewport) {
        this.ctx = viewport.getContext("2d");
        this.rect = new Rect(
            viewport.offsetWidth, 
            viewport.offsetHeight
        );

        viewport.setAttribute("width",   viewport.offsetWidth);
        viewport.setAttribute("height", viewport.offsetHeight);
    }

    /**
     * Fills canvas with a color specified.
     * @param {*} color preferred canvas color.
     */
    #fillRect(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.rect.w, this.rect.h);
    }

    /**
     * Draws a dot in specified position.
     * @param {*} color preferred dot color.
     * @param {*} position position vector as `Vector2`.
     */
    #drawDot(color, position) {
        const scl = 3; // 3
        this.ctx.fillStyle = color;
        this.ctx.fillRect(position.x - .5 * scl, position.y - .5 * scl, scl, scl);
    }

    /**
     * Draws a line from `beginVector` to `targetVector`.
     * @param {*} color line color.
     * @param {*} beginVector start coords as `Vector2`.
     * @param {*} targetVector destination coords as `Vector2`.
     */
    #drawLine(color, beginVector, targetVector) {
        this.ctx.lineWidth = 3; // 3
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(beginVector.x, beginVector.y);
        this.ctx.lineTo(targetVector.x, targetVector.y);
        this.ctx.stroke();
    }

    /**
     * Maps default `-1..1` wavefront coords to canvas related `0..w`.
     * @param {*} vector a `Vector2` to be mapped.
     * @returns New `Vector2` object.
     */
    #map(vector) {
        return new Vector2(
            ((vector.x + 1) / 2) * this.rect.w,
            (1 - (vector.y + 1) / 2) * this.rect.h
        );
    }

    /**
     * Draws an object with specified flags.
     * @param {*} mesh `Mesh` object. Use `MeshManager.createMesh()`.
     * @param {*} color `Color` object.
     * @param {*} rotation Object rotation vector as `Vector3`.
     * @param {*} position Object position as `Vector2` [centered at (0, 0) by default].
     */
    drawObject(mesh, color, rotation = new Vector3(), position = new Vector2()) {
        const vertices  = mesh.vertices;
        const edges     = mesh.edges;
        const points    = [];
        
        this.ctx.clearRect(0, 0, this.rect.w, this.rect.h); // clears the screen

        for (const vector3 of vertices) {
            var vector2 = vector3.toRotation(rotation).toVector2();     // point projection in local coords
            var point   = this.#map(vector2).add(position);   // point projection in canvas coords

            points.push(point); // add point to a list
        }

        for (let i = 0; i < points.length; i++) {
            // draw a vertex (im not sure if it's needed, maybe not.)
            this.#drawDot(color.toHEX(), points[i]);
        }

        for (let j = 0; j < edges.length; j++) {
            const beginVector   = points[ edges[j].begin ];
            const targetVector  = points[ edges[j].end   ];
            this.#drawLine(color.toHEX(), beginVector, targetVector);
        }
    }
}
/**
 * Useful methods in addiction to the `Math` class.
 */
class MathHelper {
    /**
     * Converts radians angle to a degrees one.
     * @param {*} rad angle value.
     * @returns angle in degrees.
     */
    static toDegrees(rad) {
        return (180 / this.PI) * rad;
    }
    /**
     * Converts degrees angle to a radians one.
     * @param {*} deg angle value.
     * @returns angle in radians.
     */
    static toRadians(deg) {
        return (this.PI / 180) * deg;
    }
}
class Edge {
    /**
     * 
     * @param {*} begin Start index of a vertex 
     * pointing to the verticies array instance of the `Mesh` object.
     * @param {*} end End index of a vertex 
     * pointing to the verticies array instance of the `Mesh` object.
     */
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }
}
class Mesh {
    /**
     * 
     * @param {*} vertices Array of verticies as `Vector3[]`.
     * @param {*} edges Array of edges as `Edge[]`.
     */
    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }
}
class Rect {
    /**
     * @param {*} w Rectangle's width.
     * @param {*} h Rectangle's height.
     */
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
}
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Equals to `new Vector2(0, 0)`.
     */
    static get Zero() {
        return new Vector2(0, 0);
    }

    /**
     * Returns the vector's length.
     */
    getLength() {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    /**
     * Adds `offsetVector` to the current vector.
     * @param {*} offsetVector reference `Vector2`.
     * @returns New `Vector2`.
     */
    add(offsetVector) {
        return new Vector2(
            this.x + offsetVector.x,
            this.y + offsetVector.y
        );
    }
}
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Rotates the vector by a specified angle around Y.
     * @param {*} angle angle in radians.
     * @returns a new rotated `Vector3` object.
     */
    #rotateXZ(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector3(
            (this.x * cos - this.z * sin) + sin,
            this.y,
            (this.x * sin + this.z * cos) + (1 - cos),
        );
    }

    /**
     * Rotates the vector by a specified angle around Z.
     * @param {*} angle angle in radians.
     * @returns a new rotated `Vector3` object.
     */
    #rotateXY(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector3(
            (this.x * cos - this.y * sin),
            (this.x * sin + this.y * cos),
            this.z
        );
    }

    /**
     * Rotates the vector by a specified angle around X.
     * @param {*} angle angle in radians.
     * @returns a new rotated `Vector3` object.
     */
    #rotateYZ(angle) { // : Vertex
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return new Vector3(
            this.x,
            (this.z * sin + this.y * cos) - sin,
            (this.z * cos - this.y * sin) + (1 - cos)
        );
    }

    /**
     * Equals to `new Vector3(0, 0, 0)`.
     */
    static get Zero() {
        return new Vector3(0, 0, 0);
    }

    /**
     * Returns the vector's length.
     */
    getLength() {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)));
    }

    /**
     * Converts the vector into a `Vector2` by projecting it to a 2D space.
     * @returns a new `Vector2` object.
     */
    toVector2() {
        return new Vector2(
            this.x / this.z,
            this.y / this.z
        );
    }

    /**
     * Rotates the vector around a rotation vector specified.
     * @param {*} rotation a rotation vector as `Vector3`.
     * @returns a new rotated `Vector3`.
     */
    toRotation(rotation) {
        return this.#rotateYZ(rotation.x).#rotateXZ(rotation.y).#rotateXY(rotation.z);
    }

    /**
     * Adds `offsetVector` to the current vector.
     * @param {*} offsetVector reference `Vector3`.
     * @returns a new `Vector3`.
     */
    add(offsetVector) {
        return new Vector3(
            this.x + offsetVector.x,
            this.y + offsetVector.y,
            this.z + offsetVector.z
        );
    }
}
/**
 * Class to work with `HTMLElement` animations. 
 * Before loading any animation, you need to create one in your `.css` file,
 * so you can invoke it by name, using the `load()` method.
 * 
 * If you plan to write animations for `ViewportManager`, you need to use it's internal tools.
 * 
 * This class is for `HTMLElement` instances only.
 */
class AnimationManager {
    /**
     * Contains values for `css:animation-timing-function`.
     */
    static TimingFunction = {
        Linear:     "linear",
        EaseInOut:  "ease-in-out",
        EaseIn:     "ease-in",
        EaseOut:    "ease-out",
        cubicBezier(x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
            return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
        }
    }
    /**
     * Contains values for `css:animation-iteration-count`.
     */
    static IterationCount = {
        Infinite: "infinite"
    }
    /**
     * Contains values for `css:animation-fill-mode`.
     */
    static FillMode = {
        Forwards:   "forwards",
        Backwards:  "backwards"
    }
    /**
     * Contains values for `css:animation-direction`.
     */
    static Direction = {
        Normal:     "normal",
        Reverse:    "reverse",
        Alternate:  "alternate"
    }
    /**
     * Invokes the animation on the `element` by properties specified. Replaces existing animation.
     * @param {*} element           `HTMLElement` reference.
     * 
     * @param {*} name              Animation name.
     * @param {*} duration          Animation duration in `ms`.
     * @param {*} timingFunction    Animation timing function. Use `TimingFunction` field for this.
     * @param {*} iterationCount    Animation interation count. 
     *                              Put a number or use `IterationCount` field to get misc values.
     * @param {*} fillMode          Animation fill mode. Use `FillMode` field for values.
     * 
     * @param {*} direction         Animation direction. Use `Direction` field for values.
     * 
     */
    static load(element, { 
        name            = "", 
        duration        = 220, 
        timingFunction  = this.TimingFunction.EaseInOut, 
        iterationCount  = 1, 
        fillMode        = this.FillMode.Forwards, 
        direction       = this.Direction.Normal
    })
    {
        element.style.animation = "";
        element.offsetWidth;
        element.style.animation = `${name} ${duration}ms ${timingFunction} ${iterationCount} ${fillMode} ${direction}`;
    }
}

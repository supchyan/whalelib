/**
 * Contains file types for `Tools.readFile(path, type)`.
 */
class FileType {
    static text() {
        return 0;
    }
    static bytes() {
        return 1;
    }
    static json() {
        return 2;
    }
}
/**
 * Contains methods to work with scenes.
 * 
 * To load scene call `Scene.load("path/to/scene_folder")`;
 * 
 * To unload scene call `Scene.unload()`.
 */
class SceneStorage {
    /**
     * @param {*} parent `HTMLElement` reference. Use something like `document.getElementById()`. 
    *                    It will be used as a container to load/unload scene content.
     */
    constructor(parent) {
        parent.setAttribute("style", `/* modified by whale-lib */
            box-sizing: border-box;
            display: block;

            width: 100%;
            height: 100%;

            flex-grow: 1;

            padding: 0;
            margin: 0;
        `);

        this._parent = parent;
    }

    /**
     * `true` whenever `SceneStorage` is empty.
     */
    isEmpty() {
        return this._parent.innerHTML == "";
    }

    /**
     * Loads scene content by `scenePath` specified.
     * @param {*} scenePath path to scene directory.
     */
    load(scenePath) {
        if (!this._parent) return;

        // remove "/" as a last char if exists
        if (scenePath.endsWith("/")) {
            scenePath = scenePath.substring(0, scenePath.length - 1);
        }

        // load html
        fetch(`${scenePath}/layout.html`).then(res => {
            if (!res.ok) return this.unload();
            
            res.text().then(content => {
                this._parent.innerHTML = content;

                // execute javascript
                fetch(`${scenePath}/main.js`).then(res => {
                    if (!res.ok) return this.unload();

                    res.text().then(code => {
                        eval(code);
                    }).catch(e => {
                        console.error(e);
                    });
                });
            });
        });
    }

    /**
     * Clears scene storage. Doesn't affect evaluating javascript code, 
     * so it have to be stopped from the inside.
     */
    clear() {
        if (!this._parent) return;
        this._parent.innerHTML = "";
    }
}
/**
 * Contains QoL to improve development process.
 */
class Tools {
    /**
     * Applies several styles to a <body> tag.
     */
    static useCustomBody() {
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

        if (type == FileType.text()) {
            data = await file.text();
        }

        if (type == FileType.bytes()) {
            data = await file.bytes();
        }

        if (type == FileType.json()) {
            data = await file.json();
        }

        return data;
    }
}
class Edge {
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }
}
class Mesh {
    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }
}
class Rect {
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
     * new Vector2(0, 0).
     */
    static get Zero() {
        return new Vector2(0, 0);
    }

    /**
     * Returns current vector length.
     */
    getLength() {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    /**
     * Adds `offsetVector` to current vector.
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
     * Rotates `Vector3` by specified angle around Y.
     * @param {*} angle angle in radians.
     * @returns Rotated `Vector3` object.
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
     * Rotates vector with specified angle around Z.
     * @param {*} angle angle in radians.
     * @returns Rotated `Vector3` object.
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
     * Rotates vector with specified angle around X.
     * @param {*} angle angle in radians.
     * @returns rotated `Vertex` object.
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
     * new Vector3(0, 0, 0).
     */
    static get Zero() {
        return new Vector3(0, 0, 0);
    }

    /**
     * Returns current vector length.
     */
    getLength() {
        return Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2)));
    }

    /**
     * Converts `Vector3` to `Vector2` projecting it to 2D space.
     * @returns New `Vector2` object.
     */
    toVector2() {
        return new Vector2(
            this.x / this.z,
            this.y / this.z
        );
    }

    /**
     * Rotates vector by a rotation vector specified.
     * @param {*} rotation rotation vector as `Vector3`.
     * @returns New rotated `Vector3`.
     */
    toRotation(rotation) {
        return this.#rotateYZ(rotation.x).#rotateXZ(rotation.y).#rotateXY(rotation.z);
    }

    /**
     * Adds `offsetVector` to current vector.
     * @param {*} offsetVector reference `Vector3`.
     * @returns New `Vector3`.
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
 * Works with meshes data.
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
     * @param {*} color Object color as HEX string.
     * @param {*} rotation Object rotation vector as `Vector3`.
     * @param {*} position Object position as `Vector2` [centered at (0, 0) by default].
     */
    drawObject(mesh, color, rotation = new Vector3(), position = new Vector2()) {
        const vertices  = mesh.vertices;
        const edges     = mesh.edges;
        const points    = [];
        
        this.ctx.clearRect(0, 0, this.rect.w, this.rect.h); // clear screen

        for (const vector3 of vertices) {
            var vector2 = vector3.toRotation(rotation).toVector2();     // point projection in local coords
            var point   = this.#map(vector2).add(position);   // point projection in canvas coords

            points.push(point); // add point to a list
        }

        for (let i = 0; i < points.length; i++) {
            // draw a vertex (im not sure if it's needed, maybe not.)
            this.#drawDot(color, points[i]);
        }

        for (let j = 0; j < edges.length; j++) {
            const beginVector   = points[ edges[j].begin ];
            const targetVector  = points[ edges[j].end   ];
            this.#drawLine(color, beginVector, targetVector);
        }
    }
}

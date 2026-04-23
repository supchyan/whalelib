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
     * Evaluates javascript by path specified.
     * @param {*} path path to javascript file to evaluate.
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
}

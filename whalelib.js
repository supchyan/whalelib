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

    /**
     * Returns `true` if `element` has empty body.
     */
    static isEmpty(element) {
        return element.innerHTML == "";
    }
}
/**
 * Manages scene loading process.
 * 
 * To load the scene call `SceneLoader.load("path/to/scene_folder")`;
 * 
 * To unload the scene call `SceneLoader.unload()`;
 */
class Scene {
    /**
     * @param {*} scene `HTMLElement` reference. Use something like `document.getElementById()`. 
    *                   It will be used as a container to store scene content.
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
     * Loads scene content by `scenePath` specified.
     * @param {*} scenePath Path to scene directory.
     */
    load(scenePath) {
        if (!this._parent) return;

        // remove "/" as a last char if exists
        if (scenePath.endsWith("/")) {
            scenePath = scenePath.substring(0, scenePath.length - 1);
        }

        // load html
        fetch(`${scenePath}/index.html`).then(res => {
            if (!res.ok) return this.unload();
            
            res.text().then(content => {
                this._parent.innerHTML = content;

                // execute javascript
                fetch(`${scenePath}/script.js`).then(res => {
                    if (!res.ok) return this.unload();

                    res.text().then(code => {
                        eval(code);

                        // switch loaded flag
                        this.isLoaded = true;
                    }).catch(e => {
                        console.error(e);
                    });
                });
            });
        });
    }

    /**
     * Unloads scene. Doesn't affect evaluated javascript code, 
     * so it have to be stopped from the inside.
     */
    unload() {
        if (!this._parent) return;

        this._parent.innerHTML = "";
    }
}
/**
 * Manages scene loading process.
 * Usage: Create `<root></root>` in your `index.html` to make this loader work.
 * So:
 * ```html
 * <body>
 *  <root>
 *  ... scene will load here ...
 *  </root>
 * </body>
 * ```
 */
class SceneLoader {
    /**
     * Current loaded scene
     */
    static #current_scene = null;
    /**
     * Loads scene by `scene_path` in specified `root` node.
     * @param {*} scene_path Path to scene directory
     */
    static load(scene_path) {
        this.#current_scene = scene_path;
        // load html
        fetch(`${scene_path}/index.html`).then(res => {
            res.text().then(content => {
                document.getElementsByTagName("root")[0].innerHTML = content;
                // exec js
                fetch(`${scene_path}/script.js`).then(res => {
                    res.text().then(code => {
                        eval(code);
                    });
                });
            });
        });
        // css is unneded to be loaded this way,
        // just add <link stylesheet> tag to the loadable html body.
    }
    /**
     * Unloads scene. Doesn't affect evaluated javascript code, 
     * so it have to be stopped on place.
     */
    static unload() {
        document.getElementsByTagName("root")[0].innerHTML = "";
        this.#current_scene = null;
    }
    /**
     * Returns current loaded scene path or `null` if nothing is loaded.
     */
    static get_scene() {
        return this.#current_scene;
    }
}
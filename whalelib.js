/**
 * Contains methods related to system features of the lib, such as scene layout initialization.
 */
class SceneSystem {
    /**
     * Initializes `index.html` modifying styles for working with whale-lib.
     */
    static init() {
        document.body.setAttribute("style", `/* modified by whale-lib */
            padding: 0;
            margin: 0;
        `);

        if (document.getElementsByTagName("root").length == 0) {
            const root = document.createElement("root");
            root.setAttribute("style", `/* modified by whale-lib */
                box-sizing: border-box;
                display: block;
                background-color: #111;

                width: 100vw;
                height: 100vh;

                overflow: hidden;

                padding: 0;
                margin: 0;
            `);

            document.body.appendChild(root);
        }
    }
}
/**
 * Manages scene loading process.
 * 
 * To load the scene call `SceneLoader.load("path/to/scene_folder")`;
 * 
 * To unload the scene call `SceneLoader.unload()`;
 * 
 * To get scene name call `SceneLoader.get_scene()`.
 */
class SceneLoader {   
    /**
     * Flag of whenever debug messages is allowed for a `SceneLoader`.
     */
    static #is_debug_enabled = false;
    /**
     * Current loaded scene path [name].
     */
    static #current_scene = null;

    static #root_err_msg() { 
        return "<root> node is not initialized. Use `SceneSystem.init()` from `scene_system.js` before loading/unloading any scene.";
    } 
    static #html_loaded_msg(scene) { 
        return `Loaded HTML of <${scene}>`;
    }
    static #html_load_err_msg(scene) { 
        return `Cannot load "index.html" of <${scene}>. Does the file exist?`;
    } 
    static #js_loaded_msg(scene) { 
        return `Evaluated javascript of <${scene}>`;
    }
    static #js_load_err_msg(scene) { 
        return `Cannot load "script.js" of <${scene}>. Does the file exist?`;
    } 
    static #js_eval_err_msg(scene) { 
        return `Cannot evaluate javascript of <${scene}>`;
    } 
    static #scene_unloaded_msg(scene) { 
        return `Unloaded scene: <${scene}>`;
    }

    /**
     * Sends debug message to a console if debug mode is enabled.
     */
    static #debug_message(message) {
        if (this.#is_debug_enabled) {
            console.debug(`[DEBUG] ${message}`);
        }
    }
    /**
     * Returns root element if exist.
     */
    static #get_root() {
        if (document.getElementsByTagName("root").length == 0) {
            return null;
        }
        return document.getElementsByTagName("root")[0];
    }
    
    /** 
     * Call this to enable debug console to handle whenever scene is loaded/unloaded. 
     */
    static debug() {
        this.#is_debug_enabled = true;
    }

    /**
     * Loads scene by `scene_path` in specified `root` node. You can keep loaded **only** 1 scene at the same time.
     * @param {*} scene_path Path to scene directory.
     */
    static load(scene_path) {
        if (!this.#get_root()) {
            return console.error(this.#root_err_msg());
        }

        this.#current_scene = scene_path;

        // load html
        fetch(`${scene_path}/index.html`).then(res => {
            if (!res.ok) {
                this.#debug_message(this.#html_load_err_msg(this.#current_scene));
                this.unload();
                return;
            }
            
            res.text().then(content => {
                this.#get_root().innerHTML = content;
                this.#debug_message(this.#html_loaded_msg(this.#current_scene));

                // exec js
                fetch(`${scene_path}/script.js`).then(res => {
                    if (!res.ok) {
                        this.#debug_message(this.#js_load_err_msg(this.#current_scene));
                        this.unload();
                        return;
                    }

                    res.text().then(code => {
                        eval(code);
                        this.#debug_message(this.#js_loaded_msg(this.#current_scene));
                    }).catch(e => {
                        this.#debug_message(this.#js_eval_err_msg(this.#current_scene));
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
        if (!this.#get_root()) {
            return console.error(this.#root_err_msg());
        }

        this.#get_root().innerHTML = "";
        this.#debug_message(this.#scene_unloaded_msg(this.#current_scene));

        this.#current_scene = null;
    }

    /**
     * Returns current loaded scene name (path) or `null` if nothing is loaded.
     * 
     * You can use this method to handle loops in scene's javascript.
     */
    static get_current_scene() {
        return this.#current_scene;
    }
}
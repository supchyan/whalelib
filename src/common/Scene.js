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
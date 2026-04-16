// this is main script file of the scene.
// use it to invoke code from other `.js` files related to scene directory.

// store scene path upon load
var old_scene = SceneLoader.get_current_scene();

// offset to play with animations
// in example bounce() loop function
var offset = 0;

// bounce animation example loop
(function bounce() {
    if (SceneLoader.get_current_scene() == old_scene) {
        document.getElementById("example_element").style.scale = `${.5 + Math.abs(Math.pow(Math.sin(.05 * offset), 2))}`;

        offset++;

        // some logs to see loop's iterations
        console.log(Date.now());

        // repeat the scene loop if the scene is still loaded
        setTimeout(() => { bounce() }, 1);
    }
})();
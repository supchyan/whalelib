// this is main script file of the scene.
// use it to invoke code from other `.js` files related to scene directory.

// store scene name upon load
var scene_name = SceneLoader.get_scene();
// offset to play with in example
var offset = 0;

// bounce animation example loop
(function bounce() {
    document.getElementById("hello_element").style.transform = 
        `translateX(${Math.abs(Math.sin(.05*offset))}rem)`;

    offset++;

    // repeat the scene loop if scene is still loaded
    if (SceneLoader.get_scene() == scene_name) { // scene folder name
        setTimeout(() => { bounce() }, 1);
    }
})();
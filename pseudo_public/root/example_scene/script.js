// this is main script file of the scene.
// use it to invoke code from other `.js` files related to scene directory.

const elementId = "exampleElement";

// offset to play with animations
// in example bounce() loop function
var offset = 0;

// evaluate additional `.../misc/other_script.js` file.
Tools.eval("./root/example_scene/misc/other_script.js");

// bounce animation example loop
(function bounce() {
    if (!Tools.isEmpty(document.getElementById("root"))) {   // loop check if parent node is not empty
        document.getElementById(elementId).style.scale = `${1.25 + .1 * Math.sin(.1 * offset++)}`;
        
        console.debug(`Invoked at: ${Date.now()}`);

        setTimeout(() => { bounce() }, 1);
    }
})();
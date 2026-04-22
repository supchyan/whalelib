// this is main script file of the scene.
// use it to invoke code from other `.js` files related to scene directory.

// offset to play with animations
// in example bounce() loop function
var offset = 0;

// evaluate additional `.js` file.
Tools.eval("./scns/example_scene/src/text_replacer.js");

// bounce animation example loop
(function bounce() {
    // loop check if node exists
    if (document.getElementById("exampleElement")) {
        document.getElementById("exampleElement").style.scale = `${1.25 + .1 * Math.sin(.1 * offset++)}`;
        console.debug(`Invoked at: ${Date.now()}`);
        setTimeout(() => { bounce() }, 1);
    }
})();